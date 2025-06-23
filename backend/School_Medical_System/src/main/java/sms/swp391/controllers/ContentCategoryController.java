package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.ContentCategoryRequestDTO;
import sms.swp391.models.dtos.respones.ContentCategoryResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.services.ContentCategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content-category")
@RequiredArgsConstructor
public class ContentCategoryController {
    private final ContentCategoryService service;

    @Operation(summary = "Tạo category", description = "Khởi tạo một category mới")
    @PostMapping
    public ResponseEntity<ResponseObject> create(@RequestBody ContentCategoryRequestDTO request) {
        ContentCategoryResponse response = service.create(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Content category created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật category", description = "Chỉnh sửa thông tin category theo id")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable Long id, @RequestBody ContentCategoryRequestDTO request) {
        ContentCategoryResponse response = service.update(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Content category updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa category", description = "Xóa category theo ID nếu không có category id đó trong content.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Content category deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy category theo ID", description = "Trả về thông tin category theo ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getById(@PathVariable Long id) {
        ContentCategoryResponse response = service.getById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get content category successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả category", description = "Trả về danh sách category")
    @GetMapping
    public ResponseEntity<ResponseObject> getAll() {
        List<ContentCategoryResponse> list = service.getAll();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all content categories successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(list)
                        .build()
        );
    }
}