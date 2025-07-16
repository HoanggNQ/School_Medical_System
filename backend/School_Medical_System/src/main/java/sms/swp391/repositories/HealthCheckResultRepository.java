package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.HealthCheckResultEntity;


import java.util.List;
import java.util.Optional;
@Repository
public interface HealthCheckResultRepository extends JpaRepository<HealthCheckResultEntity, Long> {
    List<HealthCheckResultEntity> findByStudentId(Long studentId);
    List<HealthCheckResultEntity> findByHealthCheckCampaign_Id(Long healthCheckCampaignId);
    Optional<HealthCheckResultEntity> findTopByStudent_IdAndHealthCheckCampaign_IdOrderByCheckDateDesc(Long studentId, Long campaignId);

    Optional<HealthCheckResultEntity> findByResultIdAndStudentId(Long resultId, Long studentId);
}