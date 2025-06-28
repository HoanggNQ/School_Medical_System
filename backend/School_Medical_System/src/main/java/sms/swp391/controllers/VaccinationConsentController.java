package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.VaccinationConsentRequestDTO;
import sms.swp391.models.dtos.respones.VaccinationConsentResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.VaccinationService;

import java.util.List;

@RestController
@RequestMapping("/api/vaccination-consent")
@RequiredArgsConstructor
public class VaccinationConsentController {
    private final VaccinationService vaccinationService;

    @Operation(summary = "Cập nhật đồng ý khám tiêm vaccine", description = "Phụ huynh xác nhận hoặc từ chối đồng ý cho con em tham gia chiến dịch tiêm vaccine.")
    @PutMapping("/consents/{id}")
    public ResponseEntity<ResponseObject> updateConsent(
            @PathVariable Long id,
            @RequestBody VaccinationConsentRequestDTO request,
            @AuthenticationPrincipal UserEntity parentId) {
        try {
            VaccinationConsentResponse response = vaccinationService.updateConsent(id, request, parentId.getUserId());
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("UPDATE_CONSENT_SUCCESS")
                            .message("Consent updated successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("CONSENT_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (AuthFailedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .code("AUTH_FAILED")
                            .message(e.getMessage())
                            .status(HttpStatus.FORBIDDEN)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("UPDATE_CONSENT_FAILED")
                            .message("Failed to update consent: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách đồng ý theo chiến dịch (đang chờ)", description = "Trả về danh sách các đồng ý tiêm vaccine đang ở trạng thái chờ theo chiến dịch.")
    @GetMapping("/campaigns/{campaignId}/consents/pending")
    public ResponseEntity<ResponseObject> getConsentsByCampaign(@PathVariable Long campaignId) {
        try {
            List<VaccinationConsentResponse> responses = vaccinationService.getConsentsByCampaign(campaignId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_CONSENTS_SUCCESS")
                            .message("Consents retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_CONSENTS_FAILED")
                            .message("Failed to get consents: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy đồng ý tiêm vaccine theo ID", description = "Trả về chi tiết đồng ý tiêm vaccine theo ID.")
    @GetMapping("/consents/{id}")
    public ResponseEntity<ResponseObject> getConsentById(@PathVariable Long id) {
        try {
            VaccinationConsentResponse response = vaccinationService.getConsentById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_CONSENT_SUCCESS")
                            .message("Consent retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("CONSENT_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_CONSENT_FAILED")
                            .message("Failed to get consent: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách đồng ý đang chờ của phụ huynh", description = "Trả về các đơn đồng ý khám của phụ huynh đang ở trạng thái chờ.")
    @GetMapping("/parents/{parentId}/consents/pending")
    public ResponseEntity<ResponseObject> getPendingConsentsByParent(@PathVariable Long parentId) {
        try {
            List<VaccinationConsentResponse> responses = vaccinationService.getPendingConsentsByParent(parentId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_PENDING_CONSENTS_SUCCESS")
                            .message("Pending consents retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_PENDING_CONSENTS_FAILED")
                            .message("Failed to get pending consents: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy danh sách đã đồng ý của phụ huynh", description = "Trả về các đơn đồng ý khám của phụ huynh đang ở trạng thái đồng ý.")
    @GetMapping("/parents/{parentId}/consents/approved")
    public ResponseEntity<ResponseObject> getPendingConsentsApprovedByParent(@PathVariable Long parentId) {
        try {
            List<VaccinationConsentResponse> responses = vaccinationService.getPendingConsentsApprovedByParent(parentId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_PENDING_CONSENTS_SUCCESS")
                            .message("Pending consents retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_PENDING_CONSENTS_FAILED")
                            .message("Failed to get pending consents: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }
}