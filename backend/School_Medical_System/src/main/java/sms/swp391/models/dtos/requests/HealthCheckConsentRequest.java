package sms.swp391.models.dtos.requests;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckConsentRequest {
    private String status;
    private String notes;
    private String specialRequests;
}
