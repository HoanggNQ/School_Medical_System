package sms.swp391.utils;

import sms.swp391.models.dtos.requests.MedicalEventRequestDTO;
import sms.swp391.models.dtos.responses.MedicalEventResponse;
import sms.swp391.models.entities.MedicalEventEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDate;

public class MedicalEventMapper {
    public static MedicalEventEntity toEntity(MedicalEventRequestDTO dto, StudentEntity student, UserEntity reporter) {
        if (dto == null) return null;
        return MedicalEventEntity.builder()
                .eventType(dto.getEventType())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .reportedBy(reporter)
                .student(student)
                .eventDate(dto.getEventDate() != null ? LocalDate.parse(dto.getEventDate()) : null)
                .status(dto.getStatus() != null ? MedicalStatus.valueOf(dto.getStatus()) : null)
                .followUpRequired(dto.getFollowUpRequired())
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
                .eventDate(entity.getEventDate() != null ? entity.getEventDate().toString() : null)
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .followUpRequired(entity.getFollowUpRequired())
                .followUpNotes(entity.getFollowUpNotes())
                .build();
    }
}