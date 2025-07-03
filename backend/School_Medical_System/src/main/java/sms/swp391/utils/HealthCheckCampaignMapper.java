package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.HealthCheckCampaignRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckCampaignResponse;
import sms.swp391.models.entities.HealthCheckCampaignEntity;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
public class HealthCheckCampaignMapper {
    public static HealthCheckCampaignResponse toDTO(HealthCheckCampaignEntity entity) {
        if (entity == null) return null;

        return HealthCheckCampaignResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .status(entity.getStatus())
                .targetGrade(entity.getTargetGrade() != null ? Arrays.asList(entity.getTargetGrade().split(",")) : List.of())
                .location(entity.getLocation())
                .createdById(entity.getCreatedBy().getUserId())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static HealthCheckCampaignEntity fromRequestDTO(HealthCheckCampaignRequestDTO dto) {
        if (dto == null) return null;

        HealthCheckCampaignEntity entity = new HealthCheckCampaignEntity();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setTargetGrade(String.join(",", dto.getTargetGrade()));
        entity.setLocation(dto.getLocation());
        return entity;
    }

    public static List<String> parseTargetGrades(HealthCheckCampaignEntity e) {
        return Arrays.stream(e.getTargetGrade().split(","))
                .map(String::trim)
                .toList();
    }
}
