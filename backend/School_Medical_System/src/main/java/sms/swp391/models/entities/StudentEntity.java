package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student")
public class StudentEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id", nullable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private UserEntity parent;

    @Size(max = 50)
    @NotNull
    @Column(name = "student_code", nullable = false, length = 50, unique = true)
    private String studentCode;

    @Size(max = 10)
    @Column(name = "blood_type", length = 10)
    private String bloodType;

    @Column(name = "genetic_diseases", columnDefinition = "TEXT")
    private String geneticDiseases;

    @Column(name = "other_medical_notes", columnDefinition = "TEXT")
    private String otherMedicalNotes;

    @Column(name = "emergency_contact")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> emergencyContact;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    // Relationships
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<HealthCheckConsentEntity> healthCheckConsents = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<HealthCheckResultEntity> healthCheckResults = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<HealthDeclarationEntity> healthDeclarations = new HashSet<>();


    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<MedicationRequestEntity> medicationRequests = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<VaccinationConsentEntity> vaccinationConsents = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<VaccinationRecordEntity> vaccinationRecords = new HashSet<>();


}