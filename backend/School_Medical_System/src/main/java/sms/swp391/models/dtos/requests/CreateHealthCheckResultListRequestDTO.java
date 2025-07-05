package sms.swp391.models.dtos.requests;

import jakarta.validation.Valid;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateHealthCheckResultListRequestDTO {
    private Long campaignId;
    private List<@Valid HealthCheckResultRequestDTO> results;
}
