package sms.swp391.models.dtos.respones;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedicationResponseDTO {
    private Long id;
    private String medicationName;
    private String category;
    private String dosageForm;
    private Boolean prescriptionRequired;
    private String countryOfOrigin;
    private String description;
    private String medicationInformation;
    private String medicationImg;
    private String activeIngredient;
    private String manufacturer;
    private String createdAt;
    private String updatedAt;
}
