package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.CampaignStatus;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.respones.*;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.HealthCheckService;
import sms.swp391.services.NotificationService;
import sms.swp391.utils.HealthCheckCampaignMapper;
import sms.swp391.utils.HealthCheckConsentMapper;
import sms.swp391.utils.HealthCheckResultMapper;

import java.time.Instant;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthCheckServiceImpl implements HealthCheckService {

    private final HealthCheckCampaignRepository campaignRepository;
    private final HealthCheckConsentRepository consentRepository;
    private final HealthCheckResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Campaign Methods
    @Override
    @Transactional
    public HealthCheckCampaignResponse createCampaign(HealthCheckCampaignRequestDTO request, Long createdById) {
        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createdById));

        HealthCheckCampaignEntity campaign = HealthCheckCampaignMapper.fromRequestDTO(request);
        campaign.setCreatedBy(creator);
        campaign.setCreatedAt(Instant.now());
        campaign.setStatus(CampaignStatus.PLANNING.name());

        return HealthCheckCampaignMapper.toDTO(campaignRepository.save(campaign));
    }

    @Override
    @Transactional
    public HealthCheckCampaignResponse updateCampaign(Long id, HealthCheckCampaignRequestDTO request) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

        // Cập nhật entity từ request
        HealthCheckCampaignEntity updatedCampaign = HealthCheckCampaignMapper.fromRequestDTO(request);
        // Giữ lại các trường không được update (id, createdBy, createdAt, status)
        updatedCampaign.setId(campaign.getId());
        updatedCampaign.setCreatedBy(campaign.getCreatedBy());
        updatedCampaign.setCreatedAt(campaign.getCreatedAt());
        updatedCampaign.setStatus(campaign.getStatus());

        return HealthCheckCampaignMapper.toDTO(campaignRepository.save(updatedCampaign));
    }

    @Override
    @Transactional
    public void startCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        campaign.setStatus(CampaignStatus.IN_PROGRESS.name());
        campaignRepository.save(campaign);

        List<StudentEntity> students = studentRepository.findByClassEntity_Grade(campaign.getTargetGrade());

        students.forEach(student -> {
            HealthCheckConsentEntity consent = HealthCheckConsentEntity.builder()
                    .healthCheckCampaign(campaign)
                    .student(student)
                    .parent(student.getParent())
                    .consentStatus("PENDING")
                    .academicYear(getCurrentAcademicYear())
                    .build();

            consentRepository.save(consent);

            notificationService.createNotification(
                    new NotificationCreateDTO(
                            "Health Check Consent Request",
                            "Please consent for " + student.getUser().getFullname() +
                                    "'s health check on " + campaign.getCheckDate()
                    )
            );
        });
    }

    @Override
    public HealthCheckCampaignResponse getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .map(HealthCheckCampaignMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));
    }

    @Override
    public List<HealthCheckCampaignResponse> getAllCampaigns() {
        return campaignRepository.findAll().stream()
                .map(HealthCheckCampaignMapper::toDTO)
                .toList();
    }

    // Consent Methods
    @Override
    @Transactional
    public HealthCheckConsentResponse updateConsent(Long consentId, HealthCheckConsentRequestDTO request, Long parentId) {
        HealthCheckConsentEntity consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + consentId));

        if (!consent.getParent().getUserId().equals(parentId)) {
            throw new AuthFailedException("Only the parent can update this consent");
        }

        // Cập nhật từ request DTO (static method)
        HealthCheckConsentEntity updatedConsent = HealthCheckConsentMapper.fromRequestDTO(request);
        consent.setStatus(updatedConsent.getStatus());
        consent.setNotes(updatedConsent.getNotes());
        consent.setSpecialRequests(updatedConsent.getSpecialRequests());
        consent.setResponseDate(Instant.now());

        return HealthCheckConsentMapper.toDTO(consentRepository.save(consent));
    }

    @Override
    public List<HealthCheckConsentResponse> getConsentsByCampaign(Long campaignId) {
        return consentRepository.findByHealthCheckCampaignIdAndStatus(campaignId, "PENDING").stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }

    @Override
    public HealthCheckConsentResponse getConsentById(Long consentId) {
        return consentRepository.findById(consentId)
                .map(HealthCheckConsentMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Consent not found with id: " + consentId));
    }

    @Override
    public List<HealthCheckConsentResponse> getPendingConsentsByParent(Long parentId) {
        return consentRepository.findByParentAndStatus(parentId, "PENDING").stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }

    // Result Methods
    @Override
    @Transactional
    public HealthCheckResultResponse saveResult(HealthCheckResultRequestDTO request, Long checkedById) {
        UserEntity checkedBy = userRepository.findById(checkedById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + checkedById));

        // ✅ TÌM STUDENT và LẤY TÊN
        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + request.getStudentId()));

        String studentName = student.getUser().getFullname();

        consentRepository.findByHealthCheckCampaignIdAndStudentId(request.getCampaignId(), request.getStudentId())
                .filter(c -> "APPROVED".equals(c.getConsentStatus()))
                .orElseThrow(() -> BusinessException.builder()
                        .message("Consent not approved for this student")
                        .build());

        HealthCheckResultEntity result = HealthCheckResultMapper.fromRequestDTO(request);
        result.setCheckedBy(checkedBy);
        result.setCheckDate(Instant.now());
        result.setAcademicYear(getCurrentAcademicYear());

        HealthCheckResultEntity savedResult = resultRepository.save(result);

        if (Boolean.TRUE.equals(savedResult.getFollowUpRequired())) {
            notificationService.createNotification(
                    new NotificationCreateDTO(
                            "Health Check Follow-up Required",
                            "Please review the health check results for " + studentName // ✅ DÙNG TÊN
                    )
            );
        }
        return HealthCheckResultMapper.toDTO(savedResult);
    }

    @Override
    public HealthCheckResultResponse getResultById(Long resultId) {
        return resultRepository.findById(resultId)
                .map(HealthCheckResultMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Result not found with id: " + resultId));
    }

    @Override
    public List<HealthCheckResultResponse> getResultsByCampaign(Long campaignId) {
        return resultRepository.findByHealthCheckCampaignIdAndFollowUpRequired(campaignId, null).stream()
                .map(HealthCheckResultMapper::toDTO)
                .toList();
    }

    @Override
    public List<HealthCheckResultResponse> getResultsByStudent(Long studentId) {
        return resultRepository.findByStudentId(studentId).stream()
                .map(HealthCheckResultMapper::toDTO)
                .toList();
    }

    @Override
    public List<HealthCheckResultResponse> getResultsRequiringFollowUp() {
        return resultRepository.findByFollowUpRequired(true).stream()
                .map(HealthCheckResultMapper::toDTO)
                .toList();
    }

    // Utility
    private String getCurrentAcademicYear() {
        int year = Year.now().getValue();
        return year + "-" + (year + 1);
    }
}
