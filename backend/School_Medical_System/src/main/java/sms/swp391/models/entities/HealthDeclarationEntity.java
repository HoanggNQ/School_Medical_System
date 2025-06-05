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

    @Size(max = 20)
    @NotNull
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private UserEntity reviewedBy;

    @Column(name = "reviewed_date")
    private Instant reviewedDate;

    @Size(max = 9)
    @NotNull
    @Column(name = "academic_year", nullable = false, length = 9)
    private String academicYear;

    @OneToMany(mappedBy = "declaration")
    private Set<HealthDeclarationDetailEntity> healthDeclarationDetails = new LinkedHashSet<>();

}