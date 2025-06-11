package sms.swp391.models.dtos.requests;

import lombok.*;
import jakarta.validation.constraints.*;
import sms.swp391.models.dtos.enums.HealthDeclarationStatus;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationCreateDTO {

    @NotNull
    private HealthDeclarationStatus status;

    @NotNull
    private String academicYear;

    private Float height;
    private Float weight;
    private String bloodType;
    private String allergies;
    private String chronicDiseases;
    private String currentMedications;
    private String emergencyContactName;
    private String emergencyContactPhone;
}