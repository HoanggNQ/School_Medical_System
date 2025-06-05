package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "health_check_consent")
public class HealthCheckConsentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consent_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "health_check_campaign_id", nullable = false)
    private HealthCheckCampaignEntity healthCheckCampaign;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_id", nullable = false)
    private UserEntity parent;

    @Size(max = 20)
    @NotNull
    @Column(name = "consent_status", nullable = false, length = 20)
    private String consentStatus;

    @Column(name = "response_date")
    private Instant responseDate;

    @Column(name = "notes", length = Integer.MAX_VALUE)
    private String notes;

    @Column(name = "special_requests", length = Integer.MAX_VALUE)
    private String specialRequests;

    @Size(max = 9)
    @NotNull
    @Column(name = "academic_year", nullable = false, length = 9)
    private String academicYear;

    private String status;

}