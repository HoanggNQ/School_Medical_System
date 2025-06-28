package sms.swp391.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthDeclarationCreateDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.responses.HealthDeclarationResponseDTO;
import sms.swp391.models.dtos.responses.StudentHealthProfileResponseDTO;

import java.util.List;
import java.util.Optional;

public interface HealthDeclarationService {

    Page<HealthDeclarationResponseDTO> searchByFilters(
            MedicalStatus status,
            Long studentId,
            Long declaredById,
            String academicYear,
            Pageable pageable
    );

    Optional<HealthDeclarationResponseDTO> getByIdWithDetails(Long id);

    List<HealthDeclarationResponseDTO> getByStudentIdWithDetails(Long studentId);

    List<HealthDeclarationResponseDTO> getByDeclaredByUserIdWithDetails(Long declaredById);

    @Transactional(readOnly = true)
    StudentHealthProfileResponseDTO getStudentHealthProfile(Long studentId);

    HealthDeclarationResponseDTO create(HealthDeclarationCreateDTO createDTO);

    HealthDeclarationResponseDTO update(Long id, HealthDeclarationUpdateDTO updateDTO);

    HealthDeclarationResponseDTO updateStatus(Long id, MedicalStatus status);

    void delete(Long id);
}