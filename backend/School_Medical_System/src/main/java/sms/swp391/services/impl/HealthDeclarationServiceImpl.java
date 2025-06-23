package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthDeclarationCreateDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;
import sms.swp391.models.entities.HealthDeclarationEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.HealthDeclarationRepository;
import sms.swp391.repositories.StudentRepository;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.HealthDeclarationService;
import sms.swp391.utils.HealthDeclarationMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthDeclarationServiceImpl implements HealthDeclarationService {

    private final HealthDeclarationRepository healthDeclarationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<HealthDeclarationResponseDTO> searchByFilters(
            MedicalStatus status,
            Long studentId,
            Long declaredById,
            String academicYear,
            Pageable pageable) {

        if (pageable == null) {
            throw new IllegalArgumentException("Pageable cannot be null");
        }

        Page<HealthDeclarationEntity> entities = healthDeclarationRepository.searchByFilters(
                status, studentId, declaredById, academicYear, pageable);
        return entities.map(HealthDeclarationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HealthDeclarationResponseDTO> getByIdWithDetails(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }

        Optional<HealthDeclarationEntity> entity = healthDeclarationRepository.findByIdWithDetails(id);

        if (entity.isEmpty()) {
            throw new NotFoundException("Health Declaration Not Found with id: " + id);
        }

        return entity.map(HealthDeclarationMapper::toDTO);
    }


    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getByStudentIdWithDetails(Long studentId) {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }

        List<HealthDeclarationEntity> entities = healthDeclarationRepository.findByStudentIdWithDetails(studentId);
        if (entities.isEmpty()) {throw new NotFoundException("Health Declaration Not Found with id: " + studentId);}
        return entities.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getByDeclaredByUserIdWithDetails(Long declaredById) {
        if (declaredById == null) {
            throw new IllegalArgumentException("Declared by user ID cannot be null");
        }

        List<HealthDeclarationEntity> entities = healthDeclarationRepository.findByDeclaredByUserIdWithDetails(declaredById);
        if (entities.isEmpty()) {throw new NotFoundException("Health Declaration Not Found with id: " + declaredById);}
        return entities.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public HealthDeclarationResponseDTO create(HealthDeclarationCreateDTO createDTO) {
        if (createDTO == null) {
            throw new IllegalArgumentException("Create DTO cannot be null");
        }

        // Validate required fields
        if (createDTO.getStudentId() == null) {
            throw new IllegalArgumentException("Student ID is required");
        }
        if (createDTO.getDeclaredById() == null) {
            throw new IllegalArgumentException("Declared by user ID is required");
        }
        if (createDTO.getAcademicYear() == null || createDTO.getAcademicYear().trim().isEmpty()) {
            throw new IllegalArgumentException("Academic year is required");
        }

        // Validate student exists
        StudentEntity student = studentRepository.findById(createDTO.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + createDTO.getStudentId()));

        // Validate declaring user exists
        UserEntity declaredBy = userRepository.findById(createDTO.getDeclaredById())
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createDTO.getDeclaredById()));

        // Check if declaration already exists for this student and academic year
        if (healthDeclarationRepository.existsByStudentIdAndAcademicYear(
                createDTO.getStudentId(), createDTO.getAcademicYear())) {
            throw new IllegalArgumentException(
                    "Health declaration already exists for student " + createDTO.getStudentId() +
                            " in academic year " + createDTO.getAcademicYear());
        }

        // Create new entity
        HealthDeclarationEntity entity = HealthDeclarationMapper.fromCreateDTO(createDTO, student, declaredBy);
        HealthDeclarationEntity saved = healthDeclarationRepository.save(entity);

        return HealthDeclarationMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public HealthDeclarationResponseDTO update(Long id, HealthDeclarationUpdateDTO updateDTO) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (updateDTO == null) {
            throw new IllegalArgumentException("Update DTO cannot be null");
        }

        HealthDeclarationEntity entity = healthDeclarationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));

        HealthDeclarationMapper.updateEntityFromUpdateDTO(entity, updateDTO);
        HealthDeclarationEntity updated = healthDeclarationRepository.save(entity);

        return HealthDeclarationMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public HealthDeclarationResponseDTO updateStatus(Long id, MedicalStatus status) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        HealthDeclarationEntity entity = healthDeclarationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));

        entity.setStatus(status);
        HealthDeclarationEntity updated = healthDeclarationRepository.save(entity);

        return HealthDeclarationMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }

        HealthDeclarationEntity entity = healthDeclarationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));
        entity.setStatus(MedicalStatus.REJECTED);
        healthDeclarationRepository.save(entity);
    }
}