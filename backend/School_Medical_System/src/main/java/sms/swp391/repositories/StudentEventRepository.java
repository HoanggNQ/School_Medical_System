
package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sms.swp391.models.entities.HealthCheckConsentEntity;

public interface StudentEventRepository extends JpaRepository<HealthCheckConsentEntity, Long> {

    @Query(
            value = """
        (
          SELECT 
            'HEALTH_CHECK'                                       AS type,
            hcc.health_check_campaign_id                         AS event_id,
            hccam.name                                           AS campaign,
            hccam.description                                    AS description,
            hccam.check_date                                     AS check_date,
            u.fullname                                           AS student_name,
            hccam.location                                       AS location,
            hccam.required_equipment                             AS requirement_equipment,
            hcc.consent_status                                   AS consent_status,
            CASE WHEN hcr.result_id IS NOT NULL THEN true ELSE false END 
                                                              AS completed,
            CASE 
              WHEN hcr.result_id IS NOT NULL       THEN 'COMPLETED'
              WHEN hcc.status = 'REJECTED' THEN 'REJECTED'
              ELSE 'PENDING'
            END                                                 AS status
          FROM health_check_consent hcc
          JOIN health_check_campaign hccam 
                ON hcc.health_check_campaign_id = hccam.health_check_campaign_id
          JOIN student s              ON hcc.student_id = s.student_id
          JOIN "user" u               ON s.user_id     = u.user_id
          LEFT JOIN health_check_result hcr 
                ON hcr.health_check_campaign_id = hcc.health_check_campaign_id 
               AND hcr.student_id              = hcc.student_id
          WHERE hcc.student_id = :studentId
        )
        UNION ALL
        (
          SELECT 
            'VACCINATION'                                        AS type,
            vc.vaccination_campaign_id                           AS event_id,
            vcam.name                                           AS campaign,
            vcam.description                                    AS description,
            vcam.start_date                                     AS check_date,
            u.fullname                                          AS student_name,
            vcam.location                                       AS location,
            NULL                                                AS requirement_equipment,
            vc.consent_status                                   AS consent_status,
            CASE WHEN vr.record_id IS NOT NULL THEN true ELSE false END 
                                                              AS completed,
            CASE 
              WHEN vr.record_id IS NOT NULL      THEN 'COMPLETED'
              WHEN vc.consent_status = 'REJECTED' THEN 'REJECTED'
              ELSE 'PENDING'
            END                                                 AS status
          FROM vaccination_consent vc
          JOIN vaccination_campaign vcam 
                ON vc.vaccination_campaign_id = vcam.vaccination_campaign_id
          JOIN student s              ON vc.student_id = s.student_id
          JOIN "user" u               ON s.user_id     = u.user_id
          LEFT JOIN vaccination_record vr 
                ON vr.vaccination_campaign_id = vc.vaccination_campaign_id 
               AND vr.student_id             = vc.student_id
          WHERE vc.student_id = :studentId
        )
        ORDER BY completed ASC, consent_status ASC, check_date ASC
        """,
            countQuery = """
        SELECT COUNT(*) FROM (
            SELECT 1 FROM health_check_consent WHERE student_id = :studentId
            UNION ALL
            SELECT 1 FROM vaccination_consent WHERE student_id = :studentId
        ) AS total
        """,
            nativeQuery = true
    )
    Page<StudentHealthEventProjection> findAllHealthEventsByStudent(
            @Param("studentId") Long studentId,
            Pageable pageable);
}