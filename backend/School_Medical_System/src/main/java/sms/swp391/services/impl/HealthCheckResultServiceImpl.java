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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
    private final HealthConsultationScheduleRepository consultationScheduleRepository;
    private final SendMailService sendMailService;
    private final NotificationService notificationService;

    @Transactional
    @Override
    public List<HealthCheckResultResponse> createBulkResults(CreateHealthCheckResultListRequestDTO req,
                                                             Long checkedById) {

        HealthCheckCampaignEntity campaign = campaignRepository.findById(req.getCampaignId())
                .orElseThrow(() -> new NotFoundException("Campaign not found"));

        UserEntity checker = userRepository.findById(checkedById)
                .orElseThrow(() -> new NotFoundException("Checker not found"));

        List<HealthCheckResultEntity> resultsToSave = new ArrayList<>();
        List<HealthCheckResultResponse> responses   = new ArrayList<>();

        for (HealthCheckResultRequestDTO dto : req.getResults()) {

            if (dto.getStudentId() == null) continue;

            StudentEntity student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new NotFoundException("Student not found: " + dto.getStudentId()));

            // 4. Kiểm tra consent APPROVED
            HealthCheckConsentEntity consent = consentRepository
                    .findByHealthCheckCampaignIdAndStudent(campaign.getId(), student);

            if (consent == null || !MedicalStatus.APPROVED.equals(consent.getConsentStatus())) {
                // Có thể skip hoặc throw exception – ở đây skip
                continue;
            }

            // 5. Cập nhật hồ sơ sức khỏe
            StudentHealthProfileEntity profile = Optional
                    .ofNullable(student.getHealthProfile())
                    .orElseGet(() -> {
                        StudentHealthProfileEntity p = new StudentHealthProfileEntity();
                        p.setStudent(student);
                        student.setHealthProfile(p);
                        return p;
                    });

            profile.setHeight(dto.getHeightCm());
            profile.setWeight(dto.getWeightKg());
            profile.setVisionLeft(dto.getVisionLeft());
            profile.setVisionRight(dto.getVisionRight());
            profile.setHearing(dto.getHearing());
            profile.setDentalHealth(dto.getDentalHealth());
            profile.setBloodPressure(dto.getBloodPressure());
            profile.setPulse(dto.getPulse());
            profile.setTemperature(dto.getTemperature());

            // 6. Tạo entity kết quả
            HealthCheckResultEntity result = HealthCheckResultMapper.fromRequestDTO(dto);
            result.setHealthCheckCampaign(campaign);
            result.setStudent(student);
            result.setCheckDate(LocalDate.now());
            result.setCheckedBy(checker);
            result.setAcademicYear(getCurrentAcademicYear());
            result.setConsent(consent);

            // 7. Đánh dấu consent DONE
            consent.setConsentStatus(MedicalStatus.DONE);

            resultsToSave.add(result);
        }

        // 8. Lưu batch
        resultRepository.saveAll(resultsToSave);
        consentRepository.saveAll(
                resultsToSave.stream().map(HealthCheckResultEntity::getConsent).toList()
        );
        studentRepository.saveAll(
                resultsToSave.stream().map(HealthCheckResultEntity::getStudent).toList()
        );

        // 9. Trả response
        for (HealthCheckResultEntity e : resultsToSave) {
            responses.add(HealthCheckResultMapper.toDTO(e));
        }
        return responses;
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
                checkedById, student.getParent().getUserId(),
                "Kết quả kiểm tra sức khỏe",
                "Kết quả kiểm tra của " + student.getUser().getFullname() + " đã sẵn sàng."
        );

        if (isAbnormal(savedResult)) {
            LocalDateTime scheduleTime = request.getScheduleTime() != null
                    ? request.getScheduleTime()
                    : LocalDate.now().plusDays(extractFollowUpDays(savedResult.getFollowUpNotes())).atTime(8, 0);

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
                    "Con bạn cần tư vấn sức khỏe vào " + scheduleTime.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"))
            );
        }

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

    private BigDecimal calculateBMI(BigDecimal heightCm, BigDecimal weightKg) {
        BigDecimal heightM = heightCm.divide(new BigDecimal("100"));
        return weightKg.divide(heightM.multiply(heightM), 2, BigDecimal.ROUND_HALF_UP);
    }

    private boolean isAbnormal(HealthCheckResultEntity result) {
        StudentHealthProfileEntity p = result.getStudent().getHealthProfile();
        if (p == null) return false;
        if (p.getTemperature() != null && p.getTemperature().compareTo(BigDecimal.valueOf(38.0)) > 0) return true;
        if (p.getBloodPressure() != null && p.getBloodPressure().contains("/")) {
            try {
                String[] parts = p.getBloodPressure().split("/");
                int sys = Integer.parseInt(parts[0].trim());
                int dia = Integer.parseInt(parts[1].trim());
                if (sys > 140 || dia > 90) return true;
            } catch (Exception ignored) {}
        }
        try {
            if (p.getVisionLeft() != null && Float.parseFloat(p.getVisionLeft()) < 5.0f) return true;
            if (p.getVisionRight() != null && Float.parseFloat(p.getVisionRight()) < 5.0f) return true;
        } catch (NumberFormatException ignored) {}
        return false;
    }

    private int extractFollowUpDays(String followUpNotes) {
        if (followUpNotes == null) return 1;
        Matcher matcher = Pattern.compile("(\\d+)\\s*ngày", Pattern.CASE_INSENSITIVE).matcher(followUpNotes);
        return matcher.find() ? Integer.parseInt(matcher.group(1)) : 1;
    }
}
