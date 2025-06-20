package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.HealthDeclarationCreateDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;
import sms.swp391.models.entities.*;

import java.time.Instant;

@RequiredArgsConstructor
public class HealthDeclarationMapper {
    public static HealthDeclarationResponseDTO toDTO(HealthDeclarationEntity entity) {
        if (entity == null) return null;

        return HealthDeclarationResponseDTO.builder()
                .id(entity.getId())
                .studentId(entity.getStudent().getId())
                .declaredById(entity.getDeclaredBy().getUserId())
                .studentName(entity.getStudent().getUser().getFullname())
                .declaredByName(entity.getDeclaredBy().getFullname())
                .declarationDate(entity.getDeclarationDate())
                .status(entity.getStatus())
                .academicYear(entity.getAcademicYear())
                .height(entity.getStudent().getHeight())
                .weight(entity.getStudent().getWeight())
                .bloodType(entity.getStudent().getBloodType())
                .allergies(entity.getStudent().getAllergies())
                .chronicDiseases(entity.getStudent().getChronicDiseases())
                .currentMedications(entity.getStudent().getCurrentMedications())
                .emergencyContactName(entity.getStudent().getEmergencyContactName())
                .emergencyContactPhone(entity.getStudent().getEmergencyContactPhone())
                .build();
    }


    public static HealthDeclarationEntity fromRequestDTO(HealthDeclarationCreateDTO dto,
                                                         StudentEntity student,
                                                         UserEntity declaredBy) {
        if (dto == null) return null;

        return HealthDeclarationEntity.builder()
                .student(student)
                .declaredBy(declaredBy)
                .status(dto.getStatus())
                .academicYear(dto.getAcademicYear())
                .declarationDate(Instant.now())
                .build();
    }

    public static void updateEntityFromDTO(HealthDeclarationEntity entity, HealthDeclarationUpdateDTO dto) {
        if (entity == null || dto == null) return;

        entity.setStatus(dto.getStatus());
        entity.setAcademicYear(dto.getAcademicYear());
        entity.getStudent().setWeight(dto.getWeight());
        entity.getStudent().setBloodType(dto.getBloodType());
        entity.getStudent().setAllergies(dto.getAllergies());
        entity.getStudent().setChronicDiseases(dto.getChronicDiseases());
        entity.getStudent().setCurrentMedications(dto.getCurrentMedications());
        entity.getStudent().setEmergencyContactName(dto.getEmergencyContactName());
        entity.getStudent().setEmergencyContactPhone(dto.getEmergencyContactPhone());
    }

}
