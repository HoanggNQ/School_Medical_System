package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "medication", schema = "public")
public class MedicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "medication_name")
    private String medicationName;

    @Size(max = 100)
    @Column(name = "medication_dose", length = 100)
    private String medicationDose;

    @Size(max = 100)
    @Column(name = "medication_frequency", length = 100)
    private String medicationFrequency;

    @OneToMany(mappedBy = "medicationEntity")
    private Set<MedicationAssignmentEntity> medicationAssignmentEntities = new LinkedHashSet<>();

}