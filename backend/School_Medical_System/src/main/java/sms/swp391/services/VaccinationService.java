package sms.swp391.services;

import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.responses.*;
import java.util.List;

public interface VaccinationService {

    // Campaign Management
    VaccinationCampaignResponse createCampaign(VaccinationCampaignRequestDTO request, Long createdById);

    VaccinationCampaignResponse updateCampaign(Long id, VaccinationCampaignRequestDTO request);

    void startCampaign(Long campaignId);

    VaccinationCampaignResponse getCampaignById(Long id);

    List<VaccinationCampaignResponse> getAllCampaigns();

    // Consent Management
    VaccinationConsentResponse updateConsent(Long consentId, VaccinationConsentRequestDTO request, Long parentId);

    List<VaccinationConsentResponse> getConsentsByCampaign(Long campaignId);

    VaccinationConsentResponse getConsentById(Long consentId);

    List<VaccinationConsentResponse> getPendingConsentsByParent(Long parentId);

    // Record Management
    VaccinationRecordResponse saveRecord(VaccinationRecordRequestDTO request, Long checkedById);

    VaccinationRecordResponse getRecordById(Long RecordId);

    List<VaccinationRecordResponse> getRecordsByCampaign(Long campaignId);

    List<VaccinationRecordResponse> getRecordsByStudent(Long studentId);

    List<VaccinationRecordResponse> getRecordsRequiringFollowUp();
}
