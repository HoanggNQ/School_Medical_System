package sms.swp391.models.dtos.requests;

import lombok.Data;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDateTime;

@Data
public class MedicalEventUpdateRequestDTO {
    private String eventType;
    private String description;
    private String location;
    private Long reportedById;
    private Long studentId;
    private LocalDateTime eventDate; // ISO string, will be parsed to LocalDateTime
    private MedicalStatus status; // Use String, will be parsed to MedicalStatus enum
    private Boolean followUpRequired;
    private String followUpNotes;
}