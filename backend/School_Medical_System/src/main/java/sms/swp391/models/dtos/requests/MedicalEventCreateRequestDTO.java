package sms.swp391.models.dtos.requests;

import lombok.Data;

@Data
public class MedicalEventCreateRequestDTO {
    private String eventType;
    private String description;
    private String location;
    private Long reportedById;
    private Long studentId;
    private String eventDate; // ISO string, will be parsed to LocalDateTime
    private Boolean followUpRequired;
    private String followUpNotes;
}