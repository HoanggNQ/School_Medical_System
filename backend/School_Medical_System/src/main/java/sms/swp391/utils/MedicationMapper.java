package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.MedicationRequestDTO;
import sms.swp391.models.dtos.responses.MedicationResponseDTO;
import sms.swp391.models.entities.MedicationEntity;
import java.time.LocalDate;

@RequiredArgsConstructor
public class MedicationMapper {

    public static MedicationResponseDTO toDTO(MedicationEntity entity) {
        if (entity == null) return null;

        return MedicationResponseDTO.builder()
                .id(entity.getId())
                .medicationName(entity.getMedicationName())
                .category(entity.getCategory())
                .dosageForm(entity.getDosageForm())
                .exp(entity.getEXP())
                .countryOfOrigin(entity.getCountryOfOrigin())
                .description(entity.getDescription())
                .medicationInformation(entity.getMedicationInformation())
                .medicationImg(entity.getMedicationImg())
                .manufacturer(entity.getManufacturer())
                .quantity(entity.getQuantity())
                .createdAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null)
                .updatedAt(entity.getUpdatedAt() != null ? entity.getUpdatedAt().toString() : null)
                .build();
    }

    public static MedicationEntity fromRequestDTO(MedicationRequestDTO dto) {
        if (dto == null) return null;

        return MedicationEntity.builder()
                .medicationName(dto.getMedicationName())
                .category(dto.getCategory())
                .dosageForm(dto.getDosageForm())
                .countryOfOrigin(dto.getCountryOfOrigin())
                .EXP(dto.getExp())
                .description(dto.getDescription())
                .medicationInformation(dto.getMedicationInformation())
                .manufacturer(dto.getManufacturer())
                .quantity(dto.getQuantity())
                .createdAt(LocalDate.now())
                .build();
    }

    public static void updateEntityFromDTO(MedicationEntity entity, MedicationRequestDTO dto) {
        if (entity == null || dto == null) return;

        entity.setMedicationName(dto.getMedicationName());
        entity.setCategory(dto.getCategory());
        entity.setDosageForm(dto.getDosageForm());
        entity.setCountryOfOrigin(dto.getCountryOfOrigin());
        entity.setEXP(dto.getExp());
        entity.setDescription(dto.getDescription());
        entity.setMedicationInformation(dto.getMedicationInformation());
        entity.setManufacturer(dto.getManufacturer());
        entity.setQuantity(dto.getQuantity());
        entity.setUpdatedAt(LocalDate.now());
    }
}