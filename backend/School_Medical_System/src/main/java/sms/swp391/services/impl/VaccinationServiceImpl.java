package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.responses.*;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.NotificationService;
import sms.swp391.services.SendMailService;
import sms.swp391.services.VaccinationService;
import sms.swp391.utils.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VaccinationServiceImpl implements VaccinationService {

    private final VaccinationCampaignRepository campaignRepository;
    private final VaccinationConsentRepository consentRepository;
    private final VaccinationRecordRepository recordRepository;
    private final HealthConsultationScheduleRepository consultationScheduleRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SendMailService sendMailService;
    private final NotificationService notificationService;
    private final VaccinationConsentRepository vaccinationConsentRepository;

    private Long getCurrentUserId() {
        var principal = (UserEntity) org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getUserId();
    }

    @Transactional
    @Override
    public void remindUnconfirmedParents(Long campaignId) {
        var campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Not found"));

        List<VaccinationConsentEntity> pendingConsents =
                vaccinationConsentRepository.findByVaccinationCampaign_IdAndConsentStatus(campaignId, MedicalStatus.PENDING);

        for (var consent : pendingConsents) {
            var parent = consent.getParent();
            var student = consent.getStudent().getUser();

            sendMailService.sendReminderEmail(
                    parent.getEmail(),
                    parent.getFullname(),
                    student.getFullname(),
                    campaign.getName(),
                    campaign.getStartDate().toString(),
                    campaign.getEndDate().toString(),
                    campaign.getLocation()
            );

            notificationService.push(
                    getCurrentUserId(),
                    parent.getUserId(),
                    "Nhắc nhở xác nhận tiêm vaccxin",
                    "Bạn chưa xác nhận chiến dịch " + campaign.getName() + " của học sinh " + student.getFullname()
            );
        }
    }



    @Transactional
    @Override
    public List<VaccinationRecordResponse> createBulkRecords(CreateVaccinationRecordListRequestDTO request, Long nurseId) {
        List<VaccinationRecordRequestDTO> records = request.getRecords();

        UserEntity nurse = userRepository.findById(nurseId)
                .orElseThrow(() -> new NotFoundException("Nurse not found"));

        List<VaccinationRecordResponse> responses = new ArrayList<>();

        for (VaccinationRecordRequestDTO recordRequest : records) {
            Long campaignId = recordRequest.getCampaignId();
            Long studentId = recordRequest.getStudentId();

            VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                    .orElseThrow(() -> new NotFoundException("Campaign not found: " + campaignId));

            StudentEntity student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));

            VaccinationConsentEntity consent = consentRepository
                    .findByVaccinationCampaignIdAndStudent(campaignId, student);

            if (consent == null || consent.getConsentStatus() != MedicalStatus.APPROVED) {
                throw new BusinessException("Không có sự chấp thuận từ phụ huynh cho học sinh ID " + studentId);
            }

            VaccinationRecordEntity record = VaccinationRecordMapper.fromRequestDTO(recordRequest);
            record.setVaccinationCampaign(campaign);
            record.setStudent(student);
            record.setAdministeredBy(nurse);
            record.setAcademicYear(getCurrentAcademicYear());
            record.setAdministrationDate(LocalDate.now());
            record.setConsent(consent);

            VaccinationRecordEntity saved = recordRepository.save(record);

            // Cập nhật trạng thái consent
            consent.setConsentStatus(MedicalStatus.DONE);
            consentRepository.save(consent);

            // Gửi thông báo cho phụ huynh
            notificationService.push(
                    nurseId,
                    student.getParent().getUserId(),
                    "Kết quả tiêm chủng",
                    "Con bạn (" + student.getUser().getFullname() + ") đã được tiêm vắc-xin " +
                            record.getVaccineName() + " ngày " +
                            LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            );

            responses.add(VaccinationRecordMapper.toDTO(saved));
        }

        return responses;
    }



    // Campaign Methods
    @Override
    @Transactional
    public void endCampaign(Long campaignId) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));
        if (campaign.getEndDate().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chiến dịch chưa đến kết thúc. Ngày kết thúc là: " + campaign.getEndDate());
        }
        campaign.setStatus(MedicalStatus.DONE);
        campaignRepository.save(campaign);

        List<VaccinationConsentEntity> consents = consentRepository.findByVaccinationCampaignId(campaignId);

        List<VaccinationConsentEntity> toUpdate = new ArrayList<>();

        for (VaccinationConsentEntity consent : consents) {
            if (MedicalStatus.PENDING.equals(consent.getConsentStatus())) {
                consent.setConsentStatus(MedicalStatus.REJECTED);
                consent.setResponseDate(LocalDate.now());
                toUpdate.add(consent);

                notificationService.push(
                        campaign.getCreatedBy().getUserId(),
                        consent.getParent().getUserId(),
                        "Chiến dịch tiêm chủng đã kết thúc",
                        "Bạn chưa phản hồi đồng ý tiêm cho con trong chiến dịch \"" + campaign.getName() + "\". "
                                + "Chiến dịch hiện đã kết thúc."
                );
            }
        }

        if (!toUpdate.isEmpty()) {
            consentRepository.saveAll(toUpdate);
        }
    }


    @Transactional
    @Override
    public VaccinationCampaignResponse createCampaign(VaccinationCampaignRequestDTO req,
                                                      Long createdById) {

        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found " + createdById));

        if (req.getEndDate().isBefore(req.getStartDate())) {
            throw new BusinessException("Ngày kết thúc phải sau ngày bắt đầu");
        }

        VaccinationCampaignEntity campaign = VaccinationCampaignMapper.fromRequestDTO(req);
        campaign.setCreatedBy(creator);
        campaign.setStatus(MedicalStatus.PENDING);
        campaign.setCreatedAt(LocalDateTime.now().withSecond(0).withNano(0));

        campaign = campaignRepository.save(campaign);

        // Lấy HS theo khối và tạo consent
        List<StudentEntity> students =
                studentRepository.findByGradesWithUserAndParent(req.getTargetGrade());

        List<VaccinationConsentEntity> consents = new ArrayList<>(students.size());
        for (StudentEntity s : students) {
            consents.add(VaccinationConsentEntity.builder()
                    .vaccinationCampaign(campaign)
                    .student(s)
                    .parent(s.getParent())
                    .consentStatus(MedicalStatus.PENDING)
                    .academicYear(getCurrentAcademicYear())
                    .build());
        }
        consentRepository.saveAll(consents);   // bulk‑insert

        return VaccinationCampaignMapper.toDTO(campaign);
    }

    @Transactional
    @Override
    public void sendConsentNotifications(Long campaignId, Long triggeredByUserId) {

        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found: " + campaignId));

        UserEntity triggerUser = userRepository.findById(triggeredByUserId)
                .orElseThrow(() -> new NotFoundException("User not found: " + triggeredByUserId));

        // Lấy consent & gom theo phụ huynh (mỗi phụ huynh 1 thông báo/mail)
        List<VaccinationConsentEntity> consents =
                consentRepository.findAllByVaccinationCampaignId(campaignId);

        Map<Long, VaccinationConsentEntity> perParent = new HashMap<>();
        for (VaccinationConsentEntity c : consents) {
            perParent.putIfAbsent(c.getParent().getUserId(), c);
        }

        // Thread pool hoặc @Async tuỳ nhu cầu
        ExecutorService pool = Executors.newFixedThreadPool(10);

        perParent.values().forEach(consent -> pool.submit(() -> {

            UserEntity parent = consent.getParent();
            StudentEntity student = consent.getStudent();

            // (1) Gửi email – nếu bạn đã có sendMailService riêng
            sendMailService.sendConsentRequestEmail(
                    parent.getEmail(),
                    parent.getFullname(),
                    student.getUser().getFullname(),
                    campaign.getName(),
                    campaign.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    campaign.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    campaign.getLocation()
            );

            // (2) Push notification
            notificationService.push(
                    triggerUser.getUserId(),
                    parent.getUserId(),
                    "Yêu cầu đồng ý tiêm chủng",
                    "Vui lòng xác nhận chiến dịch \"" + campaign.getName()
                            + "\" (vắc xin: " + campaign.getVaccineType() + ")"
            );
        }));

        pool.shutdown();
    }


    @Override
    public void startCampaign(Long campaignId) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found " + campaignId));

        if (campaign.getStartDate().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chiến dịch chưa tới ngày bắt đầu. Ngày bắt đầu là: " + campaign.getEndDate());
        }
        campaign.setStatus(MedicalStatus.ACTIVE);
        campaignRepository.save(campaign);
    }


    @Override
    @Transactional
    public VaccinationCampaignResponse updateCampaign(Long id, VaccinationCampaignRequestDTO request) {

        VaccinationCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

        // 1. Cập nhật thông tin chiến dịch
        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setTargetGrade(
                request.getTargetGrade() != null
                        ? String.join(",", request.getTargetGrade())
                        : campaign.getTargetGrade()
        );
        campaign.setNotes(request.getNotes());
        campaign.setVaccineType(request.getVaccineType());

        // 2. Lưu chiến dịch đã cập nhật
        VaccinationCampaignEntity updatedCampaign = campaignRepository.save(campaign);

        // 3. Danh sách học sinh mới từ khối lớp được chọn
        List<StudentEntity> newStudents = studentRepository.findByGradesWithUserAndParent(request.getTargetGrade());

        // 4. Lấy các consent hiện tại và tìm học sinh cũ
        List<VaccinationConsentEntity> existingConsents = consentRepository.findByVaccinationCampaignId(updatedCampaign.getId());
        Set<Long> oldStudentIds = existingConsents.stream()
                .map(consent -> consent.getStudent().getId())
                .collect(Collectors.toSet());

        // 5. Đánh dấu consent cũ là DELETED nếu học sinh không còn trong khối lớp mới
        for (VaccinationConsentEntity consent : existingConsents) {
            Long studentId = consent.getStudent().getId();
            boolean stillExists = newStudents.stream().anyMatch(s -> s.getId().equals(studentId));
            if (!stillExists) {
                consent.setConsentStatus(MedicalStatus.DELETED);
            }
        }
        consentRepository.saveAll(existingConsents);

        // 6. Tạo consent mới cho học sinh chưa có, và gửi thông báo/email
        Set<Long> notifiedParents = new HashSet<>();
        for (StudentEntity student : newStudents) {
            if (!oldStudentIds.contains(student.getId())) {
                VaccinationConsentEntity newConsent = VaccinationConsentEntity.builder()
                        .vaccinationCampaign(updatedCampaign)
                        .student(student)
                        .parent(student.getParent())
                        .consentStatus(MedicalStatus.PENDING)
                        .academicYear(getCurrentAcademicYear())
                        .build();
                consentRepository.save(newConsent);

                Long parentId = student.getParent().getUserId();
                if (notifiedParents.add(parentId)) {
                    // Gửi thông báo
                    notificationService.push(
                            updatedCampaign.getCreatedBy().getUserId(),
                            parentId,
                            "Yêu cầu đồng ý tiêm chủng",
                            "Vui lòng xác nhận chiến dịch \"" + updatedCampaign.getName()
                                    + "\" dành cho học sinh " + student.getUser().getFullname()
                    );

//                    sendMailService.sendConsentRequestEmail(
//                            student.getParent().getEmail(),
//                            student.getParent().getFullname(),
//                            student.getUser().getFullname(),
//                            updatedCampaign.getName(),
//                            updatedCampaign.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
//                            updatedCampaign.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
//                            updatedCampaign.getVaccineType()
//                    );
                }
            }
        }

        return VaccinationCampaignMapper.toDTO(updatedCampaign);
    }


    @Override
    public VaccinationCampaignResponse getCampaignById(Long id) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));
        return VaccinationCampaignMapper.toDTO(campaign);
    }

    @Override
    public List<VaccinationCampaignResponse> getAllCampaigns() {
        List<VaccinationCampaignEntity> campaigns = campaignRepository.findAll();
        return campaigns.stream()
                .map(VaccinationCampaignMapper::toDTO)
                .toList();
    }

    @Override
    public List<VaccinationCampaignResponse> getAllCampaignsStart() {
        List<VaccinationCampaignEntity> campaigns = campaignRepository.getAllByVaccinationCampaign();
        return campaigns.stream()
                .map(VaccinationCampaignMapper::toDTO)
                .toList();
    }

    // Consent Methods
    @Override
    public VaccinationConsentResponse updateConsent(Long consentId,
                                                    VaccinationConsentRequestDTO request,
                                                    Long parentId) {

        VaccinationConsentEntity consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + consentId));

        if (!consent.getParent().getUserId().equals(parentId)) {
            throw new AuthFailedException("Only the parent can update this consent");
        }

        consent.setConsentStatus(request.getConsentStatus());
        consent.setResponseDate(LocalDate.now());

        VaccinationConsentEntity updatedConsent = consentRepository.save(consent);

        return VaccinationConsentMapper.toDTO(updatedConsent);
    }

    // ------------ SAVE RECORD (STAFF) -------------
    @Transactional
    public int importVaccinationResults(List<VaccinationRecordRequestDTO> records, Long nurseId) {
        int successCount = 0;

        for (VaccinationRecordRequestDTO dto : records) {
            try {
                saveRecord(dto, nurseId);
                successCount++;
            } catch (Exception ex) {
                throw new RuntimeException("Lỗi khi lưu kết quả tiêm cho studentId=" + dto.getStudentId() + ": " + ex.getMessage());
            }
        }

        return successCount;
    }

    @Override
    @Transactional
    public VaccinationRecordResponse saveRecord(VaccinationRecordRequestDTO request,
                                                Long nurseId) {

        VaccinationCampaignEntity campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));
        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));
        UserEntity nurse = userRepository.findById(nurseId)
                .orElseThrow(() -> new NotFoundException("Nurse not found"));

        VaccinationConsentEntity consent =
                consentRepository.findByVaccinationCampaignIdAndStudent(campaign.getId(), student);

        if (consent == null || consent.getConsentStatus() != MedicalStatus.APPROVED) {
            throw new BusinessException("Parent consent not approved for this vaccination");
        }

        VaccinationRecordEntity record = VaccinationRecordMapper.fromRequestDTO(request);
        record.setVaccinationCampaign(campaign);
        record.setStudent(student);
        record.setAdministeredBy(nurse);
        record.setAdministrationDate(LocalDate.now());
        record.setAcademicYear(getCurrentAcademicYear());
        record.setConsent(consent);

        VaccinationRecordEntity saved = recordRepository.save(record);
        consent.setConsentStatus(MedicalStatus.DONE);
        consentRepository.save(consent);

        notificationService.push(
                nurseId,
                student.getParent().getUserId(),
                "Kết quả tiêm chủng",
                "Con bạn (" + student.getUser().getFullname() + ") đã được tiêm vắc‑xin "
                        + record.getVaccineName() + " ngày "
                        + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );

        return VaccinationRecordMapper.toDTO(saved);
    }

    @Override
    public List<VaccinationConsentResponse> getConsentsByCampaign(Long campaignId) {
        List<VaccinationConsentEntity> consents = consentRepository.findByVaccinationCampaignId(campaignId);
        return consents.stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();
    }

    @Override
    public VaccinationConsentResponse getConsentById(Long id) {
        VaccinationConsentEntity consent = consentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + id));
        return VaccinationConsentMapper.toDTO(consent);
    }

    @Override
    public List<VaccinationConsentResponse> getPendingConsentsByParent(Long parentId) {
        List<VaccinationConsentEntity> consents = consentRepository.findByParent_UserIdAndConsentStatus(parentId, MedicalStatus.PENDING);
        return consents.stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();
    }

    @Override
    public List<VaccinationConsentResponse> getPendingConsentsApprovedByParent(Long parentId) {
        List<VaccinationConsentEntity> consents = consentRepository.findByParent_UserIdAndConsentStatus(parentId, MedicalStatus.APPROVED);
        return consents.stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();
    }


    @Override
    public VaccinationRecordResponse getRecordById(Long id) {
        VaccinationRecordEntity record = recordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Record not found with id: " + id));
        return VaccinationRecordMapper.toDTO(record);
    }

    @Override
    public List<VaccinationRecordResponse> getRecordsByCampaign(Long campaignId) {
        List<VaccinationRecordEntity> records = recordRepository.findByVaccinationCampaign_Id(campaignId);
        return records.stream()
                .map(VaccinationRecordMapper::toDTO)
                .toList();
    }

    @Override
    public List<VaccinationRecordResponse> getRecordsByStudent(Long studentId) {
        List<VaccinationRecordEntity> records = recordRepository.findByStudentId(studentId);
        if (records.isEmpty()) throw new NotFoundException("Result not found with id: " + studentId);
        return records.stream()
                .map(VaccinationRecordMapper::toDTO)
                .toList();
    }


    // Utility
    private String getCurrentAcademicYear() {
        int year = Year.now().getValue();
        return year + "-" + (year + 1);
    }

    @Override
    public PaginatedVaccinationConsentResponse getAllVaccinationConsents(String search, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String property = order.getProperty();
                    return property.equals("id") ||
                            property.equals("consentStatus") ||
                            property.equals("academicYear") ||
                            property.equals("student.user.fullname") ||
                            property.equals("vaccinationCampaign.name");
                })
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        Sort::by
                ));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<VaccinationConsentEntity> vaccinationConsentPage;
        if (search != null && !search.isEmpty()) {
            vaccinationConsentPage = vaccinationConsentRepository.searchVaccinationConsents(search, validatedPageable);
        } else {
            vaccinationConsentPage = vaccinationConsentRepository.findApprovedStudent(validatedPageable);
        }

        List<VaccinationConsentResponse> vaccinationConsentDTOs = vaccinationConsentPage.stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();

        return PaginatedVaccinationConsentResponse.builder()
                .vaccinationConsents(vaccinationConsentDTOs)
                .totalElements(vaccinationConsentPage.getTotalElements())
                .totalPages(vaccinationConsentPage.getTotalPages())
                .currentPage(vaccinationConsentPage.getNumber())
                .build();
    }

    @Override
    public void deleteCampaign(Long campaignId) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));
        campaign.setStatus(MedicalStatus.REJECTED);

        List<VaccinationConsentEntity> consentEntities =
                consentRepository.findByVaccinationCampaignId(campaignId);
        for (VaccinationConsentEntity c : consentEntities) {
            c.setConsentStatus(MedicalStatus.REJECTED);
        }
        consentRepository.saveAll(consentEntities);
        campaignRepository.save(campaign);
    }

    @Override
    public PaginatedVaccinationConsentResponse getApprovedConsentsByCampaign(Long campaignId, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String property = order.getProperty();
                    return property.equals("id") || property.equals("responseDate") || "parent.userId".equals(property) || "student.id".equals(property);
                })
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        Sort::by
                ));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<VaccinationConsentEntity> vaccinationConsentPage = vaccinationConsentRepository.findApprovedConsentsByCampaignId(campaignId, validatedPageable);

        List<VaccinationConsentResponse> vaccinationConsentDTOs = vaccinationConsentPage.stream()
                .map(VaccinationConsentMapper::toDTO)
                .toList();

        return PaginatedVaccinationConsentResponse.builder()
                .vaccinationConsents(vaccinationConsentDTOs)
                .totalElements(vaccinationConsentPage.getTotalElements())
                .totalPages(vaccinationConsentPage.getTotalPages())
                .currentPage(vaccinationConsentPage.getNumber())
                .build();
    }

}