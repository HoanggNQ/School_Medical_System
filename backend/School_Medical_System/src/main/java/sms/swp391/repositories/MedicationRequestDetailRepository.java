package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.MedicationRequestDetailEntity;

import java.util.List;

@Repository
public interface MedicationRequestDetailRepository extends JpaRepository<MedicationRequestDetailEntity, Long> {
}