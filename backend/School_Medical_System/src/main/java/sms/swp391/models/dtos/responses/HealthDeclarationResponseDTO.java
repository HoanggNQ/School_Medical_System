package sms.swp391.models.dtos.responses;

import lombok.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthDeclarationResponseDTO {
    private Long id;
    private Long studentId;
    private Long declaredById;
    private String studentName;
    private String declaredByName;

    private LocalDate declarationDate;
    private MedicalStatus status;
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
