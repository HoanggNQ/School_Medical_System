package sms.swp391.services.impl;

        import lombok.RequiredArgsConstructor;
        import org.apache.commons.lang3.RandomStringUtils;
        import org.springframework.stereotype.Service;
        import sms.swp391.models.dtos.enums.RoleEnum;
        import sms.swp391.models.dtos.requests.StudentRequest;
        import sms.swp391.models.dtos.respones.StudentResponse;
        import sms.swp391.models.entities.ClassEntity;
        import sms.swp391.models.entities.StudentEntity;
        import sms.swp391.models.entities.UserEntity;
        import sms.swp391.models.exception.ActionFailedException;
        import sms.swp391.models.exception.NotFoundException;
        import sms.swp391.repositories.ClassRepository;
        import sms.swp391.repositories.StudentRepository;
        import sms.swp391.repositories.UserRepository;
        import sms.swp391.services.StudentService;
        import sms.swp391.utils.StudentMapper;
        import sms.swp391.models.dtos.enums.StatusEnum;
        import sms.swp391.utils.UserMapper;
        import sms.swp391.models.dtos.requests.StudentUpdateRequest;
        import sms.swp391.models.dtos.respones.StudentGetResponse;

        import java.util.List;
        import java.util.Optional;
        import java.util.stream.Collectors;

        @Service
        @RequiredArgsConstructor
        public class StudentServiceImpl implements StudentService {
            private final UserRepository userRepository;
            private final StudentRepository studentRepository;
            private final ClassRepository classRepository;

            @Override
            public StudentResponse createStudent(StudentRequest request) {
                try {
                    if (studentRepository.findByStudentCode(request.getStudentCode()).isPresent()) {
                        throw new ActionFailedException("Student code already exists");
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
                    user.setPassword(request.getUserRegister().getPassword());
                    user.setFullname(request.getUserRegister().getFullname());
                    user.setUsername(request.getUserRegister().getUsername());
                    user.setGender(request.getUserRegister().getGender());
                    user.setDob(request.getUserRegister().getDob());
                    user.setEmail(request.getUserRegister().getEmail());
                    user.setPhoneNumber(phone);
                    user.setAddress(request.getUserRegister().getAddress());
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
                            .bloodType(request.getBloodType())
                            .geneticDiseases(request.getGeneticDiseases())
                            .otherMedicalNotes(request.getOtherMedicalNotes())
                            .emergencyContact(request.getEmergencyContact())
                            .build();

                    studentRepository.save(student);

                    return StudentMapper.toDTO(student);

                } catch (Exception e) {
                    throw new ActionFailedException("Failed to create student");
                }
            }

            @Override
            public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
                StudentEntity existing = studentRepository.findById(id)
                        .orElseThrow(() -> new NotFoundException(
                                String.format("Cannot find student with ID: %s", id)
                        ));
                // Update fields from request
                if (request.getClassId() != null) {
                    ClassEntity classEntity = classRepository.findById(request.getClassId())
                            .orElseThrow(() -> new NotFoundException("Class not found"));
                    existing.setClassEntity(classEntity);
                }
                if (request.getParentId() != null) {
                    UserEntity parent = userRepository.findById(request.getParentId())
                            .orElseThrow(() -> new NotFoundException("Parent not found"));
                    existing.setParent(parent);
                }
                existing.setBloodType(request.getBloodType());
                existing.setGeneticDiseases(request.getGeneticDiseases());
                existing.setOtherMedicalNotes(request.getOtherMedicalNotes());
                existing.setEmergencyContact(request.getEmergencyContact());
                try {
                    StudentEntity updated = studentRepository.save(existing);
                    return StudentMapper.toDTO(updated);
                } catch (Exception e) {
                    throw new ActionFailedException(String.format("Failed to update student with ID: %s", id));
                }
            }

            @Override
            public List<StudentGetResponse> getAllStudents() {
                try {
                    List<StudentEntity> students = studentRepository.findAll();
                    return students.stream()
                            .filter(s -> s.getUser() != null &&
                                         s.getUser().getStatus() != null &&
                                         s.getUser().getStatus().name().equals("ACTIVE"))
                            .map(this::toStudentGetResponse)
                            .collect(Collectors.toList());
                } catch (Exception e) {
                    throw new ActionFailedException("Failed to get students");
                }
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
                    return toStudentGetResponse(student);
                } catch (Exception e) {
                    throw new ActionFailedException(String.format("Failed to get student with ID: %s", id));
                }
            }

            // Helper method
            private StudentGetResponse toStudentGetResponse(StudentEntity student) {
                UserEntity user = student.getUser();
                return StudentGetResponse.builder()
                        .userId(user.getUserId())
                        .fullName(user.getFullname())
                        .dob(user.getDob() != null ? user.getDob().toString() : null)
                        .gender(user.getGender())
                        .className(student.getClassEntity() != null ? student.getClassEntity().getClassName() : null)
                        .phoneNumber(user.getPhoneNumber())
                        .address(user.getAddress())
                        .studentCode(student.getStudentCode())
                        .bloodType(student.getBloodType())
                        .geneticDiseases(student.getGeneticDiseases())
                        .otherMedicalNotes(student.getOtherMedicalNotes())
                        .emergencyContact(student.getEmergencyContact())
                        .build();
            }

            @Override
            public void deleteStudent(Long id) {
                StudentEntity student = studentRepository.findById(id)
                        .orElseThrow(() -> new NotFoundException(
                                String.format("Cannot find student with ID: %s", id)
                        ));
                try {
                    if (student.getUser() != null) {
                        student.getUser().setStatus(StatusEnum.DELETED);
                        // Save the user entity to update status
                        studentRepository.save(student); // If cascade is set, or use userRepository.save(student.getUser());
                    }
                } catch (Exception e) {
                    throw new ActionFailedException(String.format("Failed to delete student with ID: %s", id));
                }
            }

            private String generateStudentCode() {
                String SC;
                do {
                    SC = "SMS"+RandomStringUtils.randomNumeric(6);
                } while (studentRepository.existsByStudentCode(SC));
                return SC;
            }

            @Override
            public List<String> findFullNameByParent(Long parentId) {
                return studentRepository.findFullNameByParent(parentId);
            }
        }