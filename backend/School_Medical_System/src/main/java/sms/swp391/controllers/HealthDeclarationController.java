package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.enums.HealthDeclarationStatus;
import sms.swp391.models.dtos.requests.HealthDeclarationCreateDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.HealthDeclarationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/health-declarations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthDeclarationController {

    private final HealthDeclarationService healthDeclarationService;

    @Operation(summary = "Tạo khai báo y tế", description = "Phụ huynh gửi thông tin khai báo y tế cho học sinh trong một năm học cụ thể.")
    @PostMapping
    public ResponseEntity<ResponseObject> create(@Valid @RequestBody HealthDeclarationCreateDTO createDTO) {
        try {
            HealthDeclarationResponseDTO created = healthDeclarationService.create(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ResponseObject.builder()
                            .code("CREATE_SUCCESS")
                            .message("Health declaration created successfully")
                            .status(HttpStatus.CREATED)
                            .isSuccess(true)
                            .data(created)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("RESOURCE_NOT_FOUND")
                            .message("Resource not found: " + e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("INVALID_REQUEST")
                            .message("Invalid request: " + e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                            .code("DATA_CONFLICT")
                            .message("Data conflict: Health declaration may already exist for this student and academic year")
                            .status(HttpStatus.CONFLICT)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("CREATE_FAILED")
                            .message("Failed to create health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Cập nhật khai báo y tế", description = "Chỉnh sửa thông tin khai báo y tế của học sinh theo ID.")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(
            @PathVariable Long id,
            @Valid @RequestBody HealthDeclarationUpdateDTO updateDTO) {
        try {
            HealthDeclarationResponseDTO updated = healthDeclarationService.update(id, updateDTO);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("UPDATE_SUCCESS")
                            .message("Update health declaration successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(updated)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("UPDATE_FAILED")
                            .message("Failed to update health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Xoá khai báo y tế", description = "Xoá khai báo y tế dựa trên ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id) {
        try {
            healthDeclarationService.delete(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("DELETE_SUCCESS")
                            .message("Delete health declaration successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(null)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("DELETE_FAILED")
                            .message("Failed to delete health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy chi tiết khai báo y tế theo ID", description = "Lấy đầy đủ thông tin khai báo y tế bao gồm thông tin người khai báo và học sinh.")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getByIdWithDetails(@PathVariable Long id) {
        try {
            Optional<HealthDeclarationResponseDTO> declaration = healthDeclarationService.getByIdWithDetails(id);
            if (declaration.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ResponseObject.builder()
                                .code("NOT_FOUND")
                                .message("Health declaration not found with id: " + id)
                                .status(HttpStatus.NOT_FOUND)
                                .isSuccess(false)
                                .data(null)
                                .build()
                );
            }
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get health declaration details successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(declaration.get())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_FAILED")
                            .message("Failed to get health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách khai báo y tế theo học sinh", description = "Trả về danh sách tất cả các khai báo y tế của một học sinh.")
    @GetMapping("/student/{studentId}/details")
    public ResponseEntity<ResponseObject> getByStudentIdWithDetails(@PathVariable Long studentId) {
        try {
            List<HealthDeclarationResponseDTO> declarations = healthDeclarationService.getByStudentIdWithDetails(studentId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get health declarations with details successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(declarations)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_FAILED")
                            .message("Failed to get health declarations: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách khai báo y tế theo người khai báo", description = "Trả về danh sách các khai báo y tế được gửi bởi người dùng cụ thể (ví dụ phụ huynh).")
    @GetMapping("/declared-by/{declaredById}/details")
    public ResponseEntity<ResponseObject> getByDeclaredByUserIdWithDetails(@PathVariable Long declaredById) {
        try {
            List<HealthDeclarationResponseDTO> declarations = healthDeclarationService.getByDeclaredByUserIdWithDetails(declaredById);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get health declarations with details successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(declarations)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_FAILED")
                            .message("Failed to get health declarations: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Kiểm tra khai báo y tế đã tồn tại", description = "Kiểm tra xem học sinh đã có khai báo y tế cho năm học cụ thể chưa.")
    @GetMapping("/exists")
    public ResponseEntity<ResponseObject> existsByStudentIdAndAcademicYear(
            @RequestParam Long studentId,
            @RequestParam String academicYear) {
        try {
            boolean exists = healthDeclarationService.existsByStudentIdAndAcademicYear(studentId, academicYear);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("CHECK_SUCCESS")
                            .message("Check health declaration existence successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(exists)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("CHECK_FAILED")
                            .message("Failed to check health declaration existence: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Tìm kiếm khai báo y tế", description = "Lọc và phân trang danh sách khai báo y tế theo trạng thái, học sinh, người khai báo, và năm học.")
    @GetMapping("/search")
    public ResponseEntity<ResponseObject> searchByFilters(
            @RequestParam(required = false) HealthDeclarationStatus status,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long declaredById,
            @RequestParam(required = false) String academicYear,
            @PageableDefault(size = 10) Pageable pageable) {
        try {
            Page<HealthDeclarationResponseDTO> declarations = healthDeclarationService.searchByFilters(
                    status, studentId, declaredById, academicYear, pageable);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("SEARCH_SUCCESS")
                            .message("Search health declarations successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(declarations)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("SEARCH_FAILED")
                            .message("Failed to search health declarations: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Operation(summary = "Cập nhật trạng thái khai báo y tế", description = "Thay đổi trạng thái của khai báo y tế (VD: PENDING, APPROVED, REJECTED).")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseObject> updateStatus(
            @PathVariable Long id,
            @RequestParam HealthDeclarationStatus status) {
        try {
            HealthDeclarationResponseDTO updated = healthDeclarationService.updateStatus(id, status);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("UPDATE_SUCCESS")
                            .message("Update health declaration status successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(updated)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("UPDATE_FAILED")
                            .message("Failed to update health declaration status: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }
}
