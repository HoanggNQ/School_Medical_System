package sms.swp391.controllers;


import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.responses.*;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.HealthCheckCampaignRepository;
import sms.swp391.repositories.HealthCheckConsentRepository;
import sms.swp391.repositories.VaccinationCampaignRepository;
import sms.swp391.repositories.VaccinationConsentRepository;
import sms.swp391.services.HealthCheckResultService;
import sms.swp391.utils.ExcelExporter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/health-check-result")
@RequiredArgsConstructor
public class HealthCheckResultController {
    private final HealthCheckResultService healthCheckService;
    private final HealthCheckCampaignRepository healthCheckCampaignRepository;
    private final HealthCheckConsentRepository healthCheckConsentRepository;

    @Operation(summary = "Nhập kết quả khám sức khỏe từ file Excel", description = "Nhập nhiều kết quả khám sức khỏe từ file Excel.")
    @Transactional
    @PostMapping(
            path = "/import",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseObject> importResults(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserEntity checkedById) {

        if (checkedById == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("UNAUTHORIZED")
                            .message("Hãy đăng nhập bằng tài khoản nurse.")
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }

        try {
            List<HealthCheckResultRequestDTO> resultDTOs = ExcelExporter.parseHealthCheckResultsFromExcel(file.getInputStream());

            if (resultDTOs.isEmpty()) {
                throw new BusinessException("File không có dữ liệu.");
            }

            Long campaignId = resultDTOs.get(0).getCampaignId(); // giả định tất cả cùng campaign

            CreateHealthCheckResultListRequestDTO dto = new CreateHealthCheckResultListRequestDTO();
            dto.setCampaignId(campaignId);
            dto.setResults(resultDTOs);

            List<HealthCheckResultResponse> responses = healthCheckService.createBulkResults(dto, checkedById.getUserId());

            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("IMPORT_RESULT_SUCCESS")
                            .message("Đã nhập thành công " + responses.size() + " kết quả từ file.")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );

        } catch (BusinessException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("IMPORT_FAILED")
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .build()
            );
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("FILE_READ_ERROR")
                            .message("Không thể đọc file Excel: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("IMPORT_UNKNOWN_ERROR")
                            .message("Lỗi không xác định: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Export danh sách học sinh đủ điều kiện tiêm chủng")
    @Transactional
    @GetMapping("/list-results-export")
    public ResponseEntity<?> exportEligibleStudents(@RequestParam Long campaignId) {
        HealthCheckCampaignEntity campaign = healthCheckCampaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy chiến dịch khám sức khỏe"));

        List<HealthCheckConsentEntity> consents = healthCheckConsentRepository.findEligibleStudents(campaignId);
        if (consents.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("NO_ELIGIBLE_STUDENTS")
                            .message("Không có học sinh nào đủ điều kiện ghi kết quả trong chiến dịch này.")
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }

        try (ByteArrayInputStream in = ExcelExporter.exportEligibleStudentsForResult(consents)) {
            byte[] content = in.readAllBytes();

            String filename = "HealthCheck_Id_" + campaignId + ".xlsx";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(content);
        } catch (IOException e) {
            throw new RuntimeException("Không thể xuất file Excel: " + e.getMessage(), e);
        }
    }
    @Operation(summary = "Lưu kết quả khám sức khỏe hàng loạt", description = "Lưu nhiều kết quả khám sức khỏe cùng lúc.")
    @PostMapping("/results/bulk")
    public ResponseEntity<ResponseObject> createBulkResults(
            @Valid @RequestBody CreateHealthCheckResultListRequestDTO request,
            @AuthenticationPrincipal UserEntity checkedById) {

        if (checkedById == null) {
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

        List<HealthCheckResultResponse> saved = healthCheckService.createBulkResults(request, checkedById.getUserId());

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("SAVE_BULK_RESULT_SUCCESS")
                        .message("Đã lưu " + saved.size() + " kết quả")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(saved)
                        .build()
        );
    }

    @Operation(summary = "Lưu kết quả khám sức khỏe", description = "Lưu kết quả khám sức khỏe cho học sinh kèm theo ID của người thực hiện.")
    @PostMapping("/results")
    public ResponseEntity<ResponseObject> saveResult(
            @RequestBody HealthCheckResultRequestDTO request,
            @AuthenticationPrincipal UserEntity checkedById) {

        if (checkedById == null) {
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
        try {
            HealthCheckResultResponse response = healthCheckService.saveResult(request, checkedById.getUserId());
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("SAVE_RESULT_SUCCESS")
                            .message("Result saved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (BusinessException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("CONSENT_NOT_APPROVED")
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("SAVE_RESULT_FAILED")
                            .message("Failed to save result: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy kết quả khám theo ID", description = "Trả về kết quả khám sức khỏe chi tiết theo ID.")

    @GetMapping("/results/{id}")
    public ResponseEntity<ResponseObject> getResultById(@PathVariable Long id) {
        try {
            HealthCheckResultResponse response = healthCheckService.getResultById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_RESULT_SUCCESS")
                            .message("Result retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("RESULT_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_RESULT_FAILED")
                            .message("Failed to get result: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách kết quả theo chiến dịch", description = "Trả về danh sách các kết quả khám của một chiến dịch cụ thể.")

    @GetMapping("/campaigns/{campaignId}/results")
    public ResponseEntity<ResponseObject> getResultsByCampaign(@PathVariable Long campaignId) {
        try {
            List<HealthCheckResultResponse> responses = healthCheckService.getResultsByCampaign(campaignId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_RESULTS_SUCCESS")
                            .message("Results retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("GET_RESULTS_FAILED")
                            .message("Failed to get results: " + e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách kết quả theo học sinh", description = "Trả về tất cả kết quả khám sức khỏe của một học sinh theo ID.")

    @GetMapping("/students/{studentId}/results")
    public ResponseEntity<ResponseObject> getResultsByStudent(@PathVariable Long studentId) {
        try {
            List<HealthCheckResultResponse> responses = healthCheckService.getResultsByStudent(studentId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_RESULTS_SUCCESS")
                            .message("Results retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("GET_RESULTS_FAILED")
                            .message("Failed to get results: " + e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        }
    }
}
