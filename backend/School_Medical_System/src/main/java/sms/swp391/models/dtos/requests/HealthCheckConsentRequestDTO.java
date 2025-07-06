package sms.swp391.models.dtos.requests;

import lombok.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckConsentRequestDTO {
    private MedicalStatus consentStatus;

}
