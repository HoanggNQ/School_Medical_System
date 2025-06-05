package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "health_check_campaign")
public class HealthCheckCampaignEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "health_check_campaign_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @NotNull
    @Column(name = "check_date", nullable = false)
    private LocalDate checkDate;

    @Size(max = 20)
    @NotNull
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "target_grade")
    private Integer targetGrade;

    @Size(max = 100)
    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "required_equipment", length = Integer.MAX_VALUE)
    private String requiredEquipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private UserEntity createdBy;

    @ColumnDefault("now()")
    @Column(name = "created_at")
    private Instant createdAt;

    @OneToMany(mappedBy = "healthCheckCampaign")
    private Set<HealthCheckConsentEntity> healthCheckConsents = new LinkedHashSet<>();

    @OneToMany(mappedBy = "healthCheckCampaign")
    private Set<HealthCheckResultEntity> healthCheckResults = new LinkedHashSet<>();

}