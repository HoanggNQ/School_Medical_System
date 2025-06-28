package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MedicalEventResponse {
    private Long id;
    private String eventType;
    private String description;
    private String location;
    private Long reportedById;
    private Long studentId;
    private String eventDate;
    private String status;
    private Boolean followUpRequired;
    private String followUpNotes;
}