package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.HealthDeclarationStatus;
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
    public List<HealthDeclarationResponseDTO> getByStudentId(Long studentId) {
        List<HealthDeclarationEntity> entities = healthDeclarationRepository.findByStudent(studentId);
        return entities.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getByDeclaredById(Long userId) {
        List<HealthDeclarationEntity> entities = healthDeclarationRepository.findByDeclaredById(userId);
        return entities.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HealthDeclarationResponseDTO> getByStatus(HealthDeclarationStatus status, Pageable pageable) {
        Page<HealthDeclarationEntity> entities = healthDeclarationRepository.findByStatus(status, pageable);
        return entities.map(HealthDeclarationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HealthDeclarationResponseDTO> getAll(Pageable pageable) {
        Page<HealthDeclarationEntity> entities = healthDeclarationRepository.findAll(pageable);
        return entities.map(HealthDeclarationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByStudentIdAndAcademicYear(Long studentId, String academicYear) {
        return healthDeclarationRepository.existsByStudentIdAndAcademicYear(studentId, academicYear);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HealthDeclarationResponseDTO> searchByFilters(
            HealthDeclarationStatus status,
            Long studentId,
            Long declaredById,
            String academicYear,
            Pageable pageable) {

        Page<HealthDeclarationEntity> entities = healthDeclarationRepository.searchByFilters(
                status, studentId, declaredById, academicYear, pageable);
        return entities.map(HealthDeclarationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HealthDeclarationResponseDTO> getByIdWithDetails(Long id) {
        Optional<HealthDeclarationEntity> entity = healthDeclarationRepository.findByIdWithDetails(id);
        return entity.map(HealthDeclarationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getByStudentIdWithDetails(Long studentId) {
        List<HealthDeclarationEntity> entities = healthDeclarationRepository.findByStudentIdWithDetails(studentId);
        return entities.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getByDeclaredByUserIdWithDetails(Long declaredById) {
        List<HealthDeclarationEntity> entities = healthDeclarationRepository.findByDeclaredByUserIdWithDetails(declaredById);
        return entities.stream()
                .map(HealthDeclarationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public HealthDeclarationResponseDTO create(HealthDeclarationCreateDTO createDTO) {
        StudentEntity student = studentRepository.findById(createDTO.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + createDTO.getStudentId()));

        UserEntity declaredBy = userRepository.findById(createDTO.getDeclaredById())
                .orElseThrow(() -> new NotFoundException("User not found with id: " + createDTO.getDeclaredById()));

        HealthDeclarationEntity entity = HealthDeclarationMapper.fromRequestDTO(createDTO, student, declaredBy);
        HealthDeclarationEntity saved = healthDeclarationRepository.save(entity);
        return HealthDeclarationMapper.toDTO(saved);
    }

    @Override
    public HealthDeclarationResponseDTO update(Long id, HealthDeclarationUpdateDTO updateDTO) {
        HealthDeclarationEntity entity = healthDeclarationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));

        HealthDeclarationMapper.updateEntityFromDTO(entity, updateDTO);
        HealthDeclarationEntity updated = healthDeclarationRepository.save(entity);
        return HealthDeclarationMapper.toDTO(updated);
    }
    @Override
    public HealthDeclarationResponseDTO updateStatus(Long id, HealthDeclarationStatus status) {
        HealthDeclarationEntity entity = healthDeclarationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));
        entity.setStatus(status);
        HealthDeclarationEntity updated = healthDeclarationRepository.save(entity);
        return HealthDeclarationMapper.toDTO(updated);
    }


    @Override
    public void delete(Long id) {
        if (!healthDeclarationRepository.existsById(id)) {
            throw new NotFoundException("Health declaration not found with id: " + id);
        }
        healthDeclarationRepository.deleteById(id);
    }
}