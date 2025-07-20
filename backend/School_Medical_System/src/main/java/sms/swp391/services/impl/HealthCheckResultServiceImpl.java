package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.CreateHealthCheckResultListRequestDTO;
import sms.swp391.models.dtos.requests.HealthCheckResultRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckResultResponse;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.HealthCheckResultService;
import sms.swp391.services.NotificationService;
import sms.swp391.services.SendMailService;
import sms.swp391.utils.HealthCheckResultMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthCheckResultServiceImpl implements HealthCheckResultService {

    private final HealthCheckResultRepository resultRepository;
    private final HealthCheckCampaignRepository campaignRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final HealthCheckConsentRepository consentRepository;
    private final NotificationService notificationService;

    private HealthCheckResultEntity handleSingleStudentResult(
            HealthCheckResultRequestDTO dto,
            HealthCheckCampaignEntity campaign,
            UserEntity checker
    ) {
        if (dto.getStudentId() == null) {
            throw new BusinessException("Student ID is required");
        }

        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found: " + dto.getStudentId()));

        HealthCheckConsentEntity consent = consentRepository
                .findByHealthCheckCampaignIdAndStudent(campaign.getId(), student);

        if (consent == null || !MedicalStatus.APPROVED.equals(consent.getConsentStatus())) {
            throw new BusinessException("Consent not approved for student " + dto.getStudentId());
        }

        StudentHealthProfileEntity profile = student.getHealthProfile();
        if (profile == null) {
            profile = new StudentHealthProfileEntity();
            profile.setStudent(student);
            student.setHealthProfile(profile);
        }

        profile.setHeight(dto.getHeightCm());
        profile.setWeight(dto.getWeightKg());
        profile.setVisionLeft(dto.getVisionLeft());
        profile.setVisionRight(dto.getVisionRight());
        profile.setHearing(dto.getHearing());
        profile.setDentalHealth(dto.getDentalHealth());
        profile.setBloodPressure(dto.getBloodPressure());
        profile.setPulse(dto.getPulse());
        profile.setTemperature(dto.getTemperature());

        if (dto.getHeightCm() != null && dto.getWeightKg() != null) {
            profile.setBmi(HealthCheckResultMapper.calculateBMI(dto.getHeightCm(), dto.getWeightKg()));
        }

        HealthCheckResultEntity result = HealthCheckResultMapper.fromRequestDTO(dto);
        result.setHealthCheckCampaign(campaign);
        result.setStudent(student);
        result.setCheckedBy(checker);
        result.setCheckDate(LocalDate.now());
        result.setAcademicYear(getCurrentAcademicYear());
        result.setConsent(consent);

        consent.setConsentStatus(MedicalStatus.DONE);
        notificationService.push(
                checker.getUserId(),
                result.getStudent().getParent().getUserId(),
                "Kết quả kiểm tra sức khỏe",
                "Kết quả kiểm tra của " + result.getStudent().getUser().getFullname() + " đã sẵn sàng."
        );
        return result;
    }

    @Transactional
    @Override
    public List<HealthCheckResultResponse> createBulkResults(CreateHealthCheckResultListRequestDTO req, Long checkedById) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(req.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));

        UserEntity checker = userRepository.findById(checkedById)
                .orElseThrow(() -> new NotFoundException("Checker not found"));

        List<HealthCheckResultEntity> resultsToSave = new ArrayList<>();
        Set<HealthCheckConsentEntity> consentsToSave = new HashSet<>();
        Set<StudentEntity> studentsToSave = new HashSet<>();
        List<HealthCheckResultResponse> responses = new ArrayList<>();

        for (HealthCheckResultRequestDTO dto : req.getResults()) {

            HealthCheckResultEntity result = handleSingleStudentResult(dto, campaign, checker);
            resultsToSave.add(result);
            consentsToSave.add(result.getConsent());
            studentsToSave.add(result.getStudent());

        }

        resultRepository.saveAll(resultsToSave);
        consentRepository.saveAll(new ArrayList<>(consentsToSave));
        studentRepository.saveAll(new ArrayList<>(studentsToSave));

        for (HealthCheckResultEntity result : resultsToSave) {
            responses.add(HealthCheckResultMapper.toDTO(result));
        }

        return responses;
    }


    @Transactional
    @Override
    public HealthCheckResultResponse saveResult(HealthCheckResultRequestDTO request, Long checkedById) {
        HealthCheckCampaignEntity campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));

        UserEntity checker = userRepository.findById(checkedById)
                .orElseThrow(() -> new NotFoundException("Checker not found"));

        HealthCheckResultEntity result = handleSingleStudentResult(request, campaign, checker);
        HealthCheckResultEntity savedResult = resultRepository.saveAndFlush(result);

        consentRepository.save(result.getConsent());
        studentRepository.save(result.getStudent());

        notificationService.push(
                checkedById,
                result.getStudent().getParent().getUserId(),
                "Kết quả kiểm tra sức khỏe",
                "Kết quả kiểm tra của " + result.getStudent().getUser().getFullname() + " đã sẵn sàng."
        );

        return HealthCheckResultMapper.toDTO(savedResult);
    }


    @Override
    public HealthCheckResultResponse getResultById(Long id) {
        return resultRepository.findById(id)
                .map(HealthCheckResultMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Result not found"));
    }

    @Override
    public List<HealthCheckResultResponse> getResultsByCampaign(Long campaignId) {
        return resultRepository.findByHealthCheckCampaign_Id(campaignId).stream()
                .map(HealthCheckResultMapper::toDTO)
                .toList();
    }

    @Override
    public List<HealthCheckResultResponse> getResultsByStudent(Long studentId) {
        List<HealthCheckResultEntity> results = resultRepository.findByStudentId(studentId);
        if (results.isEmpty()) throw new NotFoundException("No results for student ID: " + studentId);
        return results.stream()
                .map(HealthCheckResultMapper::toDTO)
                .toList();
    }

    private String getCurrentAcademicYear() {
        int currentYear = LocalDate.now().getYear();
        return currentYear + "-" + (currentYear + 1);
    }

}
