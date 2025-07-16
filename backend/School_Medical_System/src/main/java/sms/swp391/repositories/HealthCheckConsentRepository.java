package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO;
import sms.swp391.models.entities.HealthCheckConsentEntity;
import sms.swp391.models.entities.StudentEntity;

import java.util.List;

public interface HealthCheckConsentRepository extends JpaRepository<HealthCheckConsentEntity, Long> {
    @Query("""
                SELECT c FROM HealthCheckConsentEntity c
                WHERE c.healthCheckCampaign.id = :campaignId
                  AND c.consentStatus = 'APPROVED'
                  AND c.healthCheckCampaign.status = 'APPROVED'
            """)
    List<HealthCheckConsentEntity> findEligibleStudents(Long campaignId);

    // Find consent by campaign ID and student
    HealthCheckConsentEntity findByHealthCheckCampaignIdAndStudent
    (Long campaignId, StudentEntity student);

    // Find all consents for a specific campaign
    List<HealthCheckConsentEntity> findByHealthCheckCampaignId(Long campaignId);

    // Find pending consents for a specific parent
    List<HealthCheckConsentEntity> findByParent_UserIdAndConsentStatus
    (Long parentId, MedicalStatus status);

    @Query("SELECT hc FROM HealthCheckConsentEntity hc " +
            "WHERE (LOWER(hc.student.user.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(hc.healthCheckCampaign.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) ")
    Page<HealthCheckConsentEntity> searchHealthCheckConsents(@Param("keyword") String keyword, Pageable pageable);


    @Query("SELECT vc FROM HealthCheckConsentEntity vc " +
            "WHERE vc.healthCheckCampaign.id = :campaignId " +
            "AND vc.consentStatus = 'APPROVED'")
    Page<HealthCheckConsentEntity> findApprovedConsentsByCampaignId(@Param("campaignId") Long campaignId, Pageable pageable);

    List<HealthCheckConsentEntity> findByHealthCheckCampaign_IdAndConsentStatus(Long healthCheckCampaignId, MedicalStatus consentStatus);

    Long countByHealthCheckCampaign_Id(Long healthCheckCampaignId);

    Long countByHealthCheckCampaign_IdAndConsentStatus(Long healthCheckCampaignId, MedicalStatus consentStatus);

    // HealthCheckConsentRepository
    @Query("""
                SELECT new sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO(
                    COUNT(h),
                    SUM(CASE WHEN h.consentStatus = sms.swp391.models.dtos.enums.MedicalStatus.APPROVED THEN 1 ELSE 0 END),
                    SUM(CASE WHEN h.consentStatus = sms.swp391.models.dtos.enums.MedicalStatus.REJECTED THEN 1 ELSE 0 END),
                    SUM(CASE WHEN h.consentStatus = sms.swp391.models.dtos.enums.MedicalStatus.PENDING  THEN 1 ELSE 0 END),
                    SUM(CASE WHEN h.consentStatus = sms.swp391.models.dtos.enums.MedicalStatus.DONE     THEN 1 ELSE 0 END)
                )
                FROM HealthCheckConsentEntity h
            """)
    CampaignConsentStatisticsResponseDTO fetchOverallHealthConsentStats();

    Page<HealthCheckConsentEntity> findByHealthCheckCampaign_Id(Long campaignId, Pageable pageable);

    @Query("""
                SELECT c
                FROM   HealthCheckConsentEntity c
                WHERE  c.healthCheckCampaign.id = :campaignId
                  AND ( LOWER(c.student.user.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) )
            """)
    Page<HealthCheckConsentEntity> searchInCampaign(@Param("campaignId") Long campaignId,
                                                    @Param("keyword") String keyword,
                                                    Pageable pageable);

    List<HealthCheckConsentEntity> findAllByHealthCheckCampaignId(Long healthCheckCampaignId);

    List<HealthCheckConsentEntity> findByStudentIdAndConsentStatus(Long studentId, MedicalStatus consentStatus);
}