package sms.swp391.repositories;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.VaccinationRecordEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecordEntity, Long> {
    List<VaccinationRecordEntity> findByStudentId(Long studentId);
    List<VaccinationRecordEntity> findByVaccinationCampaign_Id(Long vaccinationCampaignId);
    Optional<VaccinationRecordEntity> findTopByVaccinationCampaignIdAndStudentIdOrderByAdministrationDateDesc(Long campaignId, Long studentId);

    Optional<VaccinationRecordEntity>findVaccinationRecordEntityByConsent_Id(Long consentId);

    //  Optional<VaccinationRecordEntity> findTopByVaccinationCampaignIdAndStudentIdOrderByAdministration_dateDesc(Long vaccinationCampaignId, Long studentId);
}
