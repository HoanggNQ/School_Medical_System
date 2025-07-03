package sms.swp391.utils;

import sms.swp391.models.dtos.requests.MedicalEventCreateRequestDTO;
import sms.swp391.models.dtos.requests.MedicalEventUpdateRequestDTO;
import sms.swp391.models.dtos.responses.MedicalEventResponse;
import sms.swp391.models.entities.MedicalEventEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MedicalEventMapper {
    public static MedicalEventEntity toEntity(MedicalEventCreateRequestDTO dto, StudentEntity student, UserEntity reporter) {
        if (dto == null) return null;
        return MedicalEventEntity.builder()
                .eventType(dto.getEventType())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .reportedBy(reporter)
                .student(student)
                .eventDate(dto.getEventDate() != null ? dto.getEventDate() : null)
                .followUpNotes(dto.getFollowUpNotes())
                .build();
    }

    public static MedicalEventResponse toDTO(MedicalEventEntity entity) {
        if (entity == null) return null;
        return MedicalEventResponse.builder()
                .id(entity.getId())
                .eventType(entity.getEventType())
                .description(entity.getDescription())
                .location(entity.getLocation())
                .reportedById(entity.getReportedBy() != null ? entity.getReportedBy().getUserId() : null)
                .studentId(entity.getStudent() != null ? entity.getStudent().getId() : null)
                .eventDate(entity.getEventDate() != null ? entity.getEventDate() : null)
                .status(entity.getStatus() != null ? entity.getStatus() : null)
                .followUpNotes(entity.getFollowUpNotes())
                .build();
    }
}