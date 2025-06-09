package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.MedicationRequestDTO;
import sms.swp391.models.dtos.respones.MedicationResponseDTO;
import sms.swp391.models.entities.MedicationEntity;
import java.time.Instant;

@RequiredArgsConstructor
public class MedicationMapper {

    public static MedicationResponseDTO toDTO(MedicationEntity entity) {
        if (entity == null) return null;

        return MedicationResponseDTO.builder()
                .id(entity.getId())
                .medicationName(entity.getMedicationName())
                .category(entity.getCategory())
                .dosageForm(entity.getDosageForm())
                .prescriptionRequired(entity.getPrescriptionRequired())
                .countryOfOrigin(entity.getCountryOfOrigin())
                .description(entity.getDescription())
                .medicationInformation(entity.getMedicationInformation())
                .medicationImg(entity.getMedicationImg())
                .activeIngredient(entity.getActiveIngredient())
                .manufacturer(entity.getManufacturer())
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
                .prescriptionRequired(dto.getPrescriptionRequired())
                .countryOfOrigin(dto.getCountryOfOrigin())
                .description(dto.getDescription())
                .medicationInformation(dto.getMedicationInformation())
                .medicationImg(dto.getMedicationImg())
                .activeIngredient(dto.getActiveIngredient())
                .manufacturer(dto.getManufacturer())
                .createdAt(Instant.now())
                .build();
    }

    public static void updateEntityFromDTO(MedicationEntity entity, MedicationRequestDTO dto) {
        if (entity == null || dto == null) return;

        entity.setMedicationName(dto.getMedicationName());
        entity.setCategory(dto.getCategory());
        entity.setDosageForm(dto.getDosageForm());
        entity.setPrescriptionRequired(dto.getPrescriptionRequired());
        entity.setCountryOfOrigin(dto.getCountryOfOrigin());
        entity.setDescription(dto.getDescription());
        entity.setMedicationInformation(dto.getMedicationInformation());
        entity.setMedicationImg(dto.getMedicationImg());
        entity.setActiveIngredient(dto.getActiveIngredient());
        entity.setManufacturer(dto.getManufacturer());
        entity.setUpdatedAt(Instant.now());
    }
}