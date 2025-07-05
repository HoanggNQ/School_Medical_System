package sms.swp391.models.dtos.responses;

import lombok.*;

import java.time.LocalDate;

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
    private LocalDate exp;
    private String countryOfOrigin;
    private String description;
    private String medicationInformation;
    private String medicationImg;
    private String manufacturer;
    private Integer quantity;
    private String createdAt;
    private String updatedAt;
}
