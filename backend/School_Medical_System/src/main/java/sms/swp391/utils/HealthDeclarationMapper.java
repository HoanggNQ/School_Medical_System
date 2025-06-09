package sms.swp391.utils;


import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.HealthDeclarationDetailRequestDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationRequestDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationDetailResponseDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;
import sms.swp391.models.entities.*;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class HealthDeclarationMapper {

    public static HealthDeclarationResponseDTO toDTO(HealthDeclarationEntity entity) {
        if (entity == null) return null;

        return HealthDeclarationResponseDTO.builder()
                .id(entity.getId())
                .studentId(entity.getStudent().getId())
                .studentName(entity.getStudent().getUser().getFullname())
                .declaredById(entity.getDeclaredBy().getUserId())
                .declaredByName(entity.getDeclaredBy().getFullname())
                .declarationDate(entity.getDeclarationDate() != null ? entity.getDeclarationDate().toString() : null)
                .status(entity.getStatus())
                .reviewedById(entity.getReviewedBy() != null ? entity.getReviewedBy().getUserId() : null)
                .reviewedByName(entity.getReviewedBy() != null ? entity.getReviewedBy().getFullname() : null)
                .reviewedDate(entity.getReviewedDate() != null ? entity.getReviewedDate().toString() : null)
                .academicYear(entity.getAcademicYear())
                .details(entity.getHealthDeclarationDetails() != null ?
                        entity.getHealthDeclarationDetails().stream()
                                .map(HealthDeclarationMapper::toDetailDTO)
                                .collect(Collectors.toList()) : null)
                .build();
    }

    public static HealthDeclarationDetailResponseDTO toDetailDTO(HealthDeclarationDetailEntity entity) {
        if (entity == null) return null;

        return HealthDeclarationDetailResponseDTO.builder()
                .id(entity.getId())
                .category(entity.getCategory())
                .description(entity.getDescription())
                .severity(entity.getSeverity())
                .additionalInfo(entity.getAdditionalInfo())
                .createdAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null)
                .build();
    }

    public static HealthDeclarationEntity fromRequestDTO(HealthDeclarationRequestDTO dto,
                                                         StudentEntity student,
                                                         UserEntity declaredBy) {
        if (dto == null) return null;

        return HealthDeclarationEntity.builder()
                .student(student)
                .declaredBy(declaredBy)
                .declarationDate(Instant.now())
                .status("PENDING")
                .academicYear(dto.getAcademicYear())
                .build();
    }

    public static HealthDeclarationDetailEntity fromDetailRequestDTO(HealthDeclarationDetailRequestDTO dto,
                                                                     HealthDeclarationEntity declaration) {
        if (dto == null) return null;

        return HealthDeclarationDetailEntity.builder()
                .declaration(declaration)
                .category(dto.getCategory())
                .description(dto.getDescription())
                .severity(dto.getSeverity())
                .additionalInfo(dto.getAdditionalInfo())
                .createdAt(Instant.now())
                .build();
    }

    public static void updateEntityFromDTO(HealthDeclarationEntity entity, HealthDeclarationUpdateDTO dto) {
        if (entity == null || dto == null) return;

        entity.setAcademicYear(dto.getAcademicYear());
        // Note: Details will be handled separately in service layer
    }

    public static List<HealthDeclarationDetailEntity> fromDetailRequestDTOList(
            List<HealthDeclarationDetailRequestDTO> dtos,
            HealthDeclarationEntity declaration) {
        if (dtos == null) return null;

        return dtos.stream()
                .map(dto -> fromDetailRequestDTO(dto, declaration))
                .collect(Collectors.toList());
    }
}