package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.entities.MedicationRequestEntity;
import sms.swp391.models.entities.UserEntity;

import java.util.List;

@Repository
public interface MedicationRequestRepository extends JpaRepository<MedicationRequestEntity, Long> {
    List<MedicationRequestEntity> findByStatus(MedicalStatus status);

    List<MedicationRequestEntity> findByRequestedBy(UserEntity requestedBy);
}