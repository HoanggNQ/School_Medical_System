package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.entities.HealthCheckCampaignEntity;

import java.util.List;

@Repository
public interface HealthCheckCampaignRepository extends JpaRepository<HealthCheckCampaignEntity, Long> {
    @Query("SELECT h FROM HealthCheckCampaignEntity h WHERE h.status = 'ACTIVE'")
    List<HealthCheckCampaignEntity> getAllByHealthCheckCampaign();
    @Query("""
        SELECT
            'HEALTH_CHECK'                         AS type,
            cam.id                                 AS campaignId,
            cam.name                               AS campaignName,
            con.id                                 AS consentId,
            cam.startDate                          AS startDate,
            cam.endDate                            AS endDate,
            con.consentStatus                      AS consentStatus,
            stu.user.fullname                      AS studentName,
            cam.location                           AS location,
            CASE
              WHEN res.resultId IS NOT NULL                THEN 'COMPLETED'
              WHEN con.consentStatus = 'REJECTED'          THEN 'REJECTED'
              WHEN con.id IS NULL                          THEN 'NO_CONSENT'
              ELSE 'PENDING'
            END                                    AS resultStatus
        FROM HealthCheckCampaignEntity cam
        LEFT JOIN cam.healthCheckConsents con
               ON con.student.id = :studentId
        LEFT JOIN cam.healthCheckResults  res
               ON res.student.id = :studentId
        JOIN StudentEntity stu
               ON stu.id = :studentId
        WHERE LOWER(cam.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<StudentHealthEventProjection> findEvents(
            @Param("studentId") Long studentId,
            @Param("keyword")   String keyword,
            Pageable pageable);
    @Query("SELECT h.status, COUNT(h) FROM HealthCheckCampaignEntity h GROUP BY h.status")
    List<Object[]> countCampaignsByStatus();
}
