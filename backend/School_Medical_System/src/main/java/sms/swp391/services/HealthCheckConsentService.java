package sms.swp391.services;

import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.requests.HealthCheckConsentRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckConsentResponse;
import sms.swp391.models.dtos.responses.PaginatedHealthCheckConsentResponse;

import java.util.List;

public interface HealthCheckConsentService {

    HealthCheckConsentResponse updateConsent(Long consentId, HealthCheckConsentRequestDTO request, Long parentId);

    HealthCheckConsentResponse getConsentById(Long id);

    List<HealthCheckConsentResponse> getConsentsByCampaign(Long campaignId);

    List<HealthCheckConsentResponse> getPendingConsentsByParent(Long parentId);

    List<HealthCheckConsentResponse> getPendingConsentsApprovedByParent(Long parentId);

    PaginatedHealthCheckConsentResponse getAllHealthCheckConsents(String search, Pageable pageable);

    PaginatedHealthCheckConsentResponse getApprovedConsentsByCampaign(Long campaignId, Pageable pageable);
}
