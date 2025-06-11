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
                .declarationDate(entity.getDeclarationDate())
                .status(entity.getStatus())
                .academicYear(entity.getAcademicYear())

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

    }
}
