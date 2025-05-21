package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "health_check")
public class HealthCheckEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "health_check_id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "check_date", nullable = false)
    private LocalDate checkDate;

    @Column(name = "height_cm", precision = 5, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Size(max = 10)
    @Column(name = "vision_left", length = 10)
    private String visionLeft;

    @Size(max = 10)
    @Column(name = "vision_right", length = 10)
    private String visionRight;

    @Size(max = 20)
    @Column(name = "blood_pressure", length = 20)
    private String bloodPressure;

    @Size(max = 100)
    @Column(name = "hearing", length = 100)
    private String hearing;

    @Column(name = "dental_health", length = Integer.MAX_VALUE)
    private String dentalHealth;

    @Column(name = "skin_health", length = Integer.MAX_VALUE)
    private String skinHealth;

    @Column(name = "other_conditions", length = Integer.MAX_VALUE)
    private String otherConditions;

    @Column(name = "notes", length = Integer.MAX_VALUE)
    private String notes;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

}