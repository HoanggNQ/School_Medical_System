package sms.swp391.utils;

import sms.swp391.models.dtos.requests.MedicalEventCreateRequestDTO;
import sms.swp391.models.dtos.responses.MedicalEventMedicationResponse;
import sms.swp391.models.dtos.responses.MedicalEventResponse;
import sms.swp391.models.entities.MedicalEventEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class MedicalEventMapper {
    public static MedicalEventEntity toEntity(MedicalEventCreateRequestDTO dto, StudentEntity student, UserEntity reporter) {
        if (dto == null) return null;
        return MedicalEventEntity.builder()
                .eventType(dto.getEventType())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .reportedBy(reporter)
                .student(student)
                .followUpNotes(dto.getFollowUpNotes())
                .build();
    }

    public static MedicalEventResponse toDTO(MedicalEventEntity entity) {
        if (entity == null) return null;
        List<MedicalEventMedicationResponse> meds = entity.getMedications() != null
                ? entity.getMedications().stream().map(med -> MedicalEventMedicationResponse.builder()
                .medicationName(med.getMedication().getMedicationName())
                .quantity(med.getQuantity())
                .build()
        ).collect(Collectors.toList())
                : Collections.emptyList();


        return MedicalEventResponse.builder()
                .id(entity.getId())
                .eventType(entity.getEventType())
                .description(entity.getDescription())
                .location(entity.getLocation())
                .reportedById(entity.getReportedBy() != null ? entity.getReportedBy().getUserId() : null)
                .studentId(entity.getStudent() != null ? entity.getStudent().getId() : null)
                .eventDate(entity.getEventDate() != null ? entity.getEventDate() : null)
                .followUpNotes(entity.getFollowUpNotes())
                .medications(meds)
                .build();
    }
}