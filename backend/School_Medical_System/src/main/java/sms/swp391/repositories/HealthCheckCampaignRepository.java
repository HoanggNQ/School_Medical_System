package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.HealthCheckCampaignEntity;

import java.util.List;

@Repository
public interface HealthCheckCampaignRepository extends JpaRepository<HealthCheckCampaignEntity, Long> {
    @Query("SELECT h FROM HealthCheckCampaignEntity h ")
    List<HealthCheckCampaignEntity> getAllByHealthCheckCampaign();
}
