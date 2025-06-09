package sms.swp391.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.HealthDeclarationEntity;
import sms.swp391.models.entities.HealthDeclarationDetailEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthDeclarationRepository extends JpaRepository<HealthDeclarationEntity, Long> {

    // Find declarations by status
    List<HealthDeclarationEntity> findByStatusOrderByDeclarationDateDesc(String status);

    // Find declarations by student and status
    List<HealthDeclarationEntity> findByStudentIdAndStatusOrderByDeclarationDateDesc(Long studentId, String status);

    // Check if declaration exists for student and academic year
    boolean existsByStudentIdAndAcademicYear(Long studentId, String academicYear);

    // Find declaration with details
    @Query("SELECT d FROM HealthDeclarationEntity d " +
            "LEFT JOIN FETCH d.healthDeclarationDetails " +
            "LEFT JOIN FETCH d.student s " +
            "LEFT JOIN FETCH s.user  " +
            "LEFT JOIN FETCH d.declaredBy " +
            "LEFT JOIN FETCH d.reviewedBy " +
            "WHERE d.id = :id")
    Optional<HealthDeclarationEntity> findByIdWithDetails(@Param("id") Long id);

    // Find declarations by student with details
    @Query("SELECT d FROM HealthDeclarationEntity d " +
            "LEFT JOIN FETCH d.healthDeclarationDetails " +
            "LEFT JOIN FETCH d.student s " +
            "LEFT JOIN FETCH s.user  " +
            "LEFT JOIN FETCH d.declaredBy " +
            "LEFT JOIN FETCH d.reviewedBy " +
            "WHERE d.student.id = :studentId " +
            "ORDER BY d.declarationDate DESC")
    List<HealthDeclarationEntity> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    // Find declarations by declared user with details
    @Query("SELECT d FROM HealthDeclarationEntity d " +
            "LEFT JOIN FETCH d.healthDeclarationDetails " +
            "LEFT JOIN FETCH d.student s " +
            "LEFT JOIN FETCH s.user  " +
            "LEFT JOIN FETCH d.declaredBy " +
            "LEFT JOIN FETCH d.reviewedBy " +
            "WHERE d.declaredBy.userId = :declaredById " +
            "ORDER BY d.declarationDate DESC")
    List<HealthDeclarationEntity> findByDeclaredByUserIdWithDetails(@Param("declaredById") Long declaredById);
}

