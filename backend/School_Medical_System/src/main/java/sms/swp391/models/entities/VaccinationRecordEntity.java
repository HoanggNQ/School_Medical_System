package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "vaccination_record")
public class VaccinationRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vaccination_campaign_id", nullable = false)
    private VaccinationCampaignEntity vaccinationCampaign;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @Size(max = 255)
    @NotNull
    @Column(name = "vaccine_name", nullable = false)
    private String vaccineName;

    @Size(max = 100)
    @NotNull
    @Column(name = "vaccine_batch", nullable = false, length = 100)
    private String vaccineBatch;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "administered_by", nullable = false)
    private UserEntity administeredBy;

    @NotNull
    @Column(name = "administration_date", nullable = false)
    private Instant administrationDate;

    @Column(name = "next_dose_date")
    private LocalDate nextDoseDate;

    @Column(name = "reaction_notes", length = Integer.MAX_VALUE)
    private String reactionNotes;

    @ColumnDefault("false")
    @Column(name = "follow_up_required")
    private Boolean followUpRequired;

    @Column(name = "follow_up_notes", length = Integer.MAX_VALUE)
    private String followUpNotes;

    @Size(max = 50)
    @Column(name = "injection_site", length = 50)
    private String injectionSite;

    @Size(max = 100)
    @Column(name = "lot_number", length = 100)
    private String lotNumber;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Size(max = 9)
    @NotNull
    @Column(name = "academic_year", nullable = false, length = 9)
    private String academicYear;

}