package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.entities.VaccinationCampaignEntity;

import java.util.List;

@Repository
public interface VaccinationCampaignRepository extends JpaRepository<VaccinationCampaignEntity, Long> {
    @Query("SELECT h FROM VaccinationCampaignEntity h WHERE h.status = 'ACTIVE'")
    List<VaccinationCampaignEntity> getAllByVaccinationCampaign();
    @Query("""
    SELECT
        'VACCINATION'                          AS type,
        cam.id                                 AS campaignId,
        cam.name                               AS campaignName,
        con.id                                 AS consentId,
        cam.startDate                          AS startDate,
        cam.endDate                            AS endDate,
        con.consentStatus                      AS consentStatus,
        stu.user.fullname                      AS studentName,
        cam.location                           AS location,
        CASE
            WHEN rec.id IS NOT NULL THEN 'COMPLETED'
            WHEN con.consentStatus = 'APPROVED' THEN 'APPROVED'
            WHEN con.consentStatus = 'REJECTED' THEN 'REJECTED'
            WHEN con.consentStatus = 'PENDING' AND cam.endDate < CURRENT_DATE THEN 'REJECTED'
            WHEN con.consentStatus = 'PENDING' THEN 'PENDING'
            ELSE 'UNKNOWN'
        END AS resultStatus
    FROM VaccinationCampaignEntity cam
    LEFT JOIN cam.vaccinationConsents con
           ON con.student.id = :studentId
    LEFT JOIN cam.vaccinationRecords rec
           ON rec.student.id = :studentId
    JOIN StudentEntity stu
           ON stu.id = :studentId
    WHERE LOWER(cam.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    Page<StudentHealthEventProjection> findEvents(
            @Param("studentId") Long studentId,
            @Param("keyword")   String keyword,
            Pageable pageable);

    @Query("SELECT v.status, COUNT(v) FROM VaccinationCampaignEntity v GROUP BY v.status")
    List<Object[]> countCampaignsByStatus();
}
