package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "health_check_result")
public class HealthCheckResultEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "health_check_campaign_id", nullable = false)
    private HealthCheckCampaignEntity healthCheckCampaign;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "checked_by", nullable = false)
    private UserEntity checkedBy;

    @NotNull
    @Column(name = "check_date", nullable = false)
    private Instant checkDate;

    @Column(name = "height_cm", precision = 5, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "bmi", precision = 5, scale = 2)
    private BigDecimal bmi;

    @Size(max = 10)
    @Column(name = "vision_left", length = 10)
    private String visionLeft;

    @Size(max = 10)
    @Column(name = "vision_right", length = 10)
    private String visionRight;

    @Column(name = "hearing", length = Integer.MAX_VALUE)
    private String hearing;

    @Column(name = "dental_health", length = Integer.MAX_VALUE)
    private String dentalHealth;

    @Size(max = 20)
    @Column(name = "blood_pressure", length = 20)
    private String bloodPressure;

    @Column(name = "pulse")
    private Integer pulse;

    @Column(name = "temperature", precision = 4, scale = 1)
    private BigDecimal temperature;

    @Column(name = "other_notes", length = Integer.MAX_VALUE)
    private String otherNotes;

    @Column(name = "recommendation", length = Integer.MAX_VALUE)
    private String recommendation;

    @ColumnDefault("false")
    @Column(name = "follow_up_required")
    private Boolean followUpRequired;

    @Column(name = "follow_up_notes", length = Integer.MAX_VALUE)
    private String followUpNotes;

    @Size(max = 20)
    @Column(name = "overall_health_rating", length = 20)
    private String overallHealthRating;

    @Size(max = 9)
    @NotNull
    @Column(name = "academic_year", nullable = false, length = 9)
    private String academicYear;

}