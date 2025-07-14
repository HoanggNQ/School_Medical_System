package sms.swp391.models.dtos.responses;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MedicalCalendarEventDTO {
    private Long eventId;           // ID của chiến dịch (nếu có)
    private String name;               // Tên chiến dịch/sự kiện
    private String location;           // Địa điểm (nếu có)

    private LocalDate startDate;
    private LocalDate endDate;         // Nếu không có thì FE dùng startDate
    private String type;               // VACCINATION, HEALTH_CHECK, MEDICATION, CONSULTATION
}

