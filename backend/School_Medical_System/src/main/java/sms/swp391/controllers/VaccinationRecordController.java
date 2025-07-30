package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.enums.RoleEnum;
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
import sms.swp391.services.VaccinationService;
import sms.swp391.utils.ExcelExporter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/vaccination-record")
@RequiredArgsConstructor
public class VaccinationRecordController {
    private final VaccinationService vaccinationService;
    private final VaccinationConsentRepository vaccinationConsentRepository;
    private final VaccinationCampaignRepository vaccinationCampaignRepository;
    @GetMapping("/consent/{consentId}")
    public ResponseEntity<ResponseObject> getConsentById(@PathVariable Long consentId) {
        VaccinationRecordResponse result = vaccinationService.getRecordbyConsentId(consentId);

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_RESULT_SUCCESS")
                        .message("Result retrieved successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(result)
                        .build()
        );
    }

    @Operation(
            summary = "Nhập kết quả tiêm chủng từ file Excel",
            description = "Nhập nhiều kết quả tiêm chủng từ file Excel."
    )
    @PostMapping(
            path = "/vaccination-records/import",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Transactional
    public ResponseEntity<ResponseObject> importVaccinationRecords(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserEntity nurse) {

        if (nurse == null) {
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
            List<VaccinationRecordRequestDTO> recordDTOs =
                    ExcelExporter.parseVaccinationRecordsFromExcel(file.getInputStream());

            if (recordDTOs.isEmpty()) {
                throw new BusinessException("File không có dữ liệu.");
            }

            Long campaignId = recordDTOs.get(0).getCampaignId();

            CreateVaccinationRecordListRequestDTO request = CreateVaccinationRecordListRequestDTO.builder()
                    .campaignId(campaignId)
                    .records(recordDTOs)
                    .build();

            List<VaccinationRecordResponse> responses =
                    vaccinationService.createBulkRecords(request, nurse.getUserId());

            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("IMPORT_VACCINATION_SUCCESS")
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


    @Operation(summary = "Xuất danh sách học sinh đủ điều kiện ghi kết quả khám sức khỏe", description = "Xuất danh sách học sinh đủ điều kiện ghi kết quả khám sức khỏe dưới dạng file Excel.")
    @Transactional
    @GetMapping("/list-results-export")
    public ResponseEntity<?> exportEligibleVaccinationStudents(@RequestParam Long campaignId) {

        VaccinationCampaignEntity campaign = vaccinationCampaignRepository.findById(campaignId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy chiến dịch "));

        List<VaccinationConsentEntity> consents = vaccinationConsentRepository
                .findByVaccinationCampaignIdAndConsentStatusAndVaccinationCampaignStatus(
                        campaignId, MedicalStatus.APPROVED, MedicalStatus.APPROVED
                );

        if (consents.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("NO_ELIGIBLE_STUDENTS")
                            .message("Không có học sinh nào đủ điều kiện tiêm trong chiến dịch này.")
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }

        try (ByteArrayInputStream stream = ExcelExporter.exportEligibleStudentsForVaccination(consents)) {
            byte[] fileBytes = stream.readAllBytes();


            String filename = "Vaccination_" + campaignId + ".xlsx";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(fileBytes);
        } catch (IOException e) {
            throw new RuntimeException("Không thể export danh sách đủ điều kiện tiêm: " + e.getMessage(), e);
        }
    }





    @Operation(summary = "Lưu kết quả tiêm chủng hàng loạt", description = "Lưu nhiều kết quả tiêm chủng cùng lúc.")
    @PostMapping("/records/bulk")
    public ResponseEntity<ResponseObject> createBulkVaccinationRecords(
            @Valid @RequestBody CreateVaccinationRecordListRequestDTO request,
            @AuthenticationPrincipal UserEntity nurse) {

        List<VaccinationRecordResponse> saved = vaccinationService.createBulkRecords(request, nurse.getUserId());

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("IMPORT_SUCCESS")
                        .message("Đã lưu " + saved.size() + " bản ghi tiêm chủng.")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(saved)
                        .build()
        );
    }


    @Operation(summary = "Lưu kết quả tiêm vaccine", description = "Lưu kết quả tiêm vaccine cho học sinh kèm theo ID của người thực hiện.")
    @PostMapping("/records")
    public ResponseEntity<ResponseObject> saveRecord(
            @RequestBody VaccinationRecordRequestDTO request,
            @AuthenticationPrincipal UserEntity checkedById) {
        if (checkedById == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("UNAUTHORIZED")
                            .message("Hãy đăng nhập bằng tài khoản nurse")
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
        try {
            VaccinationRecordResponse response = vaccinationService.saveRecord(request, checkedById.getUserId());
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("SAVE_RECORD_SUCCESS")
                            .message("Record saved successfully")
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
                            .code("SAVE_RECORD_FAILED")
                            .message("Failed to save record: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy kết quả tiêm vaccine theo ID", description = "Trả về kết quả tiêm vaccine chi tiết theo ID.")
    @GetMapping("/records/{id}")
    public ResponseEntity<ResponseObject> getRecordById(@PathVariable Long id) {
        try {
            VaccinationRecordResponse response = vaccinationService.getRecordById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_RECORD_SUCCESS")
                            .message("Record retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("RECORD_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_RECORD_FAILED")
                            .message("Failed to get record: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách kết quả theo chiến dịch", description = "Trả về danh sách các kết quả tiêm vaccine của một chiến dịch cụ thể.")
    @GetMapping("/campaigns/{campaignId}/records")
    public ResponseEntity<ResponseObject> getRecordsByCampaign(@PathVariable Long campaignId) {
        try {
            List<VaccinationRecordResponse> responses = vaccinationService.getRecordsByCampaign(campaignId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_RECORDS_SUCCESS")
                            .message("Records retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_RECORDS_FAILED")
                            .message("Failed to get records: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách kết quả theo học sinh", description = "Trả về tất cả kết quả tiêm vaccine của một học sinh theo ID.")
    @GetMapping("/students/{studentId}/records")
    public ResponseEntity<ResponseObject> getRecordsByStudent(@PathVariable Long studentId) {
        try {
            List<VaccinationRecordResponse> responses = vaccinationService.getRecordsByStudent(studentId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_RECORDS_SUCCESS")
                            .message("Records retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_RECORDS_FAILED")
                            .message("Failed to get records: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }


}