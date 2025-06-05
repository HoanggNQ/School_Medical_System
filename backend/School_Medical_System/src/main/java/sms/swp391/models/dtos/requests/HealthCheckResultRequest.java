package sms.swp391.models.dtos.requests;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckResultRequest {
    private Long campaignId;
    private Long studentId;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
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
}
