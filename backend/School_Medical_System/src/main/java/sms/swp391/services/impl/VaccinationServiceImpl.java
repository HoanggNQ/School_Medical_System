package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    // Campaign Methods
    public void endCampaign(Long campaignId) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        campaign.setStatus(MedicalStatus.DONE);
        campaignRepository.save(campaign);
    }

    @Override
    public VaccinationCampaignResponse createCampaign(VaccinationCampaignRequestDTO request, Long createdById) {
        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createdById));

        VaccinationCampaignEntity campaign = VaccinationCampaignMapper.fromRequestDTO(request);
        campaign.setCreatedBy(creator);
        campaign.setCreatedAt(LocalDate.now());
        campaign.setStatus(MedicalStatus.PENDING);

        VaccinationCampaignEntity savedCampaign = campaignRepository.save(campaign);
        return VaccinationCampaignMapper.toDTO(campaignRepository.save(campaign));
    }

    @Override
    public VaccinationCampaignResponse updateCampaign(Long id, VaccinationCampaignRequestDTO request) {

        VaccinationCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

        /* 1. Cập nhật thông tin */
        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setEndDate(request.getEndDate());
        campaign.setStartDate(request.getStartDate());
        campaign.setTargetGrade(request.getTargetGrade());
        campaign.setNotes(request.getNotes());
        campaign.setVaccineType(request.getVaccineType());

        /* 2. Lưu campaign */
        VaccinationCampaignEntity updatedCampaign = campaignRepository.save(campaign);

        /* 3. Lấy danh sách HS theo khối mới */
        List<StudentEntity> targetStudents =
                studentRepository.findByClassEntity_GradeWithUserAndParent(updatedCampaign.getTargetGrade());

        /* 4. Gửi thông báo cho PH (loại bỏ trùng lặp) */
        Set<Long> notifiedParents = new HashSet<>();
        for (StudentEntity student : targetStudents) {
            Long parentId = student.getParent().getUserId();
            if (notifiedParents.add(parentId)) {
                notificationService.push(
                        updatedCampaign.getCreatedBy().getUserId(),    // creator (người sửa)
                        parentId,                                      // receiver (PH)
                        "Cập nhật chiến dịch tiêm chủng",
                        "Chiến dịch \"" + updatedCampaign.getName() +
                                "\" (vắc xin: " + updatedCampaign.getVaccineType() + ") đã thay đổi lịch/chi tiết. "
                                + "Vui lòng kiểm tra thông tin mới."
                );
            }
        }

        return VaccinationCampaignMapper.toDTO(updatedCampaign);
    }

    @Override
    public void startCampaign(Long campaignId) {
        VaccinationCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        List<StudentEntity> targetStudents =
                studentRepository.findByClassEntity_GradeWithUserAndParent(campaign.getTargetGrade());

        for (StudentEntity student : targetStudents) {

            /* 1. Lưu consent PENDING */
            VaccinationConsentEntity consent = VaccinationConsentEntity.builder()
                    .vaccinationCampaign(campaign)
                    .student(student)
                    .parent(student.getParent())
                    .consentStatus(MedicalStatus.PENDING)
                    .academicYear(getCurrentAcademicYear())
                    .build();
            consentRepository.save(consent);

            /* 2. Gửi email */
            sendMailService.sendConsentRequestEmail(
                    student.getParent().getEmail(),
                    student.getParent().getFullname(),
                    student.getUser().getFullname(),
                    campaign.getName(),
                    campaign.getStartDate().toString(),
                    campaign.getVaccineType()
            );

            /* 3. Gửi notification realtime cho PH */
            notificationService.push(
                    campaign.getCreatedBy().getUserId(),          // creator (NV y tế)
                    student.getParent().getUserId(),              // receiver (PH)
                    "Yêu cầu đồng ý tiêm chủng",
                    "Vui lòng xem và xác nhận chiến dịch \"" + campaign.getName()
                            + "\" (vắc xin: " + campaign.getVaccineType() + ") bắt đầu ngày "
                            + campaign.getStartDate()
                            .format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "."
            );
        }

        /* 4. Cập nhật trạng thái campaign */
        campaign.setStatus(MedicalStatus.ACTIVE);
        campaignRepository.save(campaign);
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
    @Override
    public VaccinationRecordResponse saveRecord(VaccinationRecordRequestDTO request,
                                                Long administeredById) {

        // 1. Lấy entity
        VaccinationCampaignEntity campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));
        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));
        UserEntity checker = userRepository.findById(administeredById)
                .orElseThrow(() -> new NotFoundException("Checker not found"));

        // 2. Kiểm tra consent
        VaccinationConsentEntity consent =
                consentRepository.findByVaccinationCampaignIdAndStudent(campaign.getId(), student);

        if (consent == null || !MedicalStatus.APPROVED.equals(consent.getConsentStatus())) {
            throw new BusinessException("Parent consent not approved for this vaccination");
        }

        // 3. Tạo & lưu record
        VaccinationRecordEntity record = VaccinationRecordMapper.fromRequestDTO(request);
        record.setVaccinationCampaign(campaign);
        record.setStudent(student);
        record.setAdministeredBy(checker);
        record.setAdministrationDate(LocalDate.now());
        record.setAcademicYear(getCurrentAcademicYear());
        record.setConsent(consent);

        VaccinationRecordEntity savedRecord = recordRepository.save(record);
        consent.setConsentStatus(MedicalStatus.DONE);
        consentRepository.save(consent);

        notificationService.push(
                administeredById,                         // creator  (NV y tế)
                student.getParent().getUserId(),          // receiver (PH)
                "Kết quả tiêm chủng",
                "Con bạn (" + student.getUser().getFullname() + ") đã được tiêm vắc xin "
                        + campaign.getVaccineType() + " vào "
                        + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "."
        );

        return VaccinationRecordMapper.toDTO(savedRecord);
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
        if (records.isEmpty()) throw  new NotFoundException("Result not found with id: " + studentId);
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