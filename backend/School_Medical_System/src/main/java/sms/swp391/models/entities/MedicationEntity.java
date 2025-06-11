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
@Table(name = "medication")
public class MedicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_id", nullable = false)
    private Long id;

    @NotNull
    @ColumnDefault("true")
    @Column(name = "prescription_required", nullable = false)
    private Boolean prescriptionRequired = false;

    @Size(max = 100)
    @Column(name = "country_of_origin", length = 100)
    private String countryOfOrigin;

    @Size(max = 100)
    @NotNull
    @Column(name = "dosage_form", nullable = false, length = 100)
    private String dosageForm;

    @Size(max = 255)
    @NotNull
    @Column(name = "category", nullable = false)
    private String category;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "medication_information", length = Integer.MAX_VALUE)
    private String medicationInformation;

    @Size(max = 255)
    @NotNull
    @Column(name = "medication_name", nullable = false)
    private String medicationName;

    @Column(name = "medication_img", length = Integer.MAX_VALUE)
    private String medicationImg;

    @Size(max = 255)
    @Column(name = "manufacturer")
    private String manufacturer;

    @ColumnDefault("now()")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "medication")
    private Set<MedicationRequestDetailEntity> medicationRequestDetails = new LinkedHashSet<>();

}