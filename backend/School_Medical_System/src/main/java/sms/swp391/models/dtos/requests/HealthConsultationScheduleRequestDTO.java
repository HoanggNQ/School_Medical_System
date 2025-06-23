package sms.swp391.models.dtos.requests;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HealthConsultationScheduleRequestDTO {
    private Long studentId;
    private Long resultId;
    private LocalDateTime scheduleTime;
    private String reason;
}
