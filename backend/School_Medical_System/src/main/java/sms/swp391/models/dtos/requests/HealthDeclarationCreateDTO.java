package sms.swp391.models.dtos.requests;

import lombok.*;
import jakarta.validation.constraints.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.math.BigDecimal;


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
    private BigDecimal height;
    private BigDecimal weight;
    private String bloodType;
    private String allergies;
    private String chronicDiseases;
    private String currentMedications;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
