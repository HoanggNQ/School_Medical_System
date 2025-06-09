package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.HealthCheckCampaignRequestDTO;
import sms.swp391.models.dtos.respones.HealthCheckCampaignResponse;
import sms.swp391.models.entities.HealthCheckCampaignEntity;

@RequiredArgsConstructor
public class HealthCheckCampaignMapper {
    public static HealthCheckCampaignResponse toDTO(HealthCheckCampaignEntity entity) {
        if (entity == null) return null;

        return HealthCheckCampaignResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .checkDate(entity.getCheckDate())
                .status(entity.getStatus())
                .targetGrade(entity.getTargetGrade())
                .location(entity.getLocation())
                .requiredEquipment(entity.getRequiredEquipment())
                .createdById(entity.getCreatedBy().getUserId())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static HealthCheckCampaignEntity fromRequestDTO(HealthCheckCampaignRequestDTO dto) {
        if (dto == null) return null;

        HealthCheckCampaignEntity entity = new HealthCheckCampaignEntity();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setCheckDate(dto.getCheckDate());
        entity.setTargetGrade(dto.getTargetGrade());
        entity.setLocation(dto.getLocation());
        entity.setRequiredEquipment(dto.getRequiredEquipment());
        return entity;
    }
}
