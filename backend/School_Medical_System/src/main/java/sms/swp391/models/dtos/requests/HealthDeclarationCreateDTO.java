package sms.swp391.models.dtos.requests;

import lombok.*;
import jakarta.validation.constraints.*;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationCreateDTO {
    @NotNull
    private Long studentId;
    @NotNull
    private Long declaredById;
    @NotNull
    private String academicYear;
    private Double height;
    private Double weight;
    private String bloodType;
    private String allergies;
    private String chronicDiseases;
    private String currentMedications;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
