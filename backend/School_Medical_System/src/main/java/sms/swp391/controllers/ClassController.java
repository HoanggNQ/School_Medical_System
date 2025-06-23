package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.ClassCreateDTO;
import sms.swp391.models.dtos.respones.ClassResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.entities.ClassEntity;
import sms.swp391.services.ClassService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/class")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @Operation(summary = "Tạo class", description = "Khởi tạo một class.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createClass(@RequestBody ClassCreateDTO request) {
        ClassEntity entity = ClassEntity.builder()
                .className(request.getClassName())
                .grade(request.getGrade())
                .totalstudent(request.getTotalstudent())
                .build();
        ClassResponse response = classService.createClass(entity);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Class created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật class", description = "Chỉnh sửa thông tin class.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateClass(@PathVariable Long id, @RequestBody ClassCreateDTO request) {
        ClassEntity entity = ClassEntity.builder()
                .className(request.getClassName())
                .grade(request.getGrade())
                .totalstudent(request.getTotalstudent())
                .build();
        ClassResponse response = classService.updateClass(id, entity);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Class updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa một class", description = "Xóa class theo ID nếu totalStudent bằng 0.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Class deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả class", description = "Trả về danh sách các class")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllClasses() {
        List<ClassResponse> classes = classService.getAllClasses();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all classes successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(classes)
                        .build()
        );
    }

    @Operation(summary = "Lấy class theo id", description = "Trả về thông tin class theo id.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getClassById(@PathVariable Long id) {
        ClassResponse response = classService.getClassById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get class successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }
}