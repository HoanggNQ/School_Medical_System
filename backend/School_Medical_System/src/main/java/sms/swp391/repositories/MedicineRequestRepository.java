package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.MedicineRequestEntity;
import sms.swp391.models.entities.StudentEntity;

import java.util.List;

@Repository
public interface MedicineRequestRepository extends JpaRepository<MedicineRequestEntity, Long> {
    List<MedicineRequestEntity> findByStudent(StudentEntity student);
    List<MedicineRequestEntity> findByStudentOrderByCreatedAtDesc(StudentEntity student);
} 