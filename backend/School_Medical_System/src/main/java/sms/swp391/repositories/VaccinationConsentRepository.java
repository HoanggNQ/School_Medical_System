package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.entities.VaccinationConsentEntity;
import sms.swp391.models.entities.StudentEntity;

import java.util.List;

public interface VaccinationConsentRepository extends JpaRepository<VaccinationConsentEntity, Long> {

    // Find consent by campaign ID and student
    VaccinationConsentEntity findByVaccinationCampaignIdAndStudent
    (Long campaignId, StudentEntity student);

    // Find all consents for a specific campaign
    List<VaccinationConsentEntity> findByVaccinationCampaignId(Long campaignId);

    // Find pending consents for a specific parent
    List<VaccinationConsentEntity> findByParent_UserIdAndConsentStatus
    (Long parentId, MedicalStatus status);
}
