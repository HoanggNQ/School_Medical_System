package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.VaccinationRecordEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecordEntity, Long> {
    List<VaccinationRecordEntity> findByVaccinationCampaignIdAndFollowUpRequired(Long campaignId, Boolean followUpRequired);

    Optional<VaccinationRecordEntity> findByFollowUpRequired(boolean b);

    List<VaccinationRecordEntity> findByStudentId(Long studentId);
}
