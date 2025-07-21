package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sms.swp391.models.entities.MedicalEventMedicationEntity;

public interface MedicalEventMedicationRepository extends JpaRepository<MedicalEventMedicationEntity, Long> {
}
