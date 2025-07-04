package sms.swp391.models.dtos.responses;

import lombok.*;

@Data
@AllArgsConstructor
public class DashboardOverviewDTO {
    private UserDashboardStatsDTO userStats;

    private CampaignConsentStatisticsResponseDTO healthCampaignStats;
    private CampaignConsentStatisticsResponseDTO vaccinationCampaignStats;
    private CampaignStatusStatsDTO healthCampaignStatusStats; 
    private CampaignStatusStatsDTO vaccinationCampaignStatusStats; 
}
