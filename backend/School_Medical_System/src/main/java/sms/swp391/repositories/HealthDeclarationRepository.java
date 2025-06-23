package sms.swp391.repositories;

import sms.swp391.models.entities.HealthDeclarationEntity;
import sms.swp391.models.dtos.enums.MedicalStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthDeclarationRepository extends JpaRepository<HealthDeclarationEntity, Long>, JpaSpecificationExecutor<HealthDeclarationEntity> {

    // Check if declaration exists by student ID and academic year
    boolean existsByStudentIdAndAcademicYear(Long studentId, String academicYear);

    // Search with multiple filters
    @Query("SELECT h FROM HealthDeclarationEntity h " +
            "WHERE (:status IS NULL OR h.status = :status) " +
            "AND (:studentId IS NULL OR h.student.id = :studentId) " +
            "AND (:declaredById IS NULL OR h.declaredBy.userId = :declaredById) " +
            "AND (:academicYear IS NULL OR h.academicYear = :academicYear)" +
            "AND h.status = 'PENDING' OR h.status = 'APPROVED'")
    Page<HealthDeclarationEntity> searchByFilters(
            @Param("status") MedicalStatus status,
            @Param("studentId") Long studentId,
            @Param("declaredById") Long declaredById,
            @Param("academicYear") String academicYear,
            Pageable pageable
    );

    // Find by ID with all details eagerly fetched
    @Query("SELECT h FROM HealthDeclarationEntity h " +
            "JOIN FETCH h.student s " +
            "JOIN FETCH s.user " +
            "JOIN FETCH h.declaredBy " +
            "WHERE h.id = :id")
    Optional<HealthDeclarationEntity> findByIdWithDetails(@Param("id") Long id);

    // Find by student ID with details
    @Query("SELECT h FROM HealthDeclarationEntity h " +
            "JOIN FETCH h.student s " +
            "JOIN FETCH s.user " +
            "JOIN FETCH h.declaredBy " +
            "WHERE s.id = :studentId AND h.status = 'PENDING' OR h.status = 'APPROVED' " +
            "ORDER BY h.declarationDate DESC")
    List<HealthDeclarationEntity> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    // Find by declared by user ID with details
    @Query("SELECT h FROM HealthDeclarationEntity h " +
            "JOIN FETCH h.student s " +
            "JOIN FETCH s.user " +
            "JOIN FETCH h.declaredBy " +
            "WHERE h.declaredBy.userId = :declaredById AND h.status = 'PENDING' OR h.status = 'APPROVED' " +
            "ORDER BY h.declarationDate DESC")
    List<HealthDeclarationEntity> findByDeclaredByUserIdWithDetails(@Param("declaredById") Long declaredById);
}