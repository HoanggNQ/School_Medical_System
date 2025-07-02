package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.responses.*;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.VaccinationService;

import java.util.List;

@RestController
@RequestMapping("/api/vaccination-record")
@RequiredArgsConstructor
public class VaccinationRecordController {
    private final VaccinationService vaccinationService;

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