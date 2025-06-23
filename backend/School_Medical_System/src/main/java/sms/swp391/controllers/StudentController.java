package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "Tạo một học sinh", description = "Khởi tạo một học sinh mới đồng thời tạo người dùng mới")
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

    @Operation(summary = "Cập nhật hồ sơ học sinh", description = "Chỉnh sửa thông tin học sinh theo ID.")
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

    @Operation(summary = "Xóa học sinh", description = "Đổi trạng thái học sinh thành DELETED theo ID.")
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

    @Operation(summary = "Lấy tất cả hồ sơ học sinh", description = "Trả về danh sách học sinh với phân trang và tìm kiếm.")
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

    @Operation(summary = "Lấy học sinh theo ID", description = "Trả về thông tin học sinh theo ID.")
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

    @Operation(summary = "Tìm học sinh theo parent id", description = "Trả về thông tin học sinh theo parent id.")
    @GetMapping("/findStudentByParent/{parentId}")
    public ResponseEntity<ResponseObject> findStudentByParent(@PathVariable Long parentId) {
        List<StudentResponse> students = studentService.findStudentByParent(parentId);
        if (!students.isEmpty()) {
            return ResponseEntity.ok(
                ResponseObject.builder()
                    .code("GET_SUCCESS")
                    .message("Found students")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .data(students)
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
