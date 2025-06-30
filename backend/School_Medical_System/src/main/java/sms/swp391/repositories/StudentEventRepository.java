
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
        'HEALTH_CHECK'                                AS type,
        hccam.health_check_campaign_id                             AS event_id,
        hcc.consent_id                                AS consent_id,
        hccam.name                                    AS campaign,
        hccam.description                             AS description,
        hccam.check_date                              AS check_date,
        stuUser.fullname                              AS student_name,
        hccam.location                                AS location,
        hccam.required_equipment                      AS requirement_equipment,
        hcc.consent_status                            AS consent_status,
        CASE WHEN hcr.result_id IS NOT NULL THEN true ELSE false END AS completed,
        CASE
          WHEN hcr.result_id IS NOT NULL          THEN 'COMPLETED'
          WHEN hcc.consent_status = 'REJECTED'    THEN 'REJECTED'
          WHEN hcc.consent_id IS NULL             THEN 'NO_CONSENT'
          ELSE 'PENDING'
        END                                           AS result_status
      FROM health_check_campaign               hccam
      LEFT JOIN health_check_consent           hcc
             ON hcc.health_check_campaign_id = hccam.health_check_campaign_id
            AND hcc.student_id               = :studentId
      LEFT JOIN health_check_result            hcr
             ON hcr.health_check_campaign_id  = hccam.health_check_campaign_id
            AND hcr.student_id                = :studentId
      JOIN student                             stu  ON stu.student_id = :studentId
      JOIN "user"                              stuUser ON stu.user_id = stuUser.user_id
    )
    UNION ALL
    /* ---------- VACCINATION ---------- */
    (
      SELECT 
        'VACCINATION'                               AS type,
        vcam.vaccination_campaign_id                AS event_id,
        vc.consent_id                               AS consent_id,
        vcam.name                                   AS campaign,
        vcam.description                            AS description,
        vcam.start_date                             AS check_date,
        stuUser.fullname                            AS student_name,
        vcam.location                               AS location,
        NULL                                        AS requirement_equipment,
        vc.consent_status                           AS consent_status,
        CASE WHEN vr.record_id IS NOT NULL THEN true ELSE false END AS completed,
        CASE
          WHEN vr.record_id IS NOT NULL          THEN 'COMPLETED'
          WHEN vc.consent_status = 'REJECTED'    THEN 'REJECTED'
          WHEN vc.consent_id IS NULL             THEN 'NO_CONSENT'
          ELSE 'PENDING'
        END                                         AS result_status
      FROM vaccination_campaign               vcam
      LEFT JOIN vaccination_consent           vc
             ON vc.vaccination_campaign_id   = vcam.vaccination_campaign_id
            AND vc.student_id                = :studentId
      LEFT JOIN vaccination_record            vr
             ON vr.vaccination_campaign_id    = vcam.vaccination_campaign_id
            AND vr.student_id                 = :studentId
      JOIN student                             stu  ON stu.student_id = :studentId
      JOIN "user"                              stuUser ON stu.user_id = stuUser.user_id
    )
    ORDER BY completed ASC, result_status ASC, check_date ASC
    """,
            countQuery = """
    SELECT COUNT(*) FROM (
        SELECT 1 FROM health_check_campaign
        UNION ALL
        SELECT 1 FROM vaccination_campaign
    ) AS total
    """,
            nativeQuery = true
    )
    Page<StudentHealthEventProjection> findAllHealthEventsByStudent(
            @Param("studentId") Long studentId,
            Pageable pageable);
}