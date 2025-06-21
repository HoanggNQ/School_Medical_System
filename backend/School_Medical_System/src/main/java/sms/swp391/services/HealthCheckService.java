package sms.swp391.services;

import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.respones.*;
import java.util.List;

public interface HealthCheckService {


    HealthCheckCampaignResponse createCampaign(HealthCheckCampaignRequestDTO request, Long createdById);

    HealthCheckCampaignResponse updateCampaign(Long id, HealthCheckCampaignRequestDTO request);

    void startCampaign(Long campaignId);

    HealthCheckConsentResponse updateConsent(Long consentId, HealthCheckConsentRequestDTO request, Long parentId);

    HealthCheckResultResponse saveResult(HealthCheckResultRequestDTO request, Long checkedById);

    HealthCheckCampaignResponse getCampaignById(Long id);

    HealthCheckConsentResponse getConsentById(Long id);

    List<HealthCheckConsentResponse> getConsentsByCampaign(Long campaignId);

    List<HealthCheckConsentResponse> getPendingConsentsByParent(Long parentId);

    List<HealthCheckConsentResponse> getPendingConsentsApprovedByParent(Long parentId);

    List<HealthCheckCampaignResponse> getAllCampaigns();

    HealthCheckResultResponse getResultById(Long id);

    List<HealthCheckResultResponse> getResultsByCampaign(Long campaignId);

    List<HealthCheckResultResponse> getResultsByStudent(Long studentId);
}