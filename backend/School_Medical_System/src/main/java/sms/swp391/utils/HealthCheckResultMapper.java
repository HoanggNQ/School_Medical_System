package sms.swp391.utils;

import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthCheckResultRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckResultResponse;
import sms.swp391.models.entities.HealthCheckResultEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.StudentHealthProfileEntity;
import sms.swp391.models.entities.UserEntity;

import java.lang.Double;
import java.math.RoundingMode;
import java.util.Optional;

public class HealthCheckResultMapper {

    public static HealthCheckResultResponse toDTO(HealthCheckResultEntity entity) {
        if (entity == null) return null;

        StudentEntity student = entity.getStudent();
        StudentHealthProfileEntity profile = (student != null) ? student.getHealthProfile() : null;

        Double height = (profile != null) ? profile.getHeight() : null;
        Double weight = (profile != null) ? profile.getWeight() : null;
        Double bmi = calculateBMI(height, weight);

        MedicalStatus consentStatus = (entity.getConsent() != null) ? entity.getConsent().getConsentStatus() : null;

        return HealthCheckResultResponse.builder()
                .id(entity.getResultId())
                .campaignId(entity.getHealthCheckCampaign() != null ? entity.getHealthCheckCampaign().getId() : null)
                .campaignName(entity.getHealthCheckCampaign() != null ? entity.getHealthCheckCampaign().getName() : null)
                .studentId(student != null ? student.getId() : null)
                .studentName(Optional.ofNullable(student)
                        .map(StudentEntity::getUser)
                        .map(UserEntity::getFullname)
                        .orElse(null))
                .checkedById(entity.getCheckedBy() != null ? entity.getCheckedBy().getUserId() : null)
                .checkedByName(entity.getCheckedBy() != null ? entity.getCheckedBy().getFullname() : null)
                .checkDate(entity.getCheckDate())
                .heightCm(height)
                .weightKg(weight)
                .bmi(bmi)
                .visionLeft(profile != null ? profile.getVisionLeft() : null)
                .visionRight(profile != null ? profile.getVisionRight() : null)
                .hearing(profile != null ? profile.getHearing() : null)
                .dentalHealth(profile != null ? profile.getDentalHealth() : null)
                .bloodPressure(profile != null ? profile.getBloodPressure() : null)
                .pulse(profile != null ? profile.getPulse() : null)
                .temperature(profile != null ? profile.getTemperature() : null)
                .recommendation(entity.getRecommendation())
                .followUpNotes(entity.getFollowUpNotes())
                .overallHealthRating(entity.getOverallHealthRating())
                .academicYear(entity.getAcademicYear())
                .healthStatus(isAbnormal(entity) ? "XẤU" : "TỐT")
                .consentStatus(consentStatus != null ? consentStatus.name() : null)
                .build();
    }


    public static HealthCheckResultEntity fromRequestDTO(HealthCheckResultRequestDTO dto) {
        if (dto == null) return null;

        return HealthCheckResultEntity.builder()
                .recommendation(dto.getRecommendation())
                .followUpNotes(dto.getFollowUpNotes())
                .overallHealthRating(dto.getOverallHealthRating())
                .build();
    }


    public static Double calculateBMI(Double height, Double weight) {
        if (height == null || weight == null || height == 0)
            return null;

        double heightM = height / 100.0;
        return Math.round((weight / (heightM * heightM)) * 100.0) / 100.0;
    }

    public static boolean isAbnormal(HealthCheckResultEntity result) {
        StudentHealthProfileEntity p = result.getStudent().getHealthProfile();
        if (p == null) return false;

        if (p.getTemperature() != null && p.getTemperature() > 38.0)
            return true;

        if (p.getBloodPressure() != null && p.getBloodPressure().contains("/")) {
            try {
                String[] parts = p.getBloodPressure().split("/");
                int sys = Integer.parseInt(parts[0].replaceAll("[^0-9]", "").trim());
                int dia = Integer.parseInt(parts[1].replaceAll("[^0-9]", "").trim());
                if (sys >= 140 || dia >= 90 || sys < 90 || dia < 60) {
                    return true;
                }
            } catch (Exception ignored) {
            }
        }

        try {
            if (p.getVisionLeft() != null && !p.getVisionLeft().isBlank()) {
                String left = p.getVisionLeft().split("/")[0].trim();
                float leftVal = Float.parseFloat(left);
                if (leftVal < 5.0f) return true;
            }
            if (p.getVisionRight() != null && !p.getVisionRight().isBlank()) {
                String right = p.getVisionRight().split("/")[0].trim();
                float rightVal = Float.parseFloat(right);
                if (rightVal < 5.0f) return true;
            }
        } catch (NumberFormatException ignored) {
        }

        Double bmi = calculateBMI(p.getHeight(), p.getWeight());
        if (bmi != null && (bmi < 18.5 || bmi > 24.9)) {
            return true;
        }

        return false;
    }
    public static HealthCheckResultResponse toDTO(HealthCheckResultEntity entity, HealthCheckResultRequestDTO dto) {
        if (entity == null) return null;

        Double height = dto.getHeightCm();
        Double weight = dto.getWeightKg();
        Double bmi = calculateBMI(height, weight);

        MedicalStatus consentStatus = (entity.getConsent() != null) ? entity.getConsent().getConsentStatus() : null;

        return HealthCheckResultResponse.builder()
                .id(entity.getResultId())
                .campaignId(entity.getHealthCheckCampaign() != null ? entity.getHealthCheckCampaign().getId() : null)
                .campaignName(entity.getHealthCheckCampaign() != null ? entity.getHealthCheckCampaign().getName() : null)
                .studentId(dto.getStudentId())
                .studentName(entity.getStudent() != null ? entity.getStudent().getUser().getFullname() : null)
                .checkedById(entity.getCheckedBy() != null ? entity.getCheckedBy().getUserId() : null)
                .checkedByName(entity.getCheckedBy() != null ? entity.getCheckedBy().getFullname() : null)
                .checkDate(entity.getCheckDate())
                .heightCm(height)
                .weightKg(weight)
                .bmi(bmi)
                .visionLeft(dto.getVisionLeft())
                .visionRight(dto.getVisionRight())
                .hearing(dto.getHearing())
                .dentalHealth(dto.getDentalHealth())
                .bloodPressure(dto.getBloodPressure())
                .pulse(dto.getPulse())
                .temperature(dto.getTemperature())
                .recommendation(entity.getRecommendation())
                .followUpNotes(entity.getFollowUpNotes())
                .overallHealthRating(entity.getOverallHealthRating())
                .academicYear(entity.getAcademicYear())
                .healthStatus(isAbnormal(dto) ? "XẤU" : "TỐT")
                .consentStatus(consentStatus != null ? consentStatus.name() : null)
                .build();
    }

    public static boolean isAbnormal(HealthCheckResultRequestDTO dto) {

        System.out.println(" height=" + dto.getHeightCm() + ", weight=" + dto.getWeightKg()
                + ", visionLeft=" + dto.getVisionLeft() + ", visionRight=" + dto.getVisionRight()
                + ", bloodPressure=" + dto.getBloodPressure() + ", temperature=" + dto.getTemperature());

        // Kiểm tra nhiệt độ
        if (dto.getTemperature() != null && dto.getTemperature() > 38.0) {
            System.out.println("xấu");
            return true;
        }

        // Kiểm tra huyết áp
        if (dto.getBloodPressure() != null && dto.getBloodPressure().contains("/")) {
            try {
                String[] parts = dto.getBloodPressure().split("/");
                int sys = Integer.parseInt(parts[0].replaceAll("[^0-9]", "").trim());
                int dia = Integer.parseInt(parts[1].replaceAll("[^0-9]", "").trim());
                if (sys >= 140 || dia >= 90 || sys < 90 || dia < 60) {
                    System.out.println("xấu");
                    return true;
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }

        // Kiểm tra thị lực
        try {
            if (dto.getVisionLeft() != null && !dto.getVisionLeft().isBlank()) {
                String left = dto.getVisionLeft().split("/")[0].trim();
                float leftVal = Float.parseFloat(left);
                if (leftVal < 5.0f) {
                    System.out.println(" < 5.0");
                    return true;
                }
            }
            if (dto.getVisionRight() != null && !dto.getVisionRight().isBlank()) {
                String right = dto.getVisionRight().split("/")[0].trim();
                float rightVal = Float.parseFloat(right);
                if (rightVal < 5.0f) {
                    System.out.println(" < 5.0");
                    return true;
                }
            }
        } catch (NumberFormatException e) {
            System.out.println(e.getMessage());
        }

        // Kiểm tra BMI
        Double bmi = calculateBMI(dto.getHeightCm(), dto.getWeightKg());
        System.out.println("BMI: " + bmi);
        if (bmi != null && (bmi < 18.5 || bmi > 24.9)) {
            System.out.println("xau");
            return true;
        }

        System.out.println("Tốt");
        return false;
    }
}
