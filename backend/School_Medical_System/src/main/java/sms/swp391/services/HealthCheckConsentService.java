package sms.swp391.services;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.requests.HealthCheckConsentRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckConsentResponse;
import sms.swp391.models.dtos.responses.PaginatedHealthCheckConsentResponse;

import java.util.List;

public interface HealthCheckConsentService {

    @Transactional
    PaginatedHealthCheckConsentResponse getHealthCheckConsents(
            Long campaignId,
            String search,
            Pageable pageable);

    HealthCheckConsentResponse updateConsent(Long consentId, HealthCheckConsentRequestDTO request, Long parentId);

    HealthCheckConsentResponse getConsentById(Long id);

    List<HealthCheckConsentResponse> getConsentsByCampaign(Long campaignId);

    List<HealthCheckConsentResponse> getPendingConsentsByParent(Long parentId);

    List<HealthCheckConsentResponse> getPendingConsentsApprovedByParent(Long parentId);


    PaginatedHealthCheckConsentResponse getApprovedConsentsByCampaign(Long campaignId, Pageable pageable);
}
