package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "medical_event")
public class MedicalEventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reported_by", nullable = false)
    private UserEntity reportedBy;

    @Size(max = 50)
    @NotNull
    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @ColumnDefault("now()")
    @Column(name = "event_date")
    private Instant eventDate;

    @Column(name = "resolved_date")
    private Instant resolvedDate;

    @Size(max = 20)
    @NotNull
    @Column(name = "severity", nullable = false, length = 20)
    private String severity;

    @NotNull
    @Column(name = "description", nullable = false, length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "action_taken", length = Integer.MAX_VALUE)
    private String actionTaken;

    @ColumnDefault("false")
    @Column(name = "follow_up_required")
    private Boolean followUpRequired;

    @Column(name = "follow_up_notes", length = Integer.MAX_VALUE)
    private String followUpNotes;

    @Size(max = 100)
    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "witnesses", length = Integer.MAX_VALUE)
    private String witnesses;

    @Size(max = 9)
    @NotNull
    @Column(name = "academic_year", nullable = false, length = 9)
    private String academicYear;

    @OneToMany(mappedBy = "event")
    private Set<MedicalEventMedicationEntity> medicalEventMedications = new LinkedHashSet<>();

}