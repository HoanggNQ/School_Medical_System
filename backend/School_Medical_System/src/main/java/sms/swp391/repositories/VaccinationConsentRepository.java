package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.entities.ContentEntity;
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

    @Query("SELECT vc FROM VaccinationConsentEntity vc " +
            "WHERE (LOWER(vc.student.user.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(vc.vaccinationCampaign.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND vc.consentStatus = 'APPROVED'")
    Page<VaccinationConsentEntity> searchVaccinationConsents(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT v FROM VaccinationConsentEntity v WHERE v.consentStatus = 'APPROVED'")
    Page<VaccinationConsentEntity> findApprovedStudent(Pageable pageable);
}
