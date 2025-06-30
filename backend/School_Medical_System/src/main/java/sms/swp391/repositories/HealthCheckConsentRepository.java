package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.entities.HealthCheckConsentEntity;
import sms.swp391.models.entities.StudentEntity;

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
}