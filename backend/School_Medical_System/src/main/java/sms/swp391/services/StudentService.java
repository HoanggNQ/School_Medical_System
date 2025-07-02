package sms.swp391.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.responses.StudentHealthEventResponseDTO;
import sms.swp391.models.dtos.responses.StudentResponse;
import sms.swp391.models.dtos.responses.StudentGetResponse;
import sms.swp391.models.dtos.responses.PaginatedStudentResponse;

import java.util.List;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id, StudentUpdateRequest request);
    void deleteStudent(Long id);
    StudentGetResponse getStudentById(Long id);
    List<StudentResponse> findStudentByParent(Long parentId);
    PaginatedStudentResponse getAllStudents(String search, Pageable pageable);
    public Page<StudentHealthEventResponseDTO> getPagedEvents(Long studentId, String campaignName, String type, Pageable pageable);

}