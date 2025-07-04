package sms.swp391.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.responses.*;

import java.util.List;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id, StudentUpdateRequest request);
    void deleteStudent(Long id);
    StudentGetResponse getStudentById(Long id);
    List<StudentResponse> findStudentByParent(Long parentId);
    PaginatedStudentResponse getAllStudents(String search, Pageable pageable);
    Page<StudentHealthEventResponseDTO> getPagedEvents(Long studentId, String campaignName, Pageable pageable);

    ResponseEntity<ResponseObject> importStudentsFromExcel(MultipartFile file);
}