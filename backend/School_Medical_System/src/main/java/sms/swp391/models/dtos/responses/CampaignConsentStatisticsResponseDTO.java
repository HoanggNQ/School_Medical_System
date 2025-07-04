package sms.swp391.models.dtos.responses;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class CampaignConsentStatisticsResponseDTO {
    private Long totalInvited;
    private Long totalAgreed;
    private Long totalRejected;
    private Long totalPending;
    private Long totalDone;
}
