package sms.swp391.repositories;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.StudentEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity,Long> {

    Optional<StudentEntity> findById(Long id);

    List<StudentEntity> findByClassEntity_Grade(Integer classEntityGrade);

    Optional<StudentEntity> findByStudentCode(String studentCode);

    boolean existsByStudentCode(String sc);

    @Query("SELECT s.user.fullname FROM StudentEntity s WHERE s.parent.userId = :parentID")
    List<String> findFullNameByParent(@Param("parentID") Long parentID);
}
