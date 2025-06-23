package sms.swp391.models.dtos.respones;

import lombok.*;

import java.time.Instant;
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
    private String studentName;
    private Long parentId;
    private int phoneNumber;
    private String parentName;
    private String consentFormUrl;
    private LocalDate responseDate;
    private String notes;
    private String academicYear;
    private String consentStatus;
}
