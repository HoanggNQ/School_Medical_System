package sms.swp391.models.dtos.responses;
import lombok.*;

import java.time.LocalDate;

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
    private Double heightCm;
    private Double weightKg;
    private Double bmi;
    private String visionLeft;
    private String visionRight;
    private String hearing;
    private String dentalHealth;
    private String bloodPressure;
    private Integer pulse;
    private Double temperature;
    private String otherNotes;
    private String recommendation;
    private String followUpNotes;
    private String overallHealthRating;
    private String academicYear;
    private String healthStatus;
    private String consentStatus;

}
