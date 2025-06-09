package sms.swp391.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.request.StudentRequest;
import sms.swp391.models.dtos.respones.StudentResponse;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.services.StudentService;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.entities.ClassEntity;

import java.util.List;
import sms.swp391.repositories.UserRepository;
import sms.swp391.repositories.ClassRepository;
import sms.swp391.utils.StudentMapper;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;

    @PostMapping("/create")
    public ResponseEntity<StudentResponse> createStudent(@RequestBody StudentRequest request) {
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElse(null);
        UserEntity parent = userRepository.findById(request.getParentId())
                .orElse(null);

        StudentEntity entity = StudentMapper.fromRequest(request, user, classEntity, parent);
        StudentResponse response = studentService.createStudent(entity);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StudentResponse> updateStudent(@PathVariable Long id, @RequestBody StudentRequest request) {
        StudentEntity entity = StudentEntity.builder()
                .studentCode(request.getStudentCode())
                .bloodType(request.getBloodType())
                .geneticDiseases(request.getGeneticDiseases())
                .otherMedicalNotes(request.getOtherMedicalNotes())
                .emergencyContact(request.getEmergencyContact())
                // Set user, classEntity, parent as needed
                .build();
        StudentResponse response = studentService.updateStudent(id, entity);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }
}