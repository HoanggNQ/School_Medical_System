package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthConsultationScheduleRequestDTO;
import sms.swp391.models.dtos.responses.HealthConsultationScheduleResponseDTO;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.services.HealthConsultationScheduleService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/consultation-schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthConsultationScheduleController {

    private final HealthConsultationScheduleService scheduleService;

    @Operation(summary = "Tạo lịch tư vấn y tế", description = "Tạo mới một lịch hẹn tư vấn y tế cho học sinh.")
    @PostMapping
    public ResponseEntity<ResponseObject> create(@Valid @RequestBody HealthConsultationScheduleRequestDTO requestDTO) {
        HealthConsultationScheduleResponseDTO created = scheduleService.createSchedule(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Tạo lịch hẹn tư vấn thành công")
                        .status(HttpStatus.CREATED)
                        .isSuccess(true)
                        .data(created)
                        .build()
        );
    }

    @Operation(summary = "Lấy lịch tư vấn theo học sinh", description = "Trả về các lịch tư vấn theo studentId.")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ResponseObject> getByStudent(@PathVariable Long studentId) {
        List<HealthConsultationScheduleResponseDTO> list = scheduleService.getSchedulesByStudent(studentId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("FETCH_SUCCESS")
                        .message("Lấy danh sách lịch tư vấn thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(list)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật trạng thái lịch hẹn", description = "Chỉnh sửa trạng thái lịch hẹn tư vấn (PENDING, DONE, REJECTED).")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseObject> updateStatus(@PathVariable Long id, @RequestParam MedicalStatus status) {
        HealthConsultationScheduleResponseDTO updated = scheduleService.updateStatus(id, status);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Cập nhật trạng thái lịch tư vấn thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(updated)
                        .build()
        );
    }

    @Operation(summary = "Tìm kiếm lịch tư vấn", description = "Lọc và phân trang lịch tư vấn theo học sinh, trạng thái hoặc kết quả kiểm tra.")
    @GetMapping("/search")
    public ResponseEntity<ResponseObject> search(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long resultId,
            @RequestParam(required = false) MedicalStatus status,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<HealthConsultationScheduleResponseDTO> page = scheduleService.searchByFilters(studentId, resultId, status, pageable);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("SEARCH_SUCCESS")
                        .message("Tìm kiếm lịch tư vấn thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(page)
                        .build()
        );
    }
}
