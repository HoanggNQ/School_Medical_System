package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.requests.VaccinationConsentRequestDTO;
import sms.swp391.models.dtos.responses.PaginatedContentResponse;
import sms.swp391.models.dtos.responses.PaginatedVaccinationConsentResponse;
import sms.swp391.models.dtos.responses.VaccinationConsentResponse;
import sms.swp391.models.dtos.responses.ResponseObject;
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
        if (parentId == null || !RoleEnum.PARENT.name().equals(parentId.getRoleName()) || parentId.getRoleName() == null ) {
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

    @Operation(summary = "Lấy danh sách tất cả consent kể cả đồng ý hay chưa theo campaign id")
    @GetMapping("/campaigns/{campaignId}/consents")
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

    @Operation(summary = "Lấy consent bất kể đồng ý hay chưa theo consent id", description = "Trả về chi tiết consent theo ID.")
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

    @Operation(summary = "Lấy danh sách consent đang chờ đồng ý theo parent id")
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

    @Operation(summary = "Lấy danh sách consent đã đồng ý theo parent id")
    @GetMapping("/parents/{parentId}/consents/approved")
    public ResponseEntity<ResponseObject> getApprovedConsentsByParent(@PathVariable Long parentId) {
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

    @Operation(summary = "Lấy tất cả consent mà phụ huynh đã đồng ý", description = "Trả về danh sách học sinh đồng ý với phân trang và tìm kiếm, sort mặc định là id." +
            " Sort(cần nhập đúng) bao gồm ")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(
            @RequestParam(value = "search", required = false) String search,
            @ParameterObject
            @PageableDefault(page = 0, size = 10)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "id", direction = Sort.Direction.ASC)
            }) Pageable pageable) {
        PaginatedVaccinationConsentResponse vaccinationConsentResponse = vaccinationService.getAllVaccinationConsents(search, pageable);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get all contents successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(vaccinationConsentResponse)
                        .build()
        );
    }

    @Operation(summary = "Lấy danh sách consent đã đồng ý theo campaign id", description = "Trả về danh sách consent đã đồng ý theo campaign id với phân trang và sắp xếp" +
            " bao gồm: id, responseDate, student.id, parent,userId.")
    @GetMapping("/campaigns/{campaignId}/consents/approved")
    public ResponseEntity<ResponseObject> getApprovedConsentsByCampaign(
            @PathVariable Long campaignId,
            @ParameterObject
            @PageableDefault(page = 0, size = 10)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "id", direction = Sort.Direction.ASC)
            }) Pageable pageable) {
        try {
            PaginatedVaccinationConsentResponse vaccinationConsentResponse = vaccinationService.getApprovedConsentsByCampaign(campaignId, pageable);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_APPROVED_CONSENTS_SUCCESS")
                            .message("Approved consents retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(vaccinationConsentResponse)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_APPROVED_CONSENTS_FAILED")
                            .message("Failed to get approved consents: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }
}