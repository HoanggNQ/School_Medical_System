package sms.swp391.services;

import sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO;
import sms.swp391.models.dtos.responses.DashboardOverviewDTO;

public interface DashboardService {
    DashboardOverviewDTO getOverview();

    CampaignConsentStatisticsResponseDTO getHealthCheckConsentStatistics(Long campaignId);

    CampaignConsentStatisticsResponseDTO getVaccinationConsentStatistics(Long campaignId);
}
