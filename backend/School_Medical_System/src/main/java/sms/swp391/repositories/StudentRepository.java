package sms.swp391.repositories;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.StudentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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


    @Query("SELECT s FROM StudentEntity s WHERE " +
           "LOWER(s.user.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "AND s.user.status = 'ACTIVE'")
    Page<StudentEntity> searchStudents(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT s FROM StudentEntity s WHERE " +
           "LOWER(s.user.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "AND s.user.status = 'ACTIVE' " +
           "ORDER BY " +
           "CASE WHEN :direction = 'asc' THEN s.user.fullname END ASC, " +
           "CASE WHEN :direction = 'desc' THEN s.user.fullname END DESC")
    Page<StudentEntity> searchStudentsSorted(@Param("keyword") String keyword, @Param("direction") String direction, Pageable pageable);
}
