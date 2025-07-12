package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.requests.MedicationRequestCreateDTO;
import sms.swp391.models.dtos.responses.MedicationRequestResponseDTO;
import sms.swp391.models.dtos.responses.PagedResponse;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.services.MedicationRequestService;
import org.springframework.data.domain.*;

import java.util.ArrayList;
import java.util.Arrays;
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
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("UNAUTHORIZED")
                            .message("Hãy đăng nhập bằng tài khoản PARENT")
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
        try {
            MedicationRequestResponseDTO response = medicationRequestService.createRequest(dto, currentUser.getUserId());
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

    @Operation(summary = "Lấy danh sách yêu cầu thuốc đang từ chối", description = "Nhân viên y tế xem các yêu cầu thuốc từ chối.")
    @GetMapping("/reject")
    public ResponseEntity<ResponseObject> getRejectRequests() {
        try {
            List<MedicationRequestResponseDTO> pending = medicationRequestService.getRejectRequests();
            return ResponseEntity.ok(ResponseObject.builder()
                    .code("FETCH_SUCCESS")
                    .message("Fetched Reject requests successfully.")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .data(pending)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("FETCH_FAILED")
                            .message("Failed to fetch Reject requests: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách yêu cầu thuốc đã duyệt", description = "Nhân viên y tế xem các yêu cầu thuốc đã được duyệt.")
    @GetMapping("/approve")
    public ResponseEntity<ResponseObject> getApproveRequests() {
        try {
            List<MedicationRequestResponseDTO> pending = medicationRequestService.getApproveRequests();
            return ResponseEntity.ok(ResponseObject.builder()
                    .code("FETCH_SUCCESS")
                    .message("Fetched pending Approve successfully.")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .data(pending)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("FETCH_FAILED")
                            .message("Failed to fetch Approve requests: " + e.getMessage())
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

    @Operation(summary = "Hoàn thành yêu cầu thuốc", description = "Nhân viên y tế dã Hoàn thành yêu cầu thuốc.")
    @PutMapping("/{id}/done")
    public ResponseEntity<ResponseObject> doneRequest(@PathVariable Long id,
                                                      @AuthenticationPrincipal UserEntity currentUser) {
        try {
            medicationRequestService.doneRequest(id, currentUser.getUserId());
            return ResponseEntity.ok(ResponseObject.builder()
                    .code("REQUEST_done")
                    .message("Medication request done successfully.")
                    .status(HttpStatus.OK)
                    .isSuccess(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("REJECT_done")
                            .message("Failed to done medication request: " + e.getMessage())
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

    @Operation(summary = "Lấy tất cả yêu cầu thuốc")

    @GetMapping
    public ResponseEntity<ResponseObject> getAllRequests(
            @ParameterObject
            @PageableDefault(sort = "requestDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        Page<MedicationRequestResponseDTO> page = medicationRequestService.getAllRequests(pageable);

        PagedResponse<MedicationRequestResponseDTO> response = PagedResponse.<MedicationRequestResponseDTO>builder()
                .content(page.getContent())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("REQUEST_LIST")
                        .message("Lấy danh sách yêu cầu thuốc thành công.")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build());
    }
    @Operation(summary = "Lấy danh sách yêu cầu thuốc của phụ huynh hiện tại", description = "Phụ huynh xem các yêu cầu thuốc mà mình đã gửi.")
    @GetMapping("/my-requests")
    public ResponseEntity<ResponseObject> getRequestsByParent(@AuthenticationPrincipal UserEntity currentUser) {
        if (currentUser == null || currentUser.getRoleName() != RoleEnum.PARENT) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("UNAUTHORIZED")
                            .message("Bạn cần đăng nhập với tư cách phụ huynh.")
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .build()
            );
        }

        try {
            List<MedicationRequestResponseDTO> requests = medicationRequestService.getRequestsByParentId(currentUser.getUserId());
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("FETCH_SUCCESS")
                            .message("Lấy danh sách yêu cầu thuốc của phụ huynh thành công.")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(requests)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("FETCH_FAILED")
                            .message("Lỗi khi lấy danh sách yêu cầu: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

//    @GetMapping
//    public ResponseEntity<ResponseObject> getAllRequests(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(defaultValue = "requestDate,desc") String[] sort) {
//
//        List<Sort.Order> orders = new ArrayList<>();
//
//        for (String sortParam : sort) {
//            String[] parts = sortParam.split(",");
//            String property = parts[0];
//            Sort.Direction direction = parts.length > 1
//                    ? Sort.Direction.fromString(parts[1])
//                    : Sort.Direction.ASC;
//            orders.add(new Sort.Order(direction, property));
//        }
//
//        Pageable pageable = PageRequest.of(page, size, Sort.by(orders));
//        Page<MedicationRequestResponseDTO> result = medicationRequestService.getAllRequests(pageable);
//
//        return ResponseEntity.ok(
//                ResponseObject.builder()
//                        .code("REQUEST_LIST")
//                        .message("Lấy danh sách yêu cầu thuốc thành công.")
//                        .status(HttpStatus.OK)
//                        .isSuccess(true)
//                        .data(result)
//                        .build()
//        );
//    }
}
