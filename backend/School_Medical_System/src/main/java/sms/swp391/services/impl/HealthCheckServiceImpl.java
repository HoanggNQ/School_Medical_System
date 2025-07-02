package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.responses.*;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.HealthCheckService;
import sms.swp391.services.NotificationService;
import sms.swp391.services.SendMailService;
import sms.swp391.utils.HealthCheckCampaignMapper;
import sms.swp391.utils.HealthCheckConsentMapper;
import sms.swp391.utils.HealthCheckResultMapper;
import sms.swp391.utils.VaccinationConsentMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthCheckServiceImpl implements HealthCheckService {
    private final HealthCheckCampaignRepository campaignRepository;
    private final HealthCheckConsentRepository consentRepository;
    private final HealthCheckResultRepository resultRepository;
    private final HealthConsultationScheduleRepository consultationScheduleRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SendMailService sendMailService;
    private final NotificationService notificationService;
    private final HealthCheckConsentRepository healthCheckConsentRepository;

    Long getCurrentUserId() {
        var principal = (UserEntity) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getUserId();
    }


    @Override
    public void endCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        campaign.setStatus(MedicalStatus.DONE);
        campaignRepository.save(campaign);
    }

    @Override
    public HealthCheckCampaignResponse createCampaign(HealthCheckCampaignRequestDTO request, Long createdById) {
        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createdById));

        HealthCheckCampaignEntity campaign = HealthCheckCampaignMapper.fromRequestDTO(request);
        campaign.setCreatedBy(creator);
        campaign.setStatus(MedicalStatus.PENDING);
        campaign.setCreatedAt(LocalDateTime.now().withSecond(0).withNano(0));

        HealthCheckCampaignEntity savedCampaign = campaignRepository.save(campaign);
        return HealthCheckCampaignMapper.toDTO(savedCampaign);
    }

    @Override
    public HealthCheckCampaignResponse updateCampaign(Long id, HealthCheckCampaignRequestDTO request) {

        HealthCheckCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

        // 1. Cập nhật thông tin
        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setCheckDate(request.getCheckDate());
        campaign.setTargetGrade(request.getTargetGrade());
        campaign.setLocation(request.getLocation());
        campaign.setRequiredEquipment(request.getRequiredEquipment());

        // 2. Lưu campaign trước rồi mới đẩy thông báo
        HealthCheckCampaignEntity updatedCampaign = campaignRepository.save(campaign);

        // 3. Lấy danh sách HS thuộc khối mới
        List<StudentEntity> targetStudents =
                studentRepository.findByClassEntity_GradeWithUserAndParent(updatedCampaign.getTargetGrade());

        // 4. Gửi thông báo cho PH (tránh trùng lặp nếu PH có nhiều con)
        Set<Long> notifiedParents = new HashSet<>();
        for (StudentEntity student : targetStudents) {
            Long parentId = student.getParent().getUserId();
            if (notifiedParents.add(parentId)) {                // chỉ gửi 1 lần/PH
                notificationService.push(
                        getCurrentUserId(),                     // creator (người sửa)
                        parentId,                               // receiver (PH)
                        "Cập nhật chiến dịch kiểm tra sức khỏe",
                        "Chiến dịch \"" + updatedCampaign.getName() +
                                "\" của khối " + updatedCampaign.getTargetGrade() +
                                " đã thay đổi. Vui lòng kiểm tra thông tin mới."
                );
            }
        }

        return HealthCheckCampaignMapper.toDTO(updatedCampaign);
    }


    @Override
    public void startCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        List<StudentEntity> targetStudents =
                studentRepository.findByClassEntity_GradeWithUserAndParent(campaign.getTargetGrade());

        for (StudentEntity student : targetStudents) {

            HealthCheckConsentEntity consent = HealthCheckConsentEntity.builder()
                    .healthCheckCampaign(campaign)
                    .student(student)
                    .parent(student.getParent())
                    .consentStatus(MedicalStatus.PENDING)
                    .academicYear(getCurrentAcademicYear())
                    .build();
            consentRepository.save(consent);

            sendMailService.sendConsentRequestEmail(
                    student.getParent().getEmail(),
                    student.getParent().getFullname(),
                    student.getUser().getFullname(),
                    campaign.getName(),
                    campaign.getCheckDate().toString(),
                    campaign.getLocation()
            );

            String campaignName = campaign.getName().toUpperCase();
            String studentName = student.getUser().getFullname().toUpperCase();
            String checkDate = campaign.getCheckDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            String content = "Vui lòng xem và xác nhận cho chiến dịch " +
                    campaignName + " của học sinh " + studentName +
                    " ngày " + checkDate + ".";

            notificationService.push(
                    getCurrentUserId(),                          // creator
                    student.getParent().getUserId(),             // receiver
                    "Yêu cầu đồng ý kiểm tra sức khỏe",
                    content
            );

        }

        campaign.setStatus(MedicalStatus.APPROVED);
        campaignRepository.save(campaign);
    }


    @Override
    public HealthCheckConsentResponse updateConsent(Long consentId, HealthCheckConsentRequestDTO request, Long parentId) {
        HealthCheckConsentEntity consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + consentId));

        if (!consent.getParent().getUserId().equals(parentId)) {
            throw new BusinessException("Parent not authorized to update this consent");
        }

        consent.setConsentStatus(request.getStatus());
        consent.setResponseDate(LocalDate.now());

        HealthCheckConsentEntity updatedConsent = consentRepository.save(consent);

        return HealthCheckConsentMapper.toDTO(updatedConsent);
    }

    @Override
    @Transactional
    public HealthCheckResultResponse saveResult(HealthCheckResultRequestDTO request, Long checkedById) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));

        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));

        UserEntity checker = userRepository.findById(checkedById)
                .orElseThrow(() -> new NotFoundException("Checker not found"));

        HealthCheckConsentEntity consent = consentRepository.findByHealthCheckCampaignIdAndStudent(campaign.getId(), student);
        if (consent == null || !MedicalStatus.APPROVED.equals(consent.getConsentStatus())) {
            throw new BusinessException("Parent consent not approved for this examination");
        }

        StudentHealthProfileEntity profile = student.getHealthProfile();
        if (profile == null) {
            profile = new StudentHealthProfileEntity();
            profile.setStudent(student);
            student.setHealthProfile(profile);
        }

        profile.setHeight(request.getHeightCm());
        profile.setWeight(request.getWeightKg());
        profile.setVisionLeft(request.getVisionLeft());
        profile.setVisionRight(request.getVisionRight());
        profile.setHearing(request.getHearing());
        profile.setDentalHealth(request.getDentalHealth());
        profile.setBloodPressure(request.getBloodPressure());
        profile.setPulse(request.getPulse());
        profile.setTemperature(request.getTemperature());

        if (request.getHeightCm() != null && request.getWeightKg() != null) {
            profile.setBmi(calculateBMI(request.getHeightCm(), request.getWeightKg()));
        }

        HealthCheckResultEntity result = HealthCheckResultMapper.fromRequestDTO(request);
        result.setHealthCheckCampaign(campaign);
        result.setStudent(student);
        result.setCheckedBy(checker);
        result.setCheckDate(LocalDate.now());
        result.setAcademicYear(getCurrentAcademicYear());
        result.setConsent(consent);

        HealthCheckResultEntity savedResult = resultRepository.saveAndFlush(result);
        consent.setConsentStatus(MedicalStatus.DONE);
        consentRepository.save(consent);
        studentRepository.save(student);

        notificationService.push(
                checkedById,                          // nhân viên y tế
                student.getParent().getUserId(),      // PH
                "Kết quả kiểm tra sức khỏe",
                "Kết quả kiểm tra của " + student.getUser().getFullname()
                        + " đã sẵn sàng Phụ huynh có xem chi tiết ở Mail."
        );

        if (Boolean.TRUE.equals(savedResult.getFollowUpRequired()) || isAbnormal(savedResult)) {
            LocalDateTime scheduleTime;
            if (request.getScheduleTime() != null) {
                scheduleTime = request.getScheduleTime();
            } else {
                int daysLater = extractFollowUpDays(savedResult.getFollowUpNotes());
                scheduleTime = LocalDate.now().plusDays(daysLater).atTime(8, 0);
            }

            HealthConsultationScheduleEntity schedule = HealthConsultationScheduleEntity.builder()
                    .student(student)
                    .result(savedResult)
                    .reason("Kết quả kiểm tra y tế bất thường")
                    .scheduleTime(scheduleTime)
                    .status(MedicalStatus.PENDING)
                    .build();

            consultationScheduleRepository.save(schedule);

            sendMailService.sendConsultationScheduleEmail(
                    student.getParent().getEmail(),
                    student.getUser().getFullname(),
                    scheduleTime.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")),
                    schedule.getReason()
            );
            notificationService.push(
                    checkedById,
                    student.getParent().getUserId(),
                    "Lịch tư vấn sức khỏe",
                    "Con bạn cần tư vấn sức khỏe vào "
                            + scheduleTime.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"))
            );
        }

        return HealthCheckResultMapper.toDTO(savedResult);
    }

    private int extractFollowUpDays(String followUpNotes) {
        if (followUpNotes == null) return 1;

        Pattern pattern = Pattern.compile("(\\d+)\\s*ngày", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(followUpNotes);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 1;
    }

    private boolean isAbnormal(HealthCheckResultEntity result) {
        StudentHealthProfileEntity p = result.getStudent().getHealthProfile();
        if (p == null) return false;

        if (p.getTemperature() != null && p.getTemperature().compareTo(BigDecimal.valueOf(38.0)) > 0)
            return true;

        if (p.getBloodPressure() != null && p.getBloodPressure().contains("/")) {
            String[] parts = p.getBloodPressure().split("/");
            try {
                int sys = Integer.parseInt(parts[0].trim());
                int dia = Integer.parseInt(parts[1].trim());
                if (sys > 140 || dia > 90) return true;
            } catch (NumberFormatException ignored) {}
        }

        try {
            if (p.getVisionLeft() != null && Float.parseFloat(p.getVisionLeft()) < 5.0f) return true;
            if (p.getVisionRight() != null && Float.parseFloat(p.getVisionRight()) < 5.0f) return true;
        } catch (NumberFormatException ignored) {}

        return false;
    }



    @Override
    public HealthCheckCampaignResponse getCampaignById(Long id) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));
        return HealthCheckCampaignMapper.toDTO(campaign);
    }

    @Override
    public HealthCheckConsentResponse getConsentById(Long id) {
        HealthCheckConsentEntity consent = consentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + id));
        return HealthCheckConsentMapper.toDTO(consent);
    }

    @Override
    public List<HealthCheckConsentResponse> getConsentsByCampaign(Long campaignId) {
        List<HealthCheckConsentEntity> consents = consentRepository.findByHealthCheckCampaignId(campaignId);
        return consents.stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }

    @Override
    public List<HealthCheckConsentResponse> getPendingConsentsByParent(Long parentId) {
        List<HealthCheckConsentEntity> consents = consentRepository.findByParent_UserIdAndConsentStatus(parentId, MedicalStatus.PENDING);
        return consents.stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }
    @Override
    public List<HealthCheckConsentResponse> getPendingConsentsApprovedByParent(Long parentId) {
        List<HealthCheckConsentEntity> consents = consentRepository.findByParent_UserIdAndConsentStatus(parentId, MedicalStatus.APPROVED);
        return consents.stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }
    @Override
    public List<HealthCheckCampaignResponse> getAllCampaigns() {
        List<HealthCheckCampaignEntity> campaigns = campaignRepository.findAll();
        return campaigns.stream()
                .map(HealthCheckCampaignMapper::toDTO)
                .toList();
    }
    @Override
    public List<HealthCheckCampaignResponse> getAllCampaignsStart() {
        List<HealthCheckCampaignEntity> campaigns = campaignRepository.getAllByHealthCheckCampaign();
        return campaigns.stream()
                .map(HealthCheckCampaignMapper::toDTO)
                .toList();
    }

    @Override
    public HealthCheckResultResponse getResultById(Long id) {
        HealthCheckResultEntity result = resultRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Result not found with id: " + id));
        return HealthCheckResultMapper.toDTO(result);
    }

    @Override
    public List<HealthCheckResultResponse> getResultsByCampaign(Long campaignId) {
        List<HealthCheckResultEntity> results = resultRepository.findByHealthCheckCampaign_Id(campaignId);
        return results.stream()
                .map(HealthCheckResultMapper::toDTO)
                .toList();
    }

    @Override
    public List<HealthCheckResultResponse> getResultsByStudent(Long studentId) {
        List<HealthCheckResultEntity> results = resultRepository.findByStudentId(studentId);
        if (results.isEmpty()) throw  new NotFoundException("Result not found with id: " + studentId);
        return results.stream()
                .map(HealthCheckResultMapper::toDTO)
                .toList();
    }


    private String getCurrentAcademicYear() {
        int currentYear = LocalDate.now().getYear();
        return currentYear + "-" + (currentYear + 1);
    }


    private java.math.BigDecimal calculateBMI(java.math.BigDecimal heightCm, java.math.BigDecimal weightKg) {
        java.math.BigDecimal heightM = heightCm.divide(new java.math.BigDecimal("100"));
        return weightKg.divide(heightM.multiply(heightM), 2, java.math.RoundingMode.HALF_UP);
    }

    @Override
    public PaginatedHealthCheckConsentResponse getAllHealthCheckConsents(String search, Pageable pageable) {
        // Chỉ cho phép sort theo các trường hợp hợp lệ
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String property = order.getProperty();
                    return property.equals("id") ||
                            property.equals("student.user.fullname") ||
                            property.equals("healthCheckCampaign.name");
                })
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<HealthCheckConsentEntity> healthCheckConsentPage =
                (search != null && !search.isBlank())
                        ? healthCheckConsentRepository.searchHealthCheckConsents(search, validatedPageable)
                        : healthCheckConsentRepository.findAll(validatedPageable); // ← sửa ở đây

        List<HealthCheckConsentResponse> healthCheckConsentDTOs = healthCheckConsentPage.stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();

        return PaginatedHealthCheckConsentResponse.builder()
                .healthCheckConsents(healthCheckConsentDTOs)
                .totalElements(healthCheckConsentPage.getTotalElements())
                .totalPages(healthCheckConsentPage.getTotalPages())
                .currentPage(healthCheckConsentPage.getNumber())
                .build();
    }


    @Override
    public void deleteCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));
        campaign.setStatus(MedicalStatus.REJECTED);
        campaignRepository.save(campaign);
    }
    @Override
    public PaginatedHealthCheckConsentResponse getApprovedConsentsByCampaign(Long campaignId, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String property = order.getProperty();
                    return "parent.userId".equals(property) || "student.id".equals(property) ;
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

        Page<HealthCheckConsentEntity> vaccinationConsentPage = healthCheckConsentRepository.findApprovedConsentsByCampaignId(campaignId, validatedPageable);

        List<HealthCheckConsentResponse> vaccinationConsentDTOs = vaccinationConsentPage.stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();

        return PaginatedHealthCheckConsentResponse.builder()
                .healthCheckConsents(vaccinationConsentDTOs)
                .totalElements(vaccinationConsentPage.getTotalElements())
                .totalPages(vaccinationConsentPage.getTotalPages())
                .currentPage(vaccinationConsentPage.getNumber())
                .build();
    }

}