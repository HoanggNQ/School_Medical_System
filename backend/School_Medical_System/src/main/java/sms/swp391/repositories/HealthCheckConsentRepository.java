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

    List<HealthCheckConsentEntity> findByHealthCheckCampaignIdAndConsentStatus(Long campaignId, String status);

    Optional<HealthCheckConsentEntity> findByHealthCheckCampaignIdAndStudentId(Long campaignId, Long studentId);


    @Query("""
    SELECT c FROM HealthCheckConsentEntity c
    JOIN FETCH c.student s
    JOIN FETCH s.user su
    JOIN FETCH c.parent p
    WHERE p.userId = :parentId AND c.consentStatus = :status
""")
    List<HealthCheckConsentEntity> findByParentAndStatus(@Param("parentId") Long parentId,
                                                         @Param("status") String status);

}