package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO;
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

    @Query("SELECT vc FROM VaccinationConsentEntity vc " +
           "WHERE vc.vaccinationCampaign.id = :campaignId " +
           "AND vc.consentStatus = 'APPROVED'")
    Page<VaccinationConsentEntity> findApprovedConsentsByCampaignId(@Param("campaignId") Long campaignId, Pageable pageable);

    Long countByVaccinationCampaign_Id(Long vaccinationCampaignId);

    Long countByVaccinationCampaign_IdAndConsentStatus(Long vaccinationCampaignId, MedicalStatus consentStatus);

    // VaccinationConsentRepository
    @Query("""
    SELECT new sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO(
        COUNT(v),
        SUM(CASE WHEN v.consentStatus = sms.swp391.models.dtos.enums.MedicalStatus.APPROVED THEN 1 ELSE 0 END),
        SUM(CASE WHEN v.consentStatus = sms.swp391.models.dtos.enums.MedicalStatus.REJECTED THEN 1 ELSE 0 END),
        SUM(CASE WHEN v.consentStatus = sms.swp391.models.dtos.enums.MedicalStatus.PENDING  THEN 1 ELSE 0 END),
        SUM(CASE WHEN v.consentStatus = sms.swp391.models.dtos.enums.MedicalStatus.DONE     THEN 1 ELSE 0 END)
    )
    FROM VaccinationConsentEntity v
""")
    CampaignConsentStatisticsResponseDTO fetchOverallVaccinationConsentStats();


    List<VaccinationConsentEntity> findByVaccinationCampaign_IdAndConsentStatus(Long campaignId,MedicalStatus consentStatus);
}
