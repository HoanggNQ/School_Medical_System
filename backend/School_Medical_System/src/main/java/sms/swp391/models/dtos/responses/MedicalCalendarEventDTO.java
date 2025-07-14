package sms.swp391.models.dtos.responses;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MedicalCalendarEventDTO {
    private LocalDate startDate;
    private LocalDate endDate;   // Nếu không có thì FE dùng startDate
    private String type;         // VACCINATION, HEALTH_CHECK, MEDICATION, CONSULTATION
}
