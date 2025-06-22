package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.MedicationRequestCreateDTO;
import sms.swp391.models.dtos.respones.MedicationRequestResponseDTO;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.services.MedicationRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medication-requests")
@RequiredArgsConstructor
public class MedicationRequestController {

    private final MedicationRequestService medicationRequestService;

    @Operation(summary = "Gửi yêu cầu sử dụng thuốc", description = "Phụ huynh gửi đơn xin sử dụng thuốc cho học sinh.")
    @PostMapping
    public ResponseEntity<ResponseObject> createRequest(@RequestBody @Valid MedicationRequestCreateDTO dto,
                                                        @AuthenticationPrincipal UserEntity currentUser) {
        try {
            MedicationRequestResponseDTO response = medicationRequestService.createRequest(dto,currentUser.getUserId());
            return ResponseEntity.ok(ResponseObject.builder()
                    .code("REQUEST_CREATED")
                    .message("Medication request submitted successfully.")
                    .status(HttpStatus.CREATED)
                    .isSuccess(true)
                    .data(response)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("REQUEST_CREATION_FAILED")
                            .message("Failed to submit medication request: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách yêu cầu thuốc đang chờ duyệt", description = "Nhân viên y tế xem các yêu cầu thuốc chưa được duyệt.")
    @GetMapping("/pending")
    public ResponseEntity<ResponseObject> getPendingRequests() {
        try {
            List<MedicationRequestResponseDTO> pending = medicationRequestService.getPendingRequests();
            return ResponseEntity.ok(ResponseObject.builder()
                    .code("FETCH_SUCCESS")
                    .message("Fetched pending requests successfully.")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .data(pending)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("FETCH_FAILED")
                            .message("Failed to fetch pending requests: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Phê duyệt yêu cầu thuốc", description = "Nhân viên y tế phê duyệt yêu cầu thuốc.")
    @PutMapping("/{id}/approve")
    public ResponseEntity<ResponseObject> approveRequest(@PathVariable Long id,
                                                         @AuthenticationPrincipal UserEntity currentUser) {
        try {
            medicationRequestService.approveRequest(id, currentUser.getUserId());
            return ResponseEntity.ok(ResponseObject.builder()
                    .code("REQUEST_APPROVED")
                    .message("Medication request approved successfully.")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("APPROVAL_FAILED")
                            .message("Failed to approve medication request: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Từ chối yêu cầu thuốc", description = "Nhân viên y tế từ chối yêu cầu thuốc.")
    @PutMapping("/{id}/reject")
    public ResponseEntity<ResponseObject> rejectRequest(@PathVariable Long id,
                                                        @AuthenticationPrincipal UserEntity currentUser) {
        try {
            medicationRequestService.rejectRequest(id, currentUser.getUserId());
            return ResponseEntity.ok(ResponseObject.builder()
                    .code("REQUEST_REJECTED")
                    .message("Medication request rejected successfully.")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("REJECT_FAILED")
                            .message("Failed to reject medication request: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Xem chi tiết yêu cầu thuốc", description = "Xem chi tiết yêu cầu thuốc theo ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getRequestById(@PathVariable Long id) {
        try {
            MedicationRequestResponseDTO request = medicationRequestService.getById(id);
            return ResponseEntity.ok(ResponseObject.builder()
                    .code("FETCH_SUCCESS")
                    .message("Fetched medication request successfully.")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .data(request)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("NOT_FOUND")
                            .message("Medication request not found: " + e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        }
    }
}
