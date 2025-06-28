package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.VaccinationCampaignRequestDTO;
import sms.swp391.models.dtos.responses.VaccinationCampaignResponse;
import sms.swp391.models.entities.VaccinationCampaignEntity;

@RequiredArgsConstructor
public class VaccinationCampaignMapper {
    public static VaccinationCampaignResponse toDTO(VaccinationCampaignEntity entity) {
        if (entity == null) return null;

        return VaccinationCampaignResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .status(entity.getStatus())
                .targetGrade(entity.getTargetGrade())
                .vaccineType(entity.getVaccineType())
                .notes(entity.getNotes())
                .createdById(entity.getCreatedBy() != null ? entity.getCreatedBy().getUserId() : null)
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static VaccinationCampaignEntity fromRequestDTO(VaccinationCampaignRequestDTO dto) {
        if (dto == null) return null;

        VaccinationCampaignEntity entity = new VaccinationCampaignEntity();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setTargetGrade(dto.getTargetGrade());
        entity.setVaccineType(dto.getVaccineType());
        entity.setNotes(dto.getNotes());
        return entity;
    }
}