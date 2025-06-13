package sms.swp391.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.dtos.respones.StudentResponse;
import sms.swp391.services.StudentService;
import sms.swp391.models.dtos.respones.StudentGetResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import sms.swp391.models.dtos.respones.PaginatedStudentResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<ResponseObject> createStudent(@RequestBody @Valid StudentRequest request) {
        StudentResponse student = studentService.createStudent(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Student created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(student)
                        .build()
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateStudent(@PathVariable Long id, @RequestBody StudentUpdateRequest request) {
        StudentResponse response = studentService.updateStudent(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Student updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Student deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(page = 0, size = 10)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "fullname", direction = Sort.Direction.ASC)
            }) Pageable pageable) {
        PaginatedStudentResponse response = studentService.getAllStudents(search, pageable);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get students successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getStudentById(@PathVariable Long id) {
        StudentGetResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get student successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/findFullNameByParent/{parentId}")
    public ResponseEntity<ResponseObject> findFullNameByParent(@PathVariable Long parentId) {
        List<String> fullnames = studentService.findFullNameByParent(parentId);
        if (!fullnames.isEmpty()) {
            return ResponseEntity.ok(
                ResponseObject.builder()
                    .code("GET_SUCCESS")
                    .message("Found student fullnames")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .data(fullnames)
                    .build()
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ResponseObject.builder()
                    .code("NOT_FOUND")
                    .message("No student found for this parent")
                    .status(HttpStatus.NOT_FOUND)
                    .isSuccess(false)
                    .data(null)
                    .build()
            );
        }
    }
}
