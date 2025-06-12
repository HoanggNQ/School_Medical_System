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
    public HealthDeclarationResponseDTO save(HealthDeclarationResponseDTO responseDTO) {
        // Tìm student và user entities
        StudentEntity student = studentRepository.findById(responseDTO.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + responseDTO.getStudentId()));

        UserEntity declaredBy = userRepository.findById(responseDTO.getDeclaredById())
                .orElseThrow(() -> new NotFoundException("User not found with id: " + responseDTO.getDeclaredById()));

        HealthDeclarationEntity entity;

        if (responseDTO.getId() != null) {
            // Update existing entity
            entity = healthDeclarationRepository.findById(responseDTO.getId())
                    .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + responseDTO.getId()));

            // Convert ResponseDTO to UpdateDTO for mapping
            HealthDeclarationUpdateDTO updateDTO = HealthDeclarationUpdateDTO.builder()
                    .status(responseDTO.getStatus())
                    .academicYear(responseDTO.getAcademicYear())
                    .height(responseDTO.getHeight())
                    .weight(responseDTO.getWeight())
                    .bloodType(responseDTO.getBloodType())
                    .allergies(responseDTO.getAllergies())
                    .chronicDiseases(responseDTO.getChronicDiseases())
                    .currentMedications(responseDTO.getCurrentMedications())
                    .emergencyContactName(responseDTO.getEmergencyContactName())
                    .emergencyContactPhone(responseDTO.getEmergencyContactPhone())
                    .build();

            HealthDeclarationMapper.updateEntityFromDTO(entity, updateDTO);
        } else {
            // Create new entity
            HealthDeclarationCreateDTO createDTO = HealthDeclarationCreateDTO.builder()
                    .status(responseDTO.getStatus())
                    .academicYear(responseDTO.getAcademicYear())
                    .height(responseDTO.getHeight())
                    .weight(responseDTO.getWeight())
                    .bloodType(responseDTO.getBloodType())
                    .allergies(responseDTO.getAllergies())
                    .chronicDiseases(responseDTO.getChronicDiseases())
                    .currentMedications(responseDTO.getCurrentMedications())
                    .emergencyContactName(responseDTO.getEmergencyContactName())
                    .emergencyContactPhone(responseDTO.getEmergencyContactPhone())
                    .build();

            entity = HealthDeclarationMapper.fromRequestDTO(createDTO, student, declaredBy);
        }

        HealthDeclarationEntity savedEntity = healthDeclarationRepository.save(entity);
        return HealthDeclarationMapper.toDTO(savedEntity);
    }

    @Override
    public void delete(Long id) {
        if (!healthDeclarationRepository.existsById(id)) {
            throw new NotFoundException("Health declaration not found with id: " + id);
        }
        healthDeclarationRepository.deleteById(id);
    }
}