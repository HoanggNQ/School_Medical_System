package sms.swp391.models.dtos.responses;

import lombok.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthDeclarationResponseDTO {
    private Long id;
    private Long studentId; // show student code in frontend

    private Long declaredById;
    private String studentName;
    private String studentCode;
    private String declaredByName;

    private LocalDate declarationDate;
    private MedicalStatus status;
    private String academicYear;
    private Double height;
    private Double weight;
    private String bloodType;
    private String allergies;
    private String chronicDiseases;

}
