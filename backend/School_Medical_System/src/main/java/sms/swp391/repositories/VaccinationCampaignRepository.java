package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.VaccinationCampaignEntity;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VaccinationCampaignRepository extends JpaRepository<VaccinationCampaignEntity, Long> {
    List<VaccinationCampaignEntity> findByStatus(String status);
    List<VaccinationCampaignEntity> findByStartDateBetween(LocalDate start, LocalDate end);
    List<VaccinationCampaignEntity> findByEndDateBetween(LocalDate start, LocalDate end);
}
