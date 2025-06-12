package sms.swp391.services;

import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.respones.StudentResponse;
import sms.swp391.models.entities.StudentEntity;

import java.util.List;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id, StudentUpdateRequest request);
    void deleteStudent(Long id);
    List<StudentResponse> getAllStudents();
    StudentResponse getStudentById(Long id);
}