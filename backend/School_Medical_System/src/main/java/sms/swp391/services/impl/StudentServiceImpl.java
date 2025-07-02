package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.responses.PaginatedStudentResponse;
import sms.swp391.models.dtos.responses.StudentGetResponse;
import sms.swp391.models.dtos.responses.StudentHealthEventResponseDTO;
import sms.swp391.models.dtos.responses.StudentResponse;
import sms.swp391.models.entities.ClassEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.StudentHealthProfileEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.StudentService;
import sms.swp391.utils.StudentMapper;
import sms.swp391.utils.UserMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final StudentEventRepository studentEventRepository;

    @Override
    public StudentResponse createStudent(StudentRequest request) {
        try {
            if (studentRepository.findByStudentCode(request.getStudentCode()).isPresent()) {
                throw new ActionFailedException("Student code already exists");
            }
            if (studentRepository.findByUser_Email(request.getUserRegister().getEmail()).isPresent()){
                throw new ActionFailedException("Student email already exists");

            }

            String phone = request.getUserRegister().getPhoneNumber();
            Optional<UserEntity> existingUser = userRepository.findByPhoneNumber(phone);
            if (existingUser.isPresent()) {
                RoleEnum role = existingUser.get().getRoleName();
                if (role == RoleEnum.STUDENT || role == RoleEnum.PARENT) {
                    throw new ActionFailedException("Phone number already used by another student or parent.");
                }
            }

            UserEntity user = UserMapper.toEntity(request.getUserRegister());
            user.setRoleName(RoleEnum.STUDENT);
            user.setStatus(StatusEnum.ACTIVE);
            userRepository.save(user);

            UserEntity parent = null;
            if (request.getParentId() != null) {
                parent = userRepository.findById(request.getParentId())
                        .orElseThrow(() -> new NotFoundException("Parent not found"));
            }

            ClassEntity classEntity = null;
            if (request.getClassId() != null) {
                classEntity = classRepository.findById(request.getClassId())
                        .orElseThrow(() -> new NotFoundException("Class not found"));
            }

            StudentEntity student = StudentEntity.builder()
                    .user(user)
                    .classEntity(classEntity)
                    .parent(parent)
                    .studentCode(generateStudentCode())
                    .emergencyContactName(request.getEmergencyContactName())
                    .emergencyContactPhone(request.getEmergencyContactPhone())
                    .build();

// Tạo hồ sơ sức khỏe
            StudentHealthProfileEntity profile = StudentHealthProfileEntity.builder()
                    .student(student)
                    .bloodType(request.getBloodType())
                    .geneticDiseases(request.getGeneticDiseases())
                    .otherMedicalNotes(request.getOtherMedicalNotes())
                    .currentMedications(request.getCurrentMedications())
                    .chronicDiseases(request.getChronicDiseases())
                    .allergies(request.getAllergies())
                    .height(request.getHeight())
                    .weight(request.getWeight())
                    .build();

            student.setHealthProfile(profile);
            studentRepository.save(student);


            studentRepository.save(student);

            if (classEntity != null) {
                int count = studentRepository.countActiveStudentsByClassId(classEntity.getId());
                classEntity.setTotalstudent(count);
                classRepository.save(classEntity);
            }

            return StudentMapper.toDTO(student);

        } catch (Exception e) {
            throw new ActionFailedException("Failed to create student");
        }
    }

    @Override
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        StudentEntity existing = studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(String.format("Cannot find student with ID: %s", id)));

        ClassEntity oldClass = existing.getClassEntity();

        if (request.getClassId() != null) {
            ClassEntity newClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new NotFoundException("Class not found"));
            existing.setClassEntity(newClass);
        }

        if (request.getParentId() != null) {
            UserEntity parent = userRepository.findById(request.getParentId())
                    .orElseThrow(() -> new NotFoundException("Parent not found"));
            existing.setParent(parent);
        }


        existing.setEmergencyContactName(request.getEmergencyContactName());
        existing.setEmergencyContactPhone(request.getEmergencyContactPhone());
        StudentHealthProfileEntity profile = existing.getHealthProfile();
        if (profile == null) {
            profile = new StudentHealthProfileEntity();
            profile.setStudent(existing);
            existing.setHealthProfile(profile);
        }

        profile.setBloodType(request.getBloodType());
        profile.setGeneticDiseases(request.getGeneticDiseases());
        profile.setOtherMedicalNotes(request.getOtherMedicalNotes());
        profile.setCurrentMedications(request.getCurrentMedications());
        profile.setChronicDiseases(request.getChronicDiseases());
        profile.setAllergies(request.getAllergies());
        profile.setHeight(request.getHeight());
        profile.setWeight(request.getWeight());


        try {
            StudentEntity updated = studentRepository.save(existing);

            // Update totalstudent for old class if changed
            if (oldClass != null && (existing.getClassEntity() == null || !oldClass.getId().equals(existing.getClassEntity().getId()))) {
                classRepository.findById(oldClass.getId()).ifPresent(c -> {
                    int count = studentRepository.countActiveStudentsByClassId(c.getId());
                    c.setTotalstudent(count);
                    classRepository.save(c);
                });
            }
            // Update totalstudent for new class
            if (existing.getClassEntity() != null) {
                classRepository.findById(existing.getClassEntity().getId()).ifPresent(c -> {
                    int count = studentRepository.countActiveStudentsByClassId(c.getId());
                    c.setTotalstudent(count);
                    classRepository.save(c);
                });
            }

            return StudentMapper.toDTO(updated);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to update student with ID: %s", id));
        }
    }

    @Override
    public PaginatedStudentResponse getAllStudents(String search, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String property = order.getProperty();
                    return property.equals("studentCode") ||
                            "createdAt".equals(property) ||
                            "classEntity.id".equals(property) ||
                            property.equals("id") ||
                            "updatedAt".equals(property) ||
                            "user.userId".equals(property) ||
                            property.equals("bloodType") ||
                            property.equals("geneticDiseases") ||
                            property.equals("allergies") ||
                            property.equals("chronicDiseases") ||
                            "height".equals(property) ||
                            "weight".equals(property) ||
                            property.equals("user.fullname") ||
                            property.equals("user.gender") ||
                            property.equals("user.dob") ||
                            property.equals("user.username") ||
                            property.equals("classEntity.className");
                })
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        Sort::by
                ));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<StudentEntity> studentPage;
        if (search != null && !search.isEmpty()) {
            studentPage = studentRepository.searchStudents(search, validatedPageable);
        } else {
            studentPage = studentRepository.findAllActive(validatedPageable);
        }

        List<StudentGetResponse> studentDTOs = studentPage.stream()
                .map(StudentMapper::toStudentGetResponse)
                .toList();

        return PaginatedStudentResponse.builder()
                .students(studentDTOs)
                .totalElements(studentPage.getTotalElements())
                .totalPages(studentPage.getTotalPages())
                .currentPage(studentPage.getNumber())
                .build();
    }

    @Override
    public StudentGetResponse getStudentById(Long id) {
        try {
            StudentEntity student = studentRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Student not found"));

            if (student.getUser() == null ||
                    student.getUser().getStatus() == null ||
                    !student.getUser().getStatus().name().equals("ACTIVE")) {
                throw new NotFoundException("Student not found or not active");
            }

            return StudentMapper.toStudentGetResponse(student);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to get student with ID: %s", id));
        }
    }

    @Override
    public void deleteStudent(Long id) {
        StudentEntity student = studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(String.format("Cannot find student with ID: %s", id)));

        try {
            if (student.getUser() != null) {
                student.getUser().setStatus(StatusEnum.DELETED);
                studentRepository.save(student); // cascade will handle User if set
            }
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to delete student with ID: %s", id));
        }
    }

    private String generateStudentCode() {
        String SC;
        do {
            SC = "SMS" + RandomStringUtils.randomNumeric(6);
        } while (studentRepository.existsByStudentCode(SC));
        return SC;
    }

    @Override
    public List<StudentResponse> findStudentByParent(Long parentId) {
        List<StudentEntity> students = studentRepository.findByParent_UserId(parentId);
        return students.stream().map(StudentMapper::toDTO).toList();
    }
    @Override
    @Transactional
    public Page<StudentHealthEventResponseDTO> getPagedEvents(Long studentId,String campaignName,String type, Pageable pageable) {
        // Gọi repository để lấy projection từ native query
        Page<StudentHealthEventProjection> page =
                studentEventRepository.findAllHealthEventsByStudent(
                        studentId,
                        campaignName == null ? "" : campaignName.trim(),
                        type,
                        pageable);


        // Chuyển projection thành DTO
        return page.map(p -> StudentHealthEventResponseDTO.builder()
                .type(p.getType())
                .eventId(p.getEventId())
                .campaignName(p.getCampaign())
                .description(p.getDescription())
                .consentId(p.getConsentId())
                .consentStatusText(p.getConsentId() == null ?
                        "Chiến dịch chưa bắt đầu" : "Đã có consent")
                .checkDate(p.getCheckDate())
                .studentName(p.getStudentName())
                .location(p.getLocation())
                .requirementEquipment(p.getRequirementEquipment())
                .consentStatus(p.getConsentStatus())
                .resultStatus(p.getStatus())
                .build());
    }

}
