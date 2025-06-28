package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
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
import sms.swp391.services.SendMailService;
import sms.swp391.utils.HealthCheckCampaignMapper;
import sms.swp391.utils.HealthCheckConsentMapper;
import sms.swp391.utils.HealthCheckResultMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    @Override
    public void endCampaign(Long campaignId) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + campaignId));

        campaign.setStatus("CLOSE");
        campaignRepository.save(campaign);
    }

    @Override
    public HealthCheckCampaignResponse createCampaign(HealthCheckCampaignRequestDTO request, Long createdById) {
        UserEntity creator = userRepository.findById(createdById)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createdById));

        HealthCheckCampaignEntity campaign = HealthCheckCampaignMapper.fromRequestDTO(request);
        campaign.setCreatedBy(creator);
        campaign.setStatus("PENDING");
        campaign.setCreatedAt(LocalDate.now());

        HealthCheckCampaignEntity savedCampaign = campaignRepository.save(campaign);
        return HealthCheckCampaignMapper.toDTO(savedCampaign);
    }

    @Override
    public HealthCheckCampaignResponse updateCampaign(Long id, HealthCheckCampaignRequestDTO request) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Campaign not found with id: " + id));

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

            sendMailService.sendConsentRequestEmail(
                    student.getParent().getEmail(),
                    student.getParent().getFullname(),
                    student.getUser().getFullname(),
                    campaign.getName(),
                    campaign.getCheckDate().toString(),
                    campaign.getLocation()
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
        consent.setResponseDate(LocalDate.now());

        HealthCheckConsentEntity updatedConsent = consentRepository.save(consent);
        return HealthCheckConsentMapper.toDTO(updatedConsent);
    }

    @Override
    public HealthCheckResultResponse saveResult(HealthCheckResultRequestDTO request, Long checkedById) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));

        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found"));

        UserEntity checker = userRepository.findById(checkedById)
                .orElseThrow(() -> new NotFoundException("Checker not found"));

        HealthCheckConsentEntity consent = consentRepository.findByHealthCheckCampaignIdAndStudent(campaign.getId(), student);
        if (consent == null || !"APPROVED".equals(consent.getConsentStatus())) {
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

        HealthCheckResultEntity savedResult = resultRepository.saveAndFlush(result);
        studentRepository.save(student);

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
    
}