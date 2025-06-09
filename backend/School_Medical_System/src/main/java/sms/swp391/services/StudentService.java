package sms.swp391.services;

import sms.swp391.models.dtos.respones.StudentResponse;
import sms.swp391.models.entities.StudentEntity;

import java.util.List;

public interface StudentService {
    StudentResponse createStudent(StudentEntity student);
    StudentResponse updateStudent(Long id, StudentEntity student);
    void deleteStudent(Long id);
    List<StudentResponse> getAllStudents();
    StudentResponse getStudentById(Long id);
}