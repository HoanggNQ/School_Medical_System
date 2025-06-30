package sms.swp391.utils;

import sms.swp391.models.dtos.requests.HealthCheckResultRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckResultResponse;
import sms.swp391.models.entities.HealthCheckResultEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.StudentHealthProfileEntity;
import sms.swp391.models.entities.UserEntity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

public class HealthCheckResultMapper {

    public static HealthCheckResultResponse toDTO(HealthCheckResultEntity entity) {
        if (entity == null) return null;

        StudentEntity student = entity.getStudent();
        StudentHealthProfileEntity profile = student.getHealthProfile();

        BigDecimal bmi = calculateBMI(
                profile != null ? profile.getHeight() : null,
                profile != null ? profile.getWeight() : null
        );

        return HealthCheckResultResponse.builder()
                .id(entity.getResultId())
                .campaignId(entity.getHealthCheckCampaign().getId())
                .studentId(student.getId())
                .studentName(Optional.ofNullable(student.getUser()).map(UserEntity::getFullname).orElse(null))
                .checkedById(entity.getCheckedBy().getUserId())
                .checkedByName(entity.getCheckedBy().getFullname())
                .campaignName(entity.getHealthCheckCampaign().getName())
                .checkDate(entity.getCheckDate())
                .heightCm(profile != null ? profile.getHeight() : null)
                .weightKg(profile != null ? profile.getWeight() : null)
                .bmi(bmi)
                .visionLeft(profile != null ? profile.getVisionLeft() : null)
                .visionRight(profile != null ? profile.getVisionRight() : null)
                .hearing(profile != null ? profile.getHearing() : null)
                .dentalHealth(profile != null ? profile.getDentalHealth() : null)
                .bloodPressure(profile != null ? profile.getBloodPressure() : null)
                .pulse(profile != null ? profile.getPulse() : null)
                .temperature(profile != null ? profile.getTemperature() : null)
                .otherNotes(profile != null ? profile.getOtherMedicalNotes() : null)
                .recommendation(entity.getRecommendation())
                .followUpRequired(entity.getFollowUpRequired())
                .followUpNotes(entity.getFollowUpNotes())
                .overallHealthRating(entity.getOverallHealthRating())
                .academicYear(entity.getAcademicYear())
                .build();
    }

    public static HealthCheckResultEntity fromRequestDTO(HealthCheckResultRequestDTO dto) {
        if (dto == null) return null;

        return HealthCheckResultEntity.builder()
                .recommendation(dto.getRecommendation())
                .followUpRequired(dto.getFollowUpRequired())
                .followUpNotes(dto.getFollowUpNotes())
                .overallHealthRating(dto.getOverallHealthRating())
                .build();
    }

    private static BigDecimal calculateBMI(BigDecimal height, BigDecimal weight) {
        if (height == null || weight == null || height.compareTo(BigDecimal.ZERO) == 0)
            return null;

        BigDecimal heightM = height.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return weight.divide(heightM.multiply(heightM), 2, RoundingMode.HALF_UP);
    }
}
