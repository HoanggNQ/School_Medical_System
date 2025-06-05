package sms.swp391.models.dtos.respones;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckResultResponse {
    private Long id;
    private Long campaignId;
    private Long studentId;
    private String studentName;
    private Long checkedById;
    private String checkedByName;
    private Instant checkDate;
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
    private Boolean followUpRequired;
    private String followUpNotes;
    private String overallHealthRating;
    private String academicYear;
}
