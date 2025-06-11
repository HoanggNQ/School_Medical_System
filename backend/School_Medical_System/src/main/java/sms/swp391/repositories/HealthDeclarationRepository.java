package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sms.swp391.models.dtos.enums.HealthDeclarationStatus;
import sms.swp391.models.entities.HealthDeclarationEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthDeclarationRepository extends JpaRepository<HealthDeclarationEntity, Long>, JpaSpecificationExecutor<HealthDeclarationEntity> {

    @Query("SELECT h FROM HealthDeclarationEntity h " +
            "WHERE (:studentId IS NULL OR h.student.user.userId = :studentId) " )
    List<HealthDeclarationEntity> findByStudent( @Param("studentId") Long studentId);

    List<HealthDeclarationEntity> findByDeclaredBy(Long declaredBy);
    Page<HealthDeclarationEntity> findByStatus(HealthDeclarationStatus status, Pageable pageable);
    Page<HealthDeclarationEntity> findAll(Pageable pageable);
    boolean existsByStudentIdAndAcademicYear(Long studentId, String academicYear);

    @Query("SELECT h FROM HealthDeclarationEntity h " +
            "WHERE (:status IS NULL OR h.status = :status) " +
            "AND (:studentId IS NULL OR h.student.user.userId = :studentId) " +
            "AND (:declaredById IS NULL OR h.declaredBy.userId = :declaredById) " +
            "AND (:academicYear IS NULL OR h.academicYear = :academicYear)")
    Page<HealthDeclarationEntity> searchByFilters(
            @Param("status") HealthDeclarationStatus status,
            @Param("studentId") Long studentId,
            @Param("declaredById") Long declaredById,
            @Param("academicYear") String academicYear,
            Pageable pageable
    );

    @Query("SELECT d FROM HealthDeclarationEntity d " +
            "JOIN FETCH d.student s " +
            "JOIN FETCH s.user " +
            "JOIN FETCH d.declaredBy " +
            "WHERE d.id = :id")
    Optional<HealthDeclarationEntity> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT d FROM HealthDeclarationEntity d " +
            "JOIN FETCH d.student s " +
            "JOIN FETCH s.user " +
            "JOIN FETCH d.declaredBy " +
            "WHERE s.id = :studentId " +
            "ORDER BY d.declarationDate DESC")
    List<HealthDeclarationEntity> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    @Query("SELECT d FROM HealthDeclarationEntity d " +
            "JOIN FETCH d.student s " +
            "JOIN FETCH s.user " +
            "JOIN FETCH d.declaredBy " +
            "WHERE d.declaredBy.userId = :declaredById " +
            "ORDER BY d.declarationDate DESC")
    List<HealthDeclarationEntity> findByDeclaredByUserIdWithDetails(@Param("declaredById") Long declaredById);
}
