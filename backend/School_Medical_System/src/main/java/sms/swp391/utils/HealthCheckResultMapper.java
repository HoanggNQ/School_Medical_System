package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.HealthCheckResultRequest;
import sms.swp391.models.dtos.respones.HealthCheckResultResponse;
import sms.swp391.models.entities.HealthCheckResultEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@RequiredArgsConstructor
public class HealthCheckResultMapper {
    public static HealthCheckResultResponse toDTO(HealthCheckResultEntity entity) {
        if (entity == null) return null;

        BigDecimal bmi = calculateBMI(entity.getHeightCm(), entity.getWeightKg());

        return HealthCheckResultResponse.builder()
                .id(entity.getId())
                .campaignId(entity.getHealthCheckCampaign().getId())
                .studentId(entity.getStudent().getId())
                .studentName(Optional.ofNullable(entity.getStudent()).map(StudentEntity::getUser).map(UserEntity::getFullname).orElse(null))
                .checkedById(entity.getCheckedBy().getUserId())
                .checkedByName(entity.getCheckedBy().getFullname())
                .checkDate(entity.getCheckDate())
                .heightCm(entity.getHeightCm())
                .weightKg(entity.getWeightKg())
                .bmi(bmi)
                .visionLeft(entity.getVisionLeft())
                .visionRight(entity.getVisionRight())
                .hearing(entity.getHearing())
                .dentalHealth(entity.getDentalHealth())
                .bloodPressure(entity.getBloodPressure())
                .pulse(entity.getPulse())
                .temperature(entity.getTemperature())
                .otherNotes(entity.getOtherNotes())
                .recommendation(entity.getRecommendation())
                .followUpRequired(entity.getFollowUpRequired())
                .followUpNotes(entity.getFollowUpNotes())
                .overallHealthRating(entity.getOverallHealthRating())
                .academicYear(entity.getAcademicYear())
                .build();
    }

    public static HealthCheckResultEntity fromRequestDTO(HealthCheckResultRequest dto) {
        if (dto == null) return null;

        HealthCheckResultEntity entity = new HealthCheckResultEntity();
        entity.setHeightCm(dto.getHeightCm());
        entity.setWeightKg(dto.getWeightKg());
        entity.setVisionLeft(dto.getVisionLeft());
        entity.setVisionRight(dto.getVisionRight());
        entity.setHearing(dto.getHearing());
        entity.setDentalHealth(dto.getDentalHealth());
        entity.setBloodPressure(dto.getBloodPressure());
        entity.setPulse(dto.getPulse());
        entity.setTemperature(dto.getTemperature());
        entity.setOtherNotes(dto.getOtherNotes());
        entity.setRecommendation(dto.getRecommendation());
        entity.setFollowUpRequired(dto.getFollowUpRequired());
        entity.setFollowUpNotes(dto.getFollowUpNotes());
        entity.setOverallHealthRating(dto.getOverallHealthRating());
        return entity;
    }

    private static BigDecimal calculateBMI(BigDecimal heightCm, BigDecimal weightKg) {
        if (heightCm == null || weightKg == null || heightCm.compareTo(BigDecimal.ZERO) == 0) return null;
        BigDecimal heightM = heightCm.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return weightKg.divide(heightM.multiply(heightM), 2, RoundingMode.HALF_UP);
    }
}