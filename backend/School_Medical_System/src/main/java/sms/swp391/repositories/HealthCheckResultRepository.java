package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.HealthCheckResultEntity;


import java.util.List;
import java.util.Optional;
@Repository
public interface HealthCheckResultRepository extends JpaRepository<HealthCheckResultEntity, Long> {
    List<HealthCheckResultEntity> findByHealthCheckCampaignIdAndFollowUpRequired(Long campaignId, Boolean followUpRequired);

    Optional<HealthCheckResultEntity> findByFollowUpRequired(boolean b);
    List<HealthCheckResultEntity> findByStudentId(Long studentId);


}