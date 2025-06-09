package sms.swp391.services.impl;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.requests.HealthDeclarationRequestDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationReviewDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;
import sms.swp391.models.entities.HealthDeclarationDetailEntity;
import sms.swp391.models.entities.HealthDeclarationEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.HealthDeclarationDetailRepository;
import sms.swp391.repositories.HealthDeclarationRepository;
import sms.swp391.repositories.StudentRepository;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.HealthDeclarationService;
import sms.swp391.utils.HealthDeclarationMapper;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HealthDeclarationServiceImpl implements HealthDeclarationService {

    private final HealthDeclarationRepository healthDeclarationRepository;
    private final HealthDeclarationDetailRepository healthDeclarationDetailRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    public HealthDeclarationResponseDTO createHealthDeclaration(Long parentId, HealthDeclarationRequestDTO request) {
        log.info("Creating health declaration for student {} by parent {}", request.getStudentId(), parentId);

        // Validate parent exists
        UserEntity parent = userRepository.findById(parentId)
                .orElseThrow(() -> new NotFoundException("Parent not found with id: " + parentId));

        // Validate student exists
        StudentEntity student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + request.getStudentId()));

        // Check if parent has permission to declare for this student
        validateParentStudentRelationship(parentId, request.getStudentId());

        // Check if declaration already exists for this academic year
        if (healthDeclarationRepository.existsByStudentIdAndAcademicYear(request.getStudentId(), request.getAcademicYear())) {
            throw new ActionFailedException("Health declaration already exists for student " + request.getStudentId() + " in academic year " + request.getAcademicYear());
        }

        // Create health declaration
        HealthDeclarationEntity declaration = HealthDeclarationMapper.fromRequestDTO(request, student, parent);
        declaration = healthDeclarationRepository.save(declaration);

        // Create health declaration details
        List<HealthDeclarationDetailEntity> details = HealthDeclarationMapper.fromDetailRequestDTOList(request.getDetails(), declaration);
        healthDeclarationDetailRepository.saveAll(details);

        // Reload declaration with details
        declaration = healthDeclarationRepository.findByIdWithDetails(declaration.getId())
                .orElseThrow(() -> new NotFoundException("Declaration not found after creation"));

        log.info("Successfully created health declaration with id: {}", declaration.getId());
        return HealthDeclarationMapper.toDTO(declaration);
    }

    @Override
    public HealthDeclarationResponseDTO updateHealthDeclaration(Long parentId, Long declarationId, HealthDeclarationUpdateDTO request) {
        log.info("Updating health declaration {} by parent {}", declarationId, parentId);

        // Find declaration
        HealthDeclarationEntity declaration = healthDeclarationRepository.findByIdWithDetails(declarationId)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + declarationId));

        // Validate parent permission
        if (!declaration.getDeclaredBy().getUserId().equals(parentId)) {
            throw new ActionFailedException("You don't have permission to update this declaration");
        }

        // Check if declaration can be updated (only PENDING or REJECTED can be updated)
        if (!"PENDING".equals(declaration.getStatus()) && !"REJECTED".equals(declaration.getStatus())) {
            throw new ActionFailedException("Cannot update declaration with status: " + declaration.getStatus());
        }

        // Update declaration
        HealthDeclarationMapper.updateEntityFromDTO(declaration, request);
        declaration.setStatus("PENDING"); // Reset status to PENDING after update
        declaration.setReviewedBy(null);
        declaration.setReviewedDate(null);

        // Delete old details and create new ones
        healthDeclarationDetailRepository.deleteByDeclarationId(declarationId);
        List<HealthDeclarationDetailEntity> newDetails = HealthDeclarationMapper.fromDetailRequestDTOList(request.getDetails(), declaration);
        healthDeclarationDetailRepository.saveAll(newDetails);

        // Save declaration
        declaration = healthDeclarationRepository.save(declaration);

        // Reload with details
        declaration = healthDeclarationRepository.findByIdWithDetails(declaration.getId())
                .orElseThrow(() -> new NotFoundException("Declaration not found after update"));

        log.info("Successfully updated health declaration with id: {}", declaration.getId());
        return HealthDeclarationMapper.toDTO(declaration);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getHealthDeclarationsByStudent(Long studentId) {
        log.info("Getting health declarations for student: {}", studentId);

        List<HealthDeclarationEntity> declarations = healthDeclarationRepository.findByStudentIdWithDetails(studentId);
        return declarations.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getHealthDeclarationsByParent(Long parentId) {
        log.info("Getting health declarations for parent: {}", parentId);

        List<HealthDeclarationEntity> declarations = healthDeclarationRepository.findByDeclaredByUserIdWithDetails(parentId);
        return declarations.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public HealthDeclarationResponseDTO getHealthDeclarationById(Long declarationId) {
        log.info("Getting health declaration by id: {}", declarationId);

        HealthDeclarationEntity declaration = healthDeclarationRepository.findByIdWithDetails(declarationId)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + declarationId));

        return HealthDeclarationMapper.toDTO(declaration);
    }

    @Override
    public void deleteHealthDeclaration(Long parentId, Long declarationId) {
        log.info("Deleting health declaration {} by parent {}", declarationId, parentId);

        HealthDeclarationEntity declaration = healthDeclarationRepository.findById(declarationId)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + declarationId));

        // Validate parent permission
        if (!declaration.getDeclaredBy().getUserId().equals(parentId)) {
            throw new ActionFailedException("You don't have permission to delete this declaration");
        }

        // Check if declaration can be deleted (only PENDING or REJECTED can be deleted)
        if (!"PENDING".equals(declaration.getStatus()) && !"REJECTED".equals(declaration.getStatus())) {
            throw new ActionFailedException("Cannot delete declaration with status: " + declaration.getStatus());
        }

        healthDeclarationRepository.delete(declaration);
        log.info("Successfully deleted health declaration with id: {}", declarationId);
    }

    @Override
    public HealthDeclarationResponseDTO reviewHealthDeclaration(Long reviewerId, Long declarationId, HealthDeclarationReviewDTO reviewDto) {
        log.info("Reviewing health declaration {} by reviewer {}", declarationId, reviewerId);

        // Validate reviewer exists
        UserEntity reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new NotFoundException("Reviewer not found with id: " + reviewerId));

        // Find declaration
        HealthDeclarationEntity declaration = healthDeclarationRepository.findByIdWithDetails(declarationId)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + declarationId));

        // Update review information
        declaration.setStatus(reviewDto.getStatus());
        declaration.setReviewedBy(reviewer);
        declaration.setReviewedDate(Instant.now());

        declaration = healthDeclarationRepository.save(declaration);

        log.info("Successfully reviewed health declaration with id: {} with status: {}", declaration.getId(), reviewDto.getStatus());
        return HealthDeclarationMapper.toDTO(declaration);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getHealthDeclarationsByStatus(String status) {
        log.info("Getting health declarations by status: {}", status);

        List<HealthDeclarationEntity> declarations = healthDeclarationRepository.findByStatusOrderByDeclarationDateDesc(status);
        return declarations.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HealthDeclarationResponseDTO> getListHealthDeclarations() {
        List<HealthDeclarationEntity> declarations = healthDeclarationRepository.findAll();
        var responses = declarations.stream().map(HealthDeclarationMapper::toDTO).collect(Collectors.toList());
        return responses;
    }

    private void validateParentStudentRelationship(Long parentId, Long studentId) {
        // Implement logic to check if parent has permission to declare for this student
        // This might involve checking a parent-student relationship table
        // For now, we'll assume the relationship is valid
        // TODO: Implement proper parent-student relationship validation
        log.debug("Validating parent {} relationship with student {}", parentId, studentId);
    }
}
