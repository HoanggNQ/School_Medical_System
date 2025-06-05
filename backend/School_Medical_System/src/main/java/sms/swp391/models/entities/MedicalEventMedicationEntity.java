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
@Table(name = "medical_event_medication")
public class MedicalEventMedicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "event_id", nullable = false)
    private MedicalEventEntity event;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medication_id", nullable = false)
    private MedicationEntity medication;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "administered_by", nullable = false)
    private UserEntity administeredBy;

    @NotNull
    @Column(name = "administration_time", nullable = false)
    private Instant administrationTime;

    @NotNull
    @Column(name = "dosage", nullable = false, length = Integer.MAX_VALUE)
    private String dosage;

    @Column(name = "notes", length = Integer.MAX_VALUE)
    private String notes;

    @Size(max = 20)
    @Column(name = "effectiveness", length = 20)
    private String effectiveness;

}