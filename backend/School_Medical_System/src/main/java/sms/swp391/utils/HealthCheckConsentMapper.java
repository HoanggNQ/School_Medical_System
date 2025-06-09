package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.HealthCheckConsentRequestDTO;
import sms.swp391.models.dtos.respones.HealthCheckConsentResponse;
import sms.swp391.models.entities.HealthCheckConsentEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;

import java.util.Optional;

@RequiredArgsConstructor
public class HealthCheckConsentMapper {
    public static HealthCheckConsentResponse toDTO(HealthCheckConsentEntity entity) {
        if (entity == null) return null;

        return HealthCheckConsentResponse.builder()
                .id(entity.getId())
                .campaignId(entity.getHealthCheckCampaign().getId())
                .studentId(entity.getStudent().getId())
                .studentName(Optional.ofNullable(entity.getStudent()).map(StudentEntity::getUser).map(UserEntity::getFullname).orElse(null))
                .parentId(entity.getParent().getUserId())
                .parentName(entity.getParent().getUsername())
                .status(entity.getStatus())
                .notes(entity.getNotes())
                .specialRequests(entity.getSpecialRequests())
                .responseDate(entity.getResponseDate())
                .academicYear(entity.getAcademicYear())
                .build();
    }

    public static HealthCheckConsentEntity fromRequestDTO(HealthCheckConsentRequestDTO dto) {
        if (dto == null) return null;

        HealthCheckConsentEntity entity = new HealthCheckConsentEntity();
        entity.setStatus(dto.getStatus());
        entity.setNotes(dto.getNotes());
        entity.setSpecialRequests(dto.getSpecialRequests());
        return entity;
    }
}
