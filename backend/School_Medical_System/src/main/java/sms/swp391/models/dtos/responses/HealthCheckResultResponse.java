package sms.swp391.models.dtos.responses;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckResultResponse {
    private Long id;
    private Long studentId;
    private Long campaignId;
    private String studentName;
    private String campaignName;
    private Long checkedById;
    private String checkedByName;
    private LocalDate checkDate;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private BigDecimal bmi;
    private String visionLeft;
    private String visionRight;
    private String hearing;
    private String dentalHealth;
    private String bloodPressure;
    private Integer pulse;
    private BigDecimal temperature;
    private String otherNotes;
    private String recommendation;
    private String followUpNotes;
    private String overallHealthRating;
    private String academicYear;
    private String healthStatus;
}
