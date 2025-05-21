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
@Table(name = "medication")
public class MedicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "medication_name")
    private String medicationName;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Size(max = 255)
    @Column(name = "medication_information")
    private String medicationInformation;

    @Size(max = 100)
    @Column(name = "dosage_form", length = 100)
    private String dosageForm;

    @Size(max = 255)
    @Column(name = "category")
    private String category;

    @Size(max = 100)
    @Column(name = "country_of_origin", length = 100)
    private String countryOfOrigin;

    @Column(name = "prescription_required")
    private Boolean prescriptionRequired;

    @Column(name = "medication_img", length = Integer.MAX_VALUE)
    private String medicationImg;

    @OneToMany(mappedBy = "medication")
    private Set<PrescriptionDetailEntity> prescriptionDetails = new LinkedHashSet<>();

}