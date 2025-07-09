package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.StudentRequest;
import sms.swp391.models.dtos.requests.StudentUpdateRequest;
import sms.swp391.models.dtos.responses.*;
import sms.swp391.services.HealthCheckCampaignService;
import sms.swp391.services.StudentService;
import org.springframework.data.domain.Sort;
import sms.swp391.utils.PageUtils;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final HealthCheckCampaignService healthCheckCampaignService;

    @Operation(summary = "Lấy các sự kiện học sinh đã được phụ huynh đồng ý tham gia")
    @GetMapping("/student/{studentId}/approved-events")
    public ResponseEntity<ResponseObject> getApprovedEventsByStudent(@PathVariable Long studentId) {
        List<ApprovedEventResponse> events = healthCheckCampaignService.getApprovedEventsByStudentId(studentId);

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_APPROVED_EVENTS_SUCCESS")
                        .message("Lấy danh sách sự kiện thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(events)
                        .build()
        );
    }

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

    @Operation(summary = "Lấy tất cả hồ sơ học sinh ACTIVE", description = "Trả về danh sách học sinh với phân trang và tìm kiếm, sort mặc định là studentCode, sort(cần nhập đúng) bao gồm." +
            " studentCode, createdAt, classEntity.id, id, updatedAt, user.userId, bloodType," +
            " geneticDiseases, allergies, chronicDiseases, height, weight, user.fullname, " +
            " user.gender, user.dob, user.username, classEntity.className")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(
            @RequestParam(value = "search", required = false) String search,
            @ParameterObject
            @PageableDefault(page = 0, size = 10)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "studentCode", direction = Sort.Direction.ASC)
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
    @GetMapping("/students/{studentId}/events")
    public ResponseEntity<ResponseObject> getEvents(
            @PathVariable Long studentId,
            @RequestParam(required = false, defaultValue = "") String campaignName,
            @ParameterObject @PageableDefault(size = 10, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {


        Page<StudentHealthEventResponseDTO> page =
                studentService.getPagedEvents(studentId, campaignName,pageable);

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_EVENTS_SUCCESS")
                        .message("Lấy sự kiện thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(PageUtils.toPagedResponse(page))
                        .build()
        );
    }

    @Operation(summary = "Import danh sách học sinh từ file Excel", description = "Cho phép import học sinh từ file Excel (.xlsx)")
    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> importStudents(@RequestParam("file") MultipartFile file) {
        return studentService.importStudentsFromExcel(file);
    }
}
