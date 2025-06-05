package sms.swp391.repositories;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.HealthCheckConsentEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthCheckConsentRepository extends JpaRepository<HealthCheckConsentEntity, Long> {

    List<HealthCheckConsentEntity> findByHealthCheckCampaignIdAndStatus(Long campaignId, String status);

    Optional<HealthCheckConsentEntity> findByHealthCheckCampaignIdAndStudentId(Long campaignId, Long studentId);

    @Query("SELECT h FROM HealthCheckConsentEntity h WHERE h.parent.userId = :parentId AND h.status = :status AND h.parent.roleName = 'PARENT'")
    Optional<HealthCheckConsentEntity> findByParentAndStatus(@Param("parentId") Long parentId, @Param("status") String status);
}