package sms.swp391.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "student", schema = "public")
@Getter
@Setter
public class StudentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassEntity classEntityField;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ParentEntity parentEntity;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity userEntity;

    @Column(name = "genetic_disease", length = Integer.MAX_VALUE)
    private String geneticDisease;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "studentEntity")
    private Set<AllergyEntity> allergies = new LinkedHashSet<>();

    @OneToMany(mappedBy = "studentEntity")
    private Set<ChronicDiseaseEntity> chronicDiseaseEnities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "studentEntity")
    private Set<HealthCheckEntity> healthCheckEntities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "studentEntity")
    private Set<MedicationAssignmentEntity> medicationAssignmentEntities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "studentEntity")
    private Set<StudentMedicalRecordEntity> studentMedicalRecordEntities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "studentEntity")
    private Set<StudentVaccinationEntity> studentVaccinationEntities = new LinkedHashSet<>();
}
