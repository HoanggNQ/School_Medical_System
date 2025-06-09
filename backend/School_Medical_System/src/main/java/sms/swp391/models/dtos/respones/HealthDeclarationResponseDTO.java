package sms.swp391.models.dtos.respones;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationResponseDTO {

    private Long id;
    private Long studentId;
    private String studentName;
    private Long declaredById;
    private String declaredByName;
    private String declarationDate;
    private String status;
    private Long reviewedById;
    private String reviewedByName;
    private String reviewedDate;
    private String academicYear;
    private List<HealthDeclarationDetailResponseDTO> details;
}