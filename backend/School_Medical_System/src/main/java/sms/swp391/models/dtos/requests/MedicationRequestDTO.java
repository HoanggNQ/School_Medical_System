package sms.swp391.models.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRequestDTO {

    @NotBlank(message = "Medication name is required")
    @Size(max = 255, message = "Medication name must not exceed 255 characters")
    private String medicationName;

    @NotBlank(message = "Category is required")
    @Size(max = 255, message = "Category must not exceed 255 characters")
    private String category;

    @NotBlank(message = "Dosage form is required")
    @Size(max = 100, message = "Dosage form must not exceed 100 characters")
    private String dosageForm;

    @NotNull(message = "Prescription required field is required")
    private Boolean prescriptionRequired;

    @Size(max = 100, message = "Country of origin must not exceed 100 characters")
    private String countryOfOrigin;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private String medicationInformation;

    private String medicationImg;

    @Size(max = 255, message = "Active ingredient must not exceed 255 characters")
    private String activeIngredient;

    @Size(max = 255, message = "Manufacturer must not exceed 255 characters")
    private String manufacturer;
}

