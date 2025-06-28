package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.VaccinationCampaignEntity;

import java.util.List;

@Repository
public interface VaccinationCampaignRepository extends JpaRepository<VaccinationCampaignEntity, Long> {
    @Query("SELECT h FROM VaccinationCampaignEntity h WHERE h.status = 'ACTIVE'")
    List<VaccinationCampaignEntity> getAllByVaccinationCampaign();
}
