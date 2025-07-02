package sms.swp391.services;

import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.responses.*;
import java.util.List;

public interface HealthCheckService {

    void endCampaign(Long campaignId);

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

    List<HealthCheckCampaignResponse> getAllCampaignsStart();

    HealthCheckResultResponse getResultById(Long id);

    List<HealthCheckResultResponse> getResultsByCampaign(Long campaignId);

    List<HealthCheckResultResponse> getResultsByStudent(Long studentId);

    PaginatedHealthCheckConsentResponse getAllHealthCheckConsents(String search, Pageable pageable);

    void deleteCampaign(Long campaignId);

    PaginatedHealthCheckConsentResponse getApprovedConsentsByCampaign(Long campaignId, Pageable pageable);
}