package sms.swp391.services;

import sms.swp391.models.dtos.requests.HealthCheckCampaignRequestDTO;
import sms.swp391.models.dtos.responses.ApprovedEventResponse;
import sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO;
import sms.swp391.models.dtos.responses.HealthCheckCampaignResponse;

import java.util.List;

public interface HealthCheckCampaignService {

    HealthCheckCampaignResponse createCampaign(HealthCheckCampaignRequestDTO request, Long createdById);

    HealthCheckCampaignResponse updateCampaign(Long id, HealthCheckCampaignRequestDTO request);

    void startCampaign(Long campaignId);

    List<ApprovedEventResponse> getApprovedEventsByStudentId(Long studentId);

    void endCampaign(Long campaignId);

    HealthCheckCampaignResponse getCampaignById(Long id);

    List<HealthCheckCampaignResponse> getAllCampaigns();

    List<HealthCheckCampaignResponse> getAllCampaignsStart();

    void deleteCampaign(Long campaignId);

    void remindUnconfirmedParents(Long campaignId);
    void sendConsentEmails(Long campaignId, Long triggeredByUserId);
}
