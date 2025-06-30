package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import sms.swp391.models.dtos.enums.MedicalStatus;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "medical_event")
public class MedicalEventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @NotNull
    @Column(name = "event_type", nullable = false, length = Integer.MAX_VALUE)
    private String eventType;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "location", length = Integer.MAX_VALUE)
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by")
    private UserEntity reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private StudentEntity student;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = Integer.MAX_VALUE)
    private MedicalStatus status;

    @ColumnDefault("false")
    @Column(name = "follow_up_required")
    private Boolean followUpRequired;

    @Column(name = "follow_up_notes", length = Integer.MAX_VALUE)
    private String followUpNotes;
}