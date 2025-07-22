package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

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
    private List<MedicalEventMedicationResponse> medications; // 👈 đổi kiểu ở đây
}