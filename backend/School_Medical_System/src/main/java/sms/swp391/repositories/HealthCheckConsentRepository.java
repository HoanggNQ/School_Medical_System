package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.entities.HealthCheckConsentEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.VaccinationConsentEntity;

import java.util.List;

public interface HealthCheckConsentRepository extends JpaRepository<HealthCheckConsentEntity, Long> {

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
            "OR LOWER(hc.healthCheckCampaign.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND hc.consentStatus = 'APPROVED'")
    Page<HealthCheckConsentEntity> searchHealthCheckConsents(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT v FROM HealthCheckConsentEntity v WHERE v.consentStatus = 'APPROVED'")
    Page<HealthCheckConsentEntity> findApprovedStudent(Pageable pageable);

    @Query("SELECT vc FROM HealthCheckConsentEntity vc " +
            "WHERE vc.healthCheckCampaign.id = :campaignId " +
            "AND vc.consentStatus = 'APPROVED'")
    Page<HealthCheckConsentEntity> findApprovedConsentsByCampaignId(@Param("campaignId") Long campaignId, Pageable pageable);
}