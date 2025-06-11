package sms.swp391.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.enums.HealthDeclarationStatus;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;

import java.util.List;
import java.util.Optional;

public interface HealthDeclarationService {

    List<HealthDeclarationResponseDTO> getByStudentId(Long studentId);

    List<HealthDeclarationResponseDTO> getByDeclaredById(Long userId);

    Page<HealthDeclarationResponseDTO> getByStatus(HealthDeclarationStatus status, Pageable pageable);

    Page<HealthDeclarationResponseDTO> getAll(Pageable pageable);

    boolean existsByStudentIdAndAcademicYear(Long studentId, String academicYear);

    Page<HealthDeclarationResponseDTO> searchByFilters(
            HealthDeclarationStatus status,
            Long studentId,
            Long declaredById,
            String academicYear,
            Pageable pageable
    );

    Optional<HealthDeclarationResponseDTO> getByIdWithDetails(Long id);

    List<HealthDeclarationResponseDTO> getByStudentIdWithDetails(Long studentId);

    List<HealthDeclarationResponseDTO> getByDeclaredByUserIdWithDetails(Long declaredById);

    HealthDeclarationResponseDTO save(HealthDeclarationResponseDTO ResponseDTO);

    void delete(Long id);
}
