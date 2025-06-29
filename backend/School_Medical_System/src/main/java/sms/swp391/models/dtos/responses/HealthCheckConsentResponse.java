package sms.swp391.models.dtos.responses;

import lombok.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckConsentResponse {
    private Long id;
    private Long campaignId;
    private Long consentId;
    private Long studentId;
    private String studentName;
    private String className;
    private Long parentId;
    private int phoneNumber;
    private String parentName;
    private MedicalStatus status;
    private LocalDate responseDate;
    private String academicYear;
}
