package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Data;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class MedicalEventResponse {
    private Long id;
    private String eventType;
    private String description;
    private String location;
    private Long reportedById;
    private Long studentId;
    private LocalDateTime eventDate;
    private String followUpNotes;
}