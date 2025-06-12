package sms.swp391.services;

import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.respones.StudentResponse;
import sms.swp391.models.dtos.respones.StudentGetResponse;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id, StudentUpdateRequest request);
    void deleteStudent(Long id);
    List<StudentGetResponse> getAllStudents();
    StudentGetResponse getStudentById(Long id);
    List<String> findFullNameByParent(Long parentId);
}