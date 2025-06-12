package sms.swp391.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.enums.HealthDeclarationStatus;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.services.HealthDeclarationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/health-declarations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthDeclarationController {

    private final HealthDeclarationService healthDeclarationService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ResponseObject> getByStudentId(@PathVariable Long studentId) {
        try {
            List<HealthDeclarationResponseDTO> declarations = healthDeclarationService.getByStudentId(studentId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get health declarations by student successfully")
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

    @GetMapping("/declared-by/{userId}")
    public ResponseEntity<ResponseObject> getByDeclaredById(@PathVariable Long userId) {
        try {
            List<HealthDeclarationResponseDTO> declarations = healthDeclarationService.getByDeclaredById(userId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get health declarations by declared user successfully")
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

    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseObject> getByStatus(
            @PathVariable HealthDeclarationStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        try {
            Page<HealthDeclarationResponseDTO> declarations = healthDeclarationService.getByStatus(status, pageable);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get health declarations by status successfully")
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

    @GetMapping
    public ResponseEntity<ResponseObject> getAll(@PageableDefault(size = 10) Pageable pageable) {
        try {
            Page<HealthDeclarationResponseDTO> declarations = healthDeclarationService.getAll(pageable);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get all health declarations successfully")
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

    @PostMapping
    public ResponseEntity<ResponseObject> create(@Valid @RequestBody HealthDeclarationResponseDTO responseDTO) {
        try {
            responseDTO.setId(null); // Đảm bảo ID null cho tạo mới
            HealthDeclarationResponseDTO created = healthDeclarationService.save(responseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ResponseObject.builder()
                            .code("CREATE_SUCCESS")
                            .message("Create health declaration successfully")
                            .status(HttpStatus.CREATED)
                            .isSuccess(true)
                            .data(created)
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

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(
            @PathVariable Long id,
            @Valid @RequestBody HealthDeclarationResponseDTO responseDTO) {
        try {
            responseDTO.setId(id); // Đảm bảo ID khớp với path variable
            HealthDeclarationResponseDTO updated = healthDeclarationService.save(responseDTO);
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

    @GetMapping("/student/{studentId}/latest")
    public ResponseEntity<ResponseObject> getLatestByStudentId(@PathVariable Long studentId) {
        try {
            List<HealthDeclarationResponseDTO> declarations = healthDeclarationService.getByStudentIdWithDetails(studentId);
            if (declarations.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ResponseObject.builder()
                                .code("NOT_FOUND")
                                .message("No health declaration found for student: " + studentId)
                                .status(HttpStatus.NOT_FOUND)
                                .isSuccess(false)
                                .data(null)
                                .build()
                );
            }
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get latest health declaration successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(declarations.get(0))
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_FAILED")
                            .message("Failed to get latest health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseObject> updateStatus(
            @PathVariable Long id,
            @RequestParam HealthDeclarationStatus status) {
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

            HealthDeclarationResponseDTO dto = declaration.get();
            dto.setStatus(status);
            HealthDeclarationResponseDTO updated = healthDeclarationService.save(dto);

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