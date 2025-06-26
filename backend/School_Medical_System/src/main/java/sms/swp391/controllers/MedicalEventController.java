package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.MedicalEventRequestDTO;
import sms.swp391.models.dtos.respones.MedicalEventResponse;
import sms.swp391.models.dtos.respones.PaginatedContentResponse;
import sms.swp391.models.dtos.respones.PaginatedMedicalEventResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.services.MedicalEventService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medical-event")
@RequiredArgsConstructor
public class MedicalEventController {

    private final MedicalEventService medicalEventService;

    @Operation(summary = "Tạo medical event", description = "Khởi tạo một medical event. status bao gồm PENDING, APPROVED, REJECTED, DONE")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> create(@RequestBody MedicalEventRequestDTO request) {
        MedicalEventResponse response = medicalEventService.create(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Medical event created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật medical event", description = "Chỉnh sửa thông tin medical event theo id. status bao gồm PENDING, APPROVED, REJECTED, DONE")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable Long id, @RequestBody MedicalEventRequestDTO request) {
        MedicalEventResponse response = medicalEventService.update(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Medical event updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa medical event", description = "Xóa medical event theo ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id) {
        medicalEventService.delete(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Medical event deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy medical event theo ID", description = "Trả về thông tin medical event theo ID.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getById(@PathVariable Long id) {
        MedicalEventResponse response = medicalEventService.getById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get medical event successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả medical event", description = "Trả về danh sách medical event với phân trang và tìm kiếm, sort mặc định là id." +
            " Sort(cần nhập đúng) bao gồm title, id, contentCategoryEntity.id, contentCategoryEntity.contentcategoryName")
    @GetMapping("/getAll/all")
    public ResponseEntity<ResponseObject> getAll(
            @RequestParam(value = "search", required = false) String search,
            @ParameterObject
            @PageableDefault(page = 0, size = 10)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "id", direction = Sort.Direction.ASC)
            }) Pageable pageable) {
        PaginatedMedicalEventResponse medicalEventResponse = medicalEventService.getAllMedicalEvents(search, pageable);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get all contents successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(medicalEventResponse)
                        .build()
        );
    }
}