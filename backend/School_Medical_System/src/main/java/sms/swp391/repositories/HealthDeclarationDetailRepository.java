package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.HealthDeclarationDetailEntity;

import java.util.List;

@Repository
public interface HealthDeclarationDetailRepository extends JpaRepository<HealthDeclarationDetailEntity, Long> {

    // Find all details by declaration
    List<HealthDeclarationDetailEntity> findByDeclarationIdOrderByCreatedAtAsc(Long declarationId);

    // Find details by category
    List<HealthDeclarationDetailEntity> findByDeclarationIdAndCategory(Long declarationId, String category);

    // Delete all details by declaration
    void deleteByDeclarationId(Long declarationId);

    // Find details by severity
    List<HealthDeclarationDetailEntity> findByDeclarationIdAndSeverity(Long declarationId, String severity);

    // Count details by declaration
    long countByDeclarationId(Long declarationId);
}