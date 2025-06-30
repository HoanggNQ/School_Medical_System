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

    @Query("SELECT s FROM StudentEntity s " +
            "JOIN FETCH s.parent p " +
            "JOIN FETCH s.user u " +
            "WHERE s.classEntity.grade = :grade")
    List<StudentEntity> findByClassEntity_GradeWithUserAndParent(Integer grade);


    Optional<StudentEntity> findByStudentCode(String studentCode);
    Optional<StudentEntity> findByUser_Email(String email);

    boolean existsByStudentCode(String sc);

    List<StudentEntity> findByParent_UserId(Long parentId);

    @Query("SELECT COUNT(s) FROM StudentEntity s WHERE s.classEntity.id = :classId AND s.user.status = 'ACTIVE'")
    int countActiveStudentsByClassId(@Param("classId") Long classId);

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

    @Query("SELECT s FROM StudentEntity s WHERE s.user.status = 'ACTIVE'")
    Page<StudentEntity> findAllActive(Pageable pageable);
}
