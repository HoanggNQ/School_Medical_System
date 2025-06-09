package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.respones.StudentResponse;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.repositories.StudentRepository;
import sms.swp391.services.StudentService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public StudentResponse createStudent(StudentEntity student) {
        student.setStatus("ACTIVE");
        return toResponse(studentRepository.save(student));
    }

    @Override
    public StudentResponse updateStudent(Long id, StudentEntity student) {
        StudentEntity existing = studentRepository.findByIdAndStatusTrue(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        // update fields as needed
        existing.setStudentCode(student.getStudentCode());
        existing.setBloodType(student.getBloodType());
        existing.setGeneticDiseases(student.getGeneticDiseases());
        existing.setOtherMedicalNotes(student.getOtherMedicalNotes());
        existing.setEmergencyContact(student.getEmergencyContact());
        // ... update other fields as needed
        return toResponse(studentRepository.save(existing));
    }

    @Override
    public void deleteStudent(Long id) {
        StudentEntity student = studentRepository.findByIdAndStatusTrue(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setStatus("INACTIVE"); // or whatever status indicates deletion
        studentRepository.save(student);
    }

    @Override
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAllActiveStudents()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        StudentEntity student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return toResponse(student);
    }

    private StudentResponse toResponse(StudentEntity entity) {
        // Map entity to response (implement as needed)
        return StudentResponse.builder()
                .id(entity.getId())
                // map other fields
                .studentCode(entity.getStudentCode())
                .bloodType(entity.getBloodType())
                .geneticDiseases(entity.getGeneticDiseases())
                .otherMedicalNotes(entity.getOtherMedicalNotes())
                .emergencyContact(entity.getEmergencyContact())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

}