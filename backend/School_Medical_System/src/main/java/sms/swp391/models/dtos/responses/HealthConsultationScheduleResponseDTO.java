package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Data;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class HealthConsultationScheduleResponseDTO {
    private Long id;
    private String studentName;
    private String parentName;
    private Long resultId;
    private LocalDateTime scheduleTime;
    private String reason;
    private MedicalStatus status;
}
