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
@Table(name = "medical_records")
public class MedicalRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medical_record_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "medical_type")
    private String medicalType;

    @Column(name = "medical_description", length = Integer.MAX_VALUE)
    private String medicalDescription;

    @OneToMany(mappedBy = "medicalRecord")
    private Set<StudentMedicalRecordEntity> studentMedicalRecords = new LinkedHashSet<>();

}