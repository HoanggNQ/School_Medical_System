package sms.swp391.models.dtos.respones;

import lombok.*;
import sms.swp391.models.dtos.enums.HealthDeclarationStatus;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthDeclarationResponseDTO {
    private Long id;
    private Long studentId;
    private Long declaredById;
    private Instant declarationDate;
    private HealthDeclarationStatus status;
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
