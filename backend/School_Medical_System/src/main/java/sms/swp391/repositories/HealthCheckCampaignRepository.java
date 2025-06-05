package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.HealthCheckCampaignEntity;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthCheckCampaignRepository extends JpaRepository<HealthCheckCampaignEntity, Long> {
    List<HealthCheckCampaignEntity> findByStatus(String status);
    List<HealthCheckCampaignEntity> findByCheckDateBetween(LocalDate start, LocalDate end);
}
