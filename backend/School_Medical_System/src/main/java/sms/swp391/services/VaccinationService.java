package sms.swp391.services;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.responses.*;
import sms.swp391.models.entities.UserEntity;

import java.util.List;

public interface VaccinationService {

    @Transactional
    void remindUnconfirmedParents(Long campaignId);

    @Transactional
    List<VaccinationRecordResponse> createBulkRecords(CreateVaccinationRecordListRequestDTO request, Long nurseId);

    // Campaign Management
    void endCampaign(Long campaignId);

    VaccinationCampaignResponse createCampaign(VaccinationCampaignRequestDTO request, Long createdById);

    VaccinationCampaignResponse updateCampaign(Long id, VaccinationCampaignRequestDTO request);

    void sendConsentNotifications(Long campaignId, Long triggeredByUserId);

    void startCampaign(Long campaignId);

    VaccinationRecordResponse getRecordbyConsentId(Long id);

    VaccinationCampaignResponse getCampaignById(Long id);

    List<VaccinationCampaignResponse> getAllCampaigns();

    List<VaccinationCampaignResponse> getAllCampaignsStart();

    // Consent Management
    VaccinationConsentResponse updateConsent(Long consentId, VaccinationConsentRequestDTO request, Long parentId);

    List<VaccinationConsentResponse> getConsentsByCampaign(Long campaignId);

    VaccinationConsentResponse getConsentById(Long consentId);

    List<VaccinationConsentResponse> getPendingConsentsByParent(Long parentId);

    List<VaccinationConsentResponse> getPendingConsentsApprovedByParent(Long parentId);

    PaginatedVaccinationConsentResponse getAllVaccinationConsents(String search, Pageable pageable);

    PaginatedVaccinationConsentResponse getApprovedConsentsByCampaign(Long campaignId, Pageable pageable);

    // Record Management
    VaccinationRecordResponse saveRecord(VaccinationRecordRequestDTO request, Long checkedById);

    VaccinationRecordResponse getRecordById(Long RecordId);

    List<VaccinationRecordResponse> getRecordsByCampaign(Long campaignId);

    List<VaccinationRecordResponse> getRecordsByStudent(Long studentId);

    void deleteCampaign(Long campaignId);
}