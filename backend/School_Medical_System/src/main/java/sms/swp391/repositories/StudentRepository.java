package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sms.swp391.models.entities.StudentEntity;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    List<StudentEntity> findAllByStatusTrue();
    Optional<StudentEntity> findByIdAndStatusTrue(Long id);
    List<StudentEntity> findByClassEntity_Grade(Integer grade);
    @Query("SELECT s FROM StudentEntity s WHERE s.status = 'ACTIVE' AND s.user.status = 'ACTIVE' AND s.user.roleName = 'STUDENT'")
    List<StudentEntity> findAllActiveStudents();
}