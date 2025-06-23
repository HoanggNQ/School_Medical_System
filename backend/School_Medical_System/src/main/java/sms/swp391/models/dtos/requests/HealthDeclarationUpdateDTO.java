package sms.swp391.models.dtos.requests;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sms.swp391.models.dtos.enums.MedicalStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationUpdateDTO {
    @NotNull
    private MedicalStatus status;

    @NotBlank(message = "Academic year is required")
    @Size(max = 9, message = "Academic year must not exceed 9 characters")
    @Pattern(regexp = "\\d{4}-\\d{4}", message = "Academic year must be in format YYYY-YYYY")
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