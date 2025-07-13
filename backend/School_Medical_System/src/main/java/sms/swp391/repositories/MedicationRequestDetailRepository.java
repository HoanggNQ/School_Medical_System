package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.entities.MedicationRequestDetailEntity;
import sms.swp391.models.entities.MedicationRequestEntity;

import java.util.List;


@Repository
public interface MedicationRequestDetailRepository extends JpaRepository<MedicationRequestDetailEntity, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM MedicationRequestDetailEntity d WHERE d.request = :request")
    void deleteAllByRequest(@Param("request") MedicationRequestEntity request);

    List<MedicationRequestDetailEntity> findByRequest(MedicationRequestEntity request);
}