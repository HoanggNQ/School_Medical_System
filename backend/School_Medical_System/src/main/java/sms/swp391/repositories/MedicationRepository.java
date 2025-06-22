package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.MedicationEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicationRepository extends JpaRepository<MedicationEntity, Long> {
    @Query("SELECT h FROM MedicationEntity h WHERE h.quantity > 0")
    Page<MedicationEntity> getMedicationEntitiesByQuantity(Pageable pageable);
}