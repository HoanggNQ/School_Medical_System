package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.requests.StudentImportDTO;
import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.responses.*;
import sms.swp391.models.entities.ClassEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.StudentHealthProfileEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.StudentService;
import sms.swp391.utils.ExcelExporter;
import sms.swp391.utils.StudentMapper;
import sms.swp391.utils.UserMapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final PasswordEncoder passwordEncoder;
    private final HealthCheckCampaignRepository   hcRepo;
    private final VaccinationCampaignRepository   vacRepo;
    private final StudentHealthEventMapper        mapper;

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.findByUser_Email(request.getUserRegister().getEmail()).isPresent()) {
            throw new ActionFailedException("Student email already exists");
        }

        String phone = request.getUserRegister().getPhoneNumber();
        userRepository.findByPhoneNumber(phone).ifPresent(u -> {
            if (u.getRoleName() == RoleEnum.STUDENT || u.getRoleName() == RoleEnum.PARENT) {
                throw new ActionFailedException("Phone number already used by another student or parent.");
            }
        });

        UserEntity user = UserMapper.toEntity(request.getUserRegister());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
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
                .build();

        StudentHealthProfileEntity profile = StudentHealthProfileEntity.builder()
                .student(student)
                .bloodType(request.getBloodType())
                .chronicDiseases(request.getChronicDiseases())
                .geneticDiseases(request.getGeneticDiseases())
                .allergies(request.getAllergies())
                .height(request.getHeight())
                .weight(request.getWeight())
                .build();

        student.setHealthProfile(profile);
        studentRepository.saveAndFlush(student);
        recalculateTotalStudent(classEntity);
        if (classEntity != null) {
            int count = studentRepository.countActiveStudentsByClassId(classEntity.getId());
            classEntity.setTotalstudent(count);
            classRepository.save(classEntity);
        }
        return StudentMapper.toDTO(student);
    }
    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {

        StudentEntity existing = studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cannot find student with ID: " + id));

        ClassEntity oldClass = existing.getClassEntity();   // lớp trước khi chỉnh

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

        StudentHealthProfileEntity profile =
                existing.getHealthProfile() != null ? existing.getHealthProfile()
                        : new StudentHealthProfileEntity();
        profile.setStudent(existing);
        profile.setBloodType(request.getBloodType());
        profile.setGeneticDiseases(request.getGeneticDiseases());
        profile.setChronicDiseases(request.getChronicDiseases());
        profile.setAllergies(request.getAllergies());
        profile.setHeight(request.getHeight());
        profile.setWeight(request.getWeight());
        existing.setHealthProfile(profile);

        StudentEntity updated = studentRepository.saveAndFlush(existing);

        if (oldClass != null &&
                (updated.getClassEntity() == null ||
                        !oldClass.getId().equals(updated.getClassEntity().getId()))) {
            recalculateTotalStudent(oldClass);
        }
        recalculateTotalStudent(updated.getClassEntity());

        return StudentMapper.toDTO(updated);
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
                studentRepository.saveAndFlush(student); // flush rồi mới đếm
            }
            recalculateTotalStudent(student.getClassEntity());
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to delete student with ID: %s", id));
        }
    }

    private String generateStudentCode() {
        String SC;
        do {
            SC = "SMS25" + RandomStringUtils.randomNumeric(4);
        } while (studentRepository.existsByStudentCode(SC));
        return SC;
    }

    @Override
    public List<StudentResponse> findStudentByParent(Long parentId) {
        List<StudentEntity> students = studentRepository.findByParent_UserId(parentId);
        return students.stream().map(StudentMapper::toDTO).toList();
    }

    @Override
    public Page<StudentHealthEventResponseDTO> getPagedEvents(
            Long studentId, String campaignName, Pageable pageable) {

        String keyword = (campaignName == null) ? "" : campaignName.trim();

        List<StudentHealthEventProjection> merged = new ArrayList<>();
        merged.addAll(hcRepo.findEvents(studentId, keyword, Pageable.unpaged()).getContent());
        merged.addAll(vacRepo.findEvents(studentId, keyword, Pageable.unpaged()).getContent());

        Comparator<StudentHealthEventProjection> comparator =
                Comparator.comparing(StudentHealthEventProjection::getStartDate,
                                Comparator.nullsLast(Comparator.naturalOrder()))
                        .reversed();  // DESC
        merged.sort(comparator);

        int start = (int) pageable.getOffset();
        int end   = Math.min(start + pageable.getPageSize(), merged.size());
        if (start > end) {   // yêu cầu trang vượt quá tổng trang
            return Page.empty(pageable);
        }

        List<StudentHealthEventResponseDTO> dtoPage = merged.subList(start, end).stream()
                .map(mapper::toDto)
                .toList();

        return new PageImpl<>(dtoPage, pageable, merged.size());
    }

    @Mapper(componentModel = "spring")
    public interface StudentHealthEventMapper {

        @Mapping(expression = "java(p.getConsentId() == null ? \"Chiến dịch chưa bắt đầu\" : \"Đã có consent\")",
                target = "consentStatusText")
        @Mapping(expression = "java(p.getResultStatus() == null ? \"Chưa ghi nhập kết quả\" : p.getResultStatus())",
                target = "resultStatus")
        StudentHealthEventResponseDTO toDto(StudentHealthEventProjection p);
    }
    @Override
    public ResponseEntity<ResponseObject> importStudentsFromExcel(MultipartFile file) {
        try {
            List<StudentImportDTO> importList = ExcelExporter.parseStudentsFromExcel(file.getInputStream());
            List<StudentResponse> responses = new ArrayList<>();

            for (StudentImportDTO dto : importList) {
                StudentRequest request = convertToStudentRequest(dto);
                StudentResponse response = createStudent(request);
                responses.add(response);
            }

            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("IMPORT_SUCCESS")
                            .message("Import students successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("IMPORT_FAILED")
                            .message("Import failed: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    private void recalculateTotalStudent(ClassEntity clazz) {
        if (clazz == null) return;
        int count = studentRepository.countActiveStudentsByClassId(clazz.getId());
        clazz.setTotalstudent(count);
        classRepository.save(clazz);
    }
    private StudentRequest convertToStudentRequest(StudentImportDTO dto) {
        UserRegisterDTO user = UserRegisterDTO.builder()
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .fullName(dto.getFullname())
                .address(dto.getAddress())
                .dob(dto.getDob())
                .gender(dto.getGender())
                .build();

        return StudentRequest.builder()
                .userRegister(user)
                .classId(dto.getClassId())
                .parentId(dto.getParentId())
                .bloodType(dto.getBloodType())
                .chronicDiseases(dto.getChronicDiseases())
                .allergies(dto.getAllergies())
                .emergencyContactName(dto.getEmergencyContactName())
                .emergencyContactPhone(dto.getEmergencyContactPhone())
                .height(dto.getHeight())
                .weight(dto.getWeight())
                .build();
    }

}
