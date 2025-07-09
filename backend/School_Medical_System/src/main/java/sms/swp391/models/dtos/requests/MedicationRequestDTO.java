package sms.swp391.models.dtos.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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

    @Size(max = 100, message = "Country of origin must not exceed 100 characters")
    private String countryOfOrigin;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private String medicationInformation;


    @Size(max = 255, message = "Manufacturer must not exceed 255 characters")
    private String manufacturer;

    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private Integer quantity;
    @NotNull(message = "Expiry date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")        // Chấp nhận định dạng ISO‑8601 từ JSON
    private LocalDate exp;
}

