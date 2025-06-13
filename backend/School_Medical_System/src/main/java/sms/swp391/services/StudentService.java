package sms.swp391.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.respones.StudentResponse;
import sms.swp391.models.dtos.respones.StudentGetResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.respones.PaginatedStudentResponse;

import java.util.List;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id, StudentUpdateRequest request);
    void deleteStudent(Long id);
    StudentGetResponse getStudentById(Long id);
    List<String> findFullNameByParent(Long parentId);
    PaginatedStudentResponse getAllStudents(String search, Pageable pageable);
}