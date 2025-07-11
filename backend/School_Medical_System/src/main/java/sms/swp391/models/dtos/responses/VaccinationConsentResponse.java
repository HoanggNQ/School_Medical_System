package sms.swp391.models.dtos.responses;

import lombok.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VaccinationConsentResponse {
    private Long id;
    private Long campaignId;
    private Long studentId;
    private String campaignName;
    private String studentName;
    private Long parentId;
    private int phoneNumber;
    private String parentEmail;
    private LocalDate responseDate;
    private String notes;
    private String academicYear;
    private MedicalStatus consentStatus;
}
