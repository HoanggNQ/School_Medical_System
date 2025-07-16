package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.ConfirmScheduleRequestDTO;
import sms.swp391.models.dtos.requests.HealthConsultationScheduleRequestDTO;
import sms.swp391.models.dtos.responses.HealthConsultationScheduleResponseDTO;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.HealthConsultationScheduleService;
import sms.swp391.utils.PageUtils;

import java.util.List;

@RestController
@RequestMapping("/api/v1/consultation-schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthConsultationScheduleController {

    private final HealthConsultationScheduleService scheduleService;
    @Operation(summary = "Lấy chi tiết lịch tư vấn", description = "Trả về chi tiết lịch tư vấn theo ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getById(@PathVariable Long id) {
        try {
            HealthConsultationScheduleResponseDTO dto = scheduleService.getById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("FETCH_SUCCESS")
                            .message("Lấy chi tiết lịch tư vấn thành công")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(dto)
                            .build()
            );
        } catch (NotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("NOT_FOUND")
                            .message(ex.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Tạo lịch tư vấn y tế", description = "Tạo mới một lịch hẹn tư vấn y tế cho học sinh.")
    @PostMapping
    public ResponseEntity<ResponseObject> create(@Valid @RequestBody HealthConsultationScheduleRequestDTO requestDTO , @AuthenticationPrincipal UserEntity currentUser
    ) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("UNAUTHORIZED")
                            .message("Hãy đăng nhập bằng tài khoản nurse ")
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
        HealthConsultationScheduleResponseDTO created = scheduleService.createSchedule(requestDTO, currentUser.getUserId());
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
    @GetMapping("/parent/{parent_Id}")
    public ResponseEntity<ResponseObject> getByParent(@PathVariable Long parent_Id) {
        List<HealthConsultationScheduleResponseDTO> list = scheduleService.getSchedulesByParent(parent_Id);
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
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmConsultationSchedule(@RequestBody ConfirmScheduleRequestDTO request) {
        HealthConsultationScheduleResponseDTO response = scheduleService
                .confirmConsultationSchedule(request.getStudentId(), request.getCampaignId());
        return ResponseEntity.ok(response);
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

    @Operation(summary = "Cập nhật trạng thái lịch hẹn và điền lý do", description = "Chỉnh sửa trạng thái lịch hẹn tư vấn (DONE, REJECTED).")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseObject> updateStatus(@PathVariable Long id, @RequestParam MedicalStatus status,
                                                       @RequestParam(required = false) String note) {
        HealthConsultationScheduleResponseDTO updated = scheduleService.updateStatus(id, status, note);
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
            @ParameterObject
            @PageableDefault(size = 10,
                    sort = "scheduleTime",
                    direction = Sort.Direction.DESC) Pageable pageable) {

        Page<HealthConsultationScheduleResponseDTO> page =
                scheduleService.searchByFilters(studentId, resultId, status, pageable);

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("SEARCH_SUCCESS")
                        .message("Tìm kiếm lịch tư vấn thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(PageUtils.toPagedResponse(page))   // ⚠️ wrap
                        .build());
    }
}
