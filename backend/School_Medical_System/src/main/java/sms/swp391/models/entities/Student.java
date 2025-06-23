package sms.swp391.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "student")
public class Student {
    @Id
    @Column(name = "student_id", nullable = false)
    private Long id;

    @Column(name = "height")
    private Float height;

    @Column(name = "weight")
    private Float weight;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @Size(max = 10)
    @Column(name = "blood_type", length = 10)
    private String bloodType;

    @Size(max = 50)
    @NotNull
    @Column(name = "student_code", nullable = false, length = 50)
    private String studentCode;

    @Size(max = 255)
    @Column(name = "allergies")
    private String allergies;

    @Size(max = 255)
    @Column(name = "chronic_diseases")
    private String chronicDiseases;

    @Size(max = 255)
    @Column(name = "current_medications")
    private String currentMedications;

    @Size(max = 255)
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Size(max = 255)
    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "genetic_diseases", length = Integer.MAX_VALUE)
    private String geneticDiseases;

    @Column(name = "other_medical_notes", length = Integer.MAX_VALUE)
    private String otherMedicalNotes;

    @Column(name = "emergency_contact")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> emergencyContact;

}