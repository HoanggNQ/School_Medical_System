package sms.swp391.repositories;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.VaccinationConsentEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaccinationConsentRepository extends JpaRepository<VaccinationConsentEntity, Long> {
    List<VaccinationConsentEntity> findByVaccinationCampaignIdAndConsentStatus(Long campaignId, String consentStatus);

    Optional<VaccinationConsentEntity> findByVaccinationCampaignIdAndStudentId(Long campaignId, Long studentId);

    @Query("SELECT h FROM VaccinationConsentEntity h WHERE h.parent.userId = :parentId AND h.consentStatus = :status AND h.parent.roleName = 'PARENT'")
    Optional<VaccinationConsentEntity> findByParentAndStatus(@Param("parentId") Long parentId, @Param("status") String status);
}
