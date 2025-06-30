package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthDeclarationCreateDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.responses.HealthDeclarationResponseDTO;
import sms.swp391.models.dtos.responses.StudentHealthProfileResponseDTO;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.HealthDeclarationRepository;
import sms.swp391.repositories.StudentRepository;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.HealthDeclarationService;
import sms.swp391.utils.HealthDeclarationMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthDeclarationServiceImpl implements HealthDeclarationService {

    private final HealthDeclarationRepository healthDeclarationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<HealthDeclarationResponseDTO> searchByFilters(MedicalStatus status,
                                                              Long studentId,
                                                              String academicYear,
                                                              Pageable pageable) {
        if (pageable == null) throw new IllegalArgumentException("pageable cannot be null");
        Page<HealthDeclarationEntity> page = healthDeclarationRepository.searchByFilters(
                status, studentId, academicYear, pageable);
        return page.map(HealthDeclarationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HealthDeclarationResponseDTO> getByIdWithDetails(Long id) {
        if (id == null) throw new IllegalArgumentException("id cannot be null");
        HealthDeclarationEntity entity = healthDeclarationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));
        return Optional.of(HealthDeclarationMapper.toDTO(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getByStudentIdWithDetails(Long studentId) {
        if (studentId == null) throw new IllegalArgumentException("studentId cannot be null");
        List<HealthDeclarationEntity> list = healthDeclarationRepository.findByStudentIdWithDetails(studentId);
        return list.stream().map(HealthDeclarationMapper::toDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthDeclarationResponseDTO> getByDeclaredByUserIdWithDetails(Long declaredById) {
        if (declaredById == null) throw new IllegalArgumentException("declaredById cannot be null");
        List<HealthDeclarationEntity> list = healthDeclarationRepository.findByDeclaredByUserIdWithDetails(declaredById);
        return list.stream().map(HealthDeclarationMapper::toDTO).toList();
    }

    @Override
    public StudentHealthProfileResponseDTO getStudentHealthProfile(Long studentId) {
        if (studentId == null) throw new IllegalArgumentException("studentId cannot be null");
        StudentEntity student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found with id: " + studentId));
        StudentHealthProfileEntity profile = student.getHealthProfile();
        if (profile == null) {
            throw new NotFoundException("Health profile not found for student with id: " + studentId);
        }
        return HealthDeclarationMapper.toDTOProfile(profile);
    }

    @Override
    public HealthDeclarationResponseDTO create(HealthDeclarationCreateDTO dto) {
        if (dto == null) throw new IllegalArgumentException("dto cannot be null");
        // basic validations
        if (dto.getStudentId() == null) throw new IllegalArgumentException("studentId required");
        if (dto.getDeclaredById() == null) throw new IllegalArgumentException("declaredById required");
        if (dto.getAcademicYear() == null || dto.getAcademicYear().isBlank())
            throw new IllegalArgumentException("academicYear required");

        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found: " + dto.getStudentId()));
        UserEntity declaredBy = userRepository.findById(dto.getDeclaredById())
                .orElseThrow(() -> new NotFoundException("User not found: " + dto.getDeclaredById()));

        boolean exists = healthDeclarationRepository.existsByStudentIdAndAcademicYear(dto.getStudentId(), dto.getAcademicYear());
        if (exists)
            throw new IllegalArgumentException("Declaration already exists for academic year: " + dto.getAcademicYear());

        HealthDeclarationEntity entity = HealthDeclarationMapper.fromCreateDTO(dto, student, declaredBy);
        entity.setDeclarationDate(LocalDate.now());
        entity.setStatus(MedicalStatus.PENDING);
        HealthDeclarationEntity saved = healthDeclarationRepository.save(entity);
        return HealthDeclarationMapper.toDTO(saved);
    }

    @Override
    public HealthDeclarationResponseDTO update(Long id, HealthDeclarationUpdateDTO dto) {
        if (id == null) throw new IllegalArgumentException("id cannot be null");
        if (dto == null) throw new IllegalArgumentException("dto cannot be null");

        HealthDeclarationEntity entity = healthDeclarationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));
        HealthDeclarationMapper.updateEntityFromUpdateDTO(entity, dto);
        HealthDeclarationEntity updated = healthDeclarationRepository.save(entity);
        return HealthDeclarationMapper.toDTO(updated);
    }

    @Override
    public HealthDeclarationResponseDTO updateStatus(Long id, MedicalStatus status) {
        if (id == null) throw new IllegalArgumentException("id cannot be null");
        if (status == null) throw new IllegalArgumentException("status cannot be null");

        HealthDeclarationEntity entity = healthDeclarationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));
        entity.setStatus(status);
        HealthDeclarationEntity updated = healthDeclarationRepository.save(entity);
        return HealthDeclarationMapper.toDTO(updated);
    }

    @Override
    public void delete(Long id) {
        if (id == null) throw new IllegalArgumentException("id cannot be null");
        HealthDeclarationEntity entity = healthDeclarationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Health declaration not found with id: " + id));
        entity.setStatus(MedicalStatus.REJECTED);
        healthDeclarationRepository.save(entity);
    }
}
