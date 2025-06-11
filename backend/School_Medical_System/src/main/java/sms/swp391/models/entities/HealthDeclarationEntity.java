package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import sms.swp391.models.dtos.enums.HealthDeclarationStatus;

import java.time.Instant;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "health_declaration")
public class HealthDeclarationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "declaration_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "declared_by", nullable = false)
    private UserEntity declaredBy;

    @ColumnDefault("now()")
    @Column(name = "declaration_date")
    private Instant declarationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private HealthDeclarationStatus status;

    @Size(max = 9)
    @NotNull
    @Column(name = "academic_year", nullable = false, length = 9)
    private String academicYear;


}