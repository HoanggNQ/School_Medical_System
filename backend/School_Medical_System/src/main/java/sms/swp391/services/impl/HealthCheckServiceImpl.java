package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.respones.*;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.HealthCheckService;
import sms.swp391.services.SendMailService;
import sms.swp391.utils.HealthCheckCampaignMapper;
import sms.swp391.utils.HealthCheckConsentMapper;
import sms.swp391.utils.HealthCheckResultMapper;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthCheckServiceImpl implements HealthCheckService {
    private final HealthCheckCampaignRepository campaignRepository;
    private final HealthCheckConsentRepository consentRepository;
    private final HealthCheckResultRepository resultRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SendMailService sendMailService;

    @Override
    public HealthCheckCampaignResponse createCampaign(HealthCheckCampaignRequestDTO request, Long createdById) {
        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createdById));

        HealthCheckCampaignEntity campaign = HealthCheckCampaignMapper.fromRequestDTO(request);
        campaign.setCreatedBy(creator);
        campaign.setStatus("PENDING");
        campaign.setCreatedAt(Instant.now());

        HealthCheckCampaignEntity savedCampaign = campaignRepository.save(campaign);
        return HealthCheckCampaignMapper.toDTO(savedCampaign);
    }

    @Override
    public HealthCheckCampaignResponse updateCampaign(Long id, HealthCheckCampaignRequestDTO request) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

        // Update fields
        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setCheckDate(request.getCheckDate());
        campaign.setTargetGrade(request.getTargetGrade());
        campaign.setLocation(request.getLocation());
        campaign.setRequiredEquipment(request.getRequiredEquipment());

        HealthCheckCampaignEntity updatedCampaign = campaignRepository.save(campaign);
        return HealthCheckCampaignMapper.toDTO(updatedCampaign);
    }

    @Override
    public void startCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        // Create consent requests for all students in target grade
        List<StudentEntity> targetStudents = studentRepository.findByClassEntity_GradeWithUserAndParent(campaign.getTargetGrade());

        for (StudentEntity student : targetStudents) {
            HealthCheckConsentEntity consent = HealthCheckConsentEntity.builder()
                    .healthCheckCampaign(campaign)
                    .student(student)
                    .parent(student.getParent())
                    .consentStatus("PENDING")
                    .academicYear(getCurrentAcademicYear())
                    .build();

            consentRepository.save(consent);

            // Send email notification to parent
            sendMailService.sendMail(
                    null,
                    student.getParent().getEmail(),
                    null,
                    "Medical Examination Consent Required",
                    generateConsentEmailBody(campaign, student)
            );
        }

        campaign.setStatus("ACTIVE");
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
        consent.setResponseDate(Instant.now());

        HealthCheckConsentEntity updatedConsent = consentRepository.save(consent);
        return HealthCheckConsentMapper.toDTO(updatedConsent);
    }

    @Override
    public HealthCheckResultResponse saveResult(HealthCheckResultRequestDTO request, Long checkedById) {
        // Verify campaign
        HealthCheckCampaignEntity campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));

        // Get student first
        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));

        // Get checker
        UserEntity checker = userRepository.findById(checkedById)
                .orElseThrow(() -> new NotFoundException("Checker not found"));

        // Verify consent after we have both campaign and student
        HealthCheckConsentEntity consent = consentRepository.findByHealthCheckCampaignIdAndStudent(campaign.getId(), student);
        if (consent == null || !consent.getConsentStatus().equals("APPROVED")) {
            throw new BusinessException("Parent consent not approved for this examination");
        }

        // Create and populate result
        HealthCheckResultEntity result = HealthCheckResultMapper.fromRequestDTO(request);
        result.setHealthCheckCampaign(campaign);
        result.setStudent(student);
        result.setCheckedBy(checker);
        result.setCheckDate(Instant.now());
        result.setAcademicYear(getCurrentAcademicYear());

        // Calculate BMI if height and weight are provided
        if (request.getHeightCm() != null && request.getWeightKg() != null) {
            result.setBmi(calculateBMI(request.getHeightCm(), request.getWeightKg()));
        }

        // Save result
        HealthCheckResultEntity savedResult = resultRepository.save(result);

        // Send notification if follow-up is required
        if (savedResult.getFollowUpRequired()) {
            sendMailService.sendMail(
                    null,
                    student.getParent().getEmail(),
                    null,
                    "Medical Examination Results - Follow-up Required",
                    generateResultEmailBody(savedResult)
            );
        }

        return HealthCheckResultMapper.toDTO(savedResult);
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
        List<HealthCheckConsentEntity> consents = consentRepository.findByParent_UserIdAndConsentStatus(parentId, "PENDING");
        return consents.stream()
                .map(HealthCheckConsentMapper::toDTO)
                .toList();
    }
    @Override
    public List<HealthCheckConsentResponse> getPendingConsentsApprovedByParent(Long parentId) {
        List<HealthCheckConsentEntity> consents = consentRepository.findByParent_UserIdAndConsentStatus(parentId, "APPROVED");
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
        return results.stream()
                .map(HealthCheckResultMapper::toDTO)
                .toList();
    }


    private String getCurrentAcademicYear() {
        int currentYear = LocalDate.now().getYear();
        return currentYear + "-" + (currentYear + 1);
    }


    private String generateConsentEmailBody(HealthCheckCampaignEntity campaign, StudentEntity student) {
        return String.format("""
        <html>
        <body>
            Dear %s,<br><br>
            
            Your consent is required for %s's participation in the upcoming medical examination:<br><br>
            
            <strong>Campaign:</strong> %s<br>
            <strong>Date:</strong> %s<br>
            <strong>Location:</strong> %s<br><br>
            
            Please log in to the system to provide your consent and any special requirements.<br><br>
            
            Best regards,<br>
            School Medical Team
        </body>
        </html>
        """,
                student.getParent().getFullname(),
                student.getUser().getFullname(),
                campaign.getName(),
                campaign.getCheckDate(),
                campaign.getLocation()
        );
    }
    private String generateResultEmailBody(HealthCheckResultEntity result) {
        return String.format("""
        <html>
        <body>
            Dear Parent,<br><br>
            
            The medical examination results for %s require follow-up attention:<br><br>
            
            <strong>Recommendation:</strong> %s<br>
            <strong>Follow-up Notes:</strong> %s<br><br>
            
            Please schedule a consultation at your earliest convenience.<br><br>
            
            Best regards,<br>
            School Medical Team
        </body>
        </html>
        """,
                result.getStudent().getUser().getFullname(),
                result.getRecommendation(),
                result.getFollowUpNotes()
        );
    }


    private java.math.BigDecimal calculateBMI(java.math.BigDecimal heightCm, java.math.BigDecimal weightKg) {
        java.math.BigDecimal heightM = heightCm.divide(new java.math.BigDecimal("100"));
        return weightKg.divide(heightM.multiply(heightM), 2, java.math.RoundingMode.HALF_UP);
    }
    
}