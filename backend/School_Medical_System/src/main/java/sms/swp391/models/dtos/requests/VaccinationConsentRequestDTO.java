package sms.swp391.models.dtos.requests;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VaccinationConsentRequestDTO {
    private String consentStatus;
}
