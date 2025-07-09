package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sms.swp391.models.entities.MedicalEventEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sms.swp391.models.entities.StudentEntity;

import java.util.Collection;

public interface MedicalEventRepository extends JpaRepository<MedicalEventEntity, Long> {
    @Query("SELECT m FROM MedicalEventEntity m WHERE LOWER(m.eventType) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<MedicalEventEntity> searchMedicalEvents(@Param("keyword") String keyword, Pageable pageable);

    Page<MedicalEventEntity> findAllByStudent(StudentEntity student,
                                              Pageable pageable);

    Page<MedicalEventEntity> findAllByStudentIn(Collection<StudentEntity> students,
                                                Pageable pageable);
}