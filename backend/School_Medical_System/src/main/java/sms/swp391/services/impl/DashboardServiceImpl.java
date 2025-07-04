package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO;
import sms.swp391.models.dtos.responses.CampaignStatusStatsDTO;
import sms.swp391.models.dtos.responses.DashboardOverviewDTO;
import sms.swp391.repositories.*;
import sms.swp391.services.DashboardService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userStatsRepo;
    private final HealthCheckConsentRepository healthCheckConsentRepository;
    private final VaccinationConsentRepository vaccinationConsentRepository;
    private final VaccinationCampaignRepository vaccinationCampaignRepository;
    private final HealthCheckCampaignRepository healthCheckCampaignRepository;

    @Override
    public DashboardOverviewDTO getOverview() {
        return new DashboardOverviewDTO(
                userStatsRepo.fetchUserDashboardStats(),
                healthCheckConsentRepository.fetchOverallHealthConsentStats(),
                vaccinationConsentRepository.fetchOverallVaccinationConsentStats(),
                buildStatsFromRaw(healthCheckCampaignRepository.countCampaignsByStatus()),
                buildStatsFromRaw(vaccinationCampaignRepository.countCampaignsByStatus())
        );
    }
    @Override
    public CampaignConsentStatisticsResponseDTO getHealthCheckConsentStatistics(Long campaignId) {
        Long totalInvited = healthCheckConsentRepository.countByHealthCheckCampaign_Id(campaignId);
        Long totalAgreed = healthCheckConsentRepository.countByHealthCheckCampaign_IdAndConsentStatus(campaignId, MedicalStatus.APPROVED);
        Long totalRejected = healthCheckConsentRepository.countByHealthCheckCampaign_IdAndConsentStatus(campaignId, MedicalStatus.REJECTED);
        Long totalPending = healthCheckConsentRepository.countByHealthCheckCampaign_IdAndConsentStatus(campaignId, MedicalStatus.PENDING);
        Long totalDone = healthCheckConsentRepository.countByHealthCheckCampaign_IdAndConsentStatus(campaignId, MedicalStatus.DONE);

        return new CampaignConsentStatisticsResponseDTO(totalInvited, totalAgreed, totalRejected, totalPending,totalDone);
    }
    @Override
    public CampaignConsentStatisticsResponseDTO getVaccinationConsentStatistics(Long campaignId) {
        Long totalInvited = vaccinationConsentRepository.countByVaccinationCampaign_Id(campaignId);
        Long totalAgreed = vaccinationConsentRepository.countByVaccinationCampaign_IdAndConsentStatus(campaignId, MedicalStatus.APPROVED);
        Long totalRejected = vaccinationConsentRepository.countByVaccinationCampaign_IdAndConsentStatus(campaignId, MedicalStatus.REJECTED);
        Long totalPending = vaccinationConsentRepository.countByVaccinationCampaign_IdAndConsentStatus(campaignId, MedicalStatus.PENDING);
        Long totalDone = vaccinationConsentRepository.countByVaccinationCampaign_IdAndConsentStatus(campaignId, MedicalStatus.DONE);

        return new CampaignConsentStatisticsResponseDTO(totalInvited, totalAgreed, totalRejected, totalPending,totalDone);
    }
    private CampaignStatusStatsDTO buildStatsFromRaw(List<Object[]> rawData) {
        CampaignStatusStatsDTO dto = new CampaignStatusStatsDTO();

        long total = 0;
        for (Object[] row : rawData) {
            MedicalStatus status = (MedicalStatus) row[0];
            long count = (Long) row[1];
            total += count;

            switch (status) {
                case PENDING -> dto.setPending(count);
                case APPROVED -> dto.setApproved(count);
                case ACTIVE -> dto.setActive(count);
                case DONE -> dto.setDone(count);
                case REJECTED -> dto.setRejected(count);
            }
        }
        dto.setTotal(total);
        return dto;
    }

}
