package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
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
import sms.swp391.models.dtos.requests.HealthCheckCampaignRequestDTO;
import sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO;
import sms.swp391.models.dtos.responses.HealthCheckCampaignResponse;
import sms.swp391.models.dtos.responses.PaginatedHealthCheckConsentResponse;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.HealthCheckCampaignService;
import sms.swp391.services.HealthCheckConsentService;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/health-check-campaign")
@RequiredArgsConstructor
public class HealthCheckCampaignController {
    private final HealthCheckCampaignService healthCheckService;
    private final HealthCheckConsentService healthCheckConsentService;
//    @Operation(summary = "gửi mail cho phụ huynh trong 1 chien dịch khám sức khỏe",
//            description = "Gửi email thông báo cho phụ huynh về chiến dịch khám sức khỏe theo ID chiến dịch.")
//    @PostMapping("/{id}/send-mails")
//    public ResponseEntity<?> sendMails(@PathVariable Long id,
//                                       @AuthenticationPrincipal UserEntity me) {
//        healthCheckService.sendConsentEmails(id, me.getUserId());
//        return ResponseEntity.ok("Đang gửi email cho phụ huynh…");
//    }

    @Operation(summary = "Tạo chiến dịch khám sức khỏe", description = "Khởi tạo một chiến dịch khám sức khỏe mới với thông tin từ người tạo.")
    @PostMapping("/campaigns")
    public ResponseEntity<ResponseObject> createCampaign(
            @Valid @RequestBody HealthCheckCampaignRequestDTO request,
            @AuthenticationPrincipal UserEntity createdById) {
        if (createdById == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("UNAUTHORIZED")
                            .message("Hãy đăng nhập bằng tài khoản Admin để tạo chiến dịch khám sức khỏe")
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
        try {
            HealthCheckCampaignResponse response = healthCheckService.createCampaign(request, createdById.getUserId());
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("CREATE_CAMPAIGN_SUCCESS")
                            .message("Campaign created successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("USER_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("CREATE_CAMPAIGN_FAILED")
                            .message("Failed to create campaign: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Cập nhật chiến dịch khám", description = "Chỉnh sửa thông tin chiến dịch khám sức khỏe theo ID.")

    @PutMapping("/campaigns/{id}")
    public ResponseEntity<ResponseObject> updateCampaign(
            @PathVariable Long id,
            @RequestBody HealthCheckCampaignRequestDTO request) {
        try {
            HealthCheckCampaignResponse response = healthCheckService.updateCampaign(id, request);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("UPDATE_CAMPAIGN_SUCCESS")
                            .message("Campaign updated successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("CAMPAIGN_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("UPDATE_CAMPAIGN_FAILED")
                            .message("Failed to update campaign: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Bắt đầu chiến dịch khám", description = "Đổi trạng thái chiến dịch sang 'đang diễn ra'.")
    @PostMapping("/campaigns/{id}/start")
    public ResponseEntity<ResponseObject> startCampaign(@PathVariable Long id) {
        try {
            healthCheckService.startCampaign(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("START_CAMPAIGN_SUCCESS")
                            .message("Campaign started successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("CAMPAIGN_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("START_CAMPAIGN_FAILED")
                            .message("Failed to start campaign: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy chiến dịch theo ID", description = "Trả về thông tin chiến dịch khám sức khỏe theo ID.")
    @GetMapping("/campaigns/{id}")
    public ResponseEntity<ResponseObject> getCampaignById(@PathVariable Long id) {
        try {
            HealthCheckCampaignResponse response = healthCheckService.getCampaignById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_CAMPAIGN_SUCCESS")
                            .message("Campaign retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("CAMPAIGN_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_CAMPAIGN_FAILED")
                            .message("Failed to get campaign: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy tất cả chiến dịch khám", description = "Trả về danh sách tất cả chiến dịch khám sức khỏe.")
    @GetMapping("/campaigns")
    public ResponseEntity<ResponseObject> getAllCampaigns() {
        try {
            List<HealthCheckCampaignResponse> responses = healthCheckService.getAllCampaigns();
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_ALL_CAMPAIGNS_SUCCESS")
                            .message("Campaigns retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_ALL_CAMPAIGNS_FAILED")
                            .message("Failed to get campaigns: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }


    @Operation(summary = "Kết thúc chiến dịch khám", description = "Đổi trạng thái chiến dịch sang 'đã ket thuc'.")
    @PostMapping("/campaigns/{id}/end")
    public ResponseEntity<ResponseObject> endCampaign(@PathVariable Long id) {
        try {
            healthCheckService.endCampaign(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("END_CAMPAIGN_SUCCESS")
                            .message("Campaign ended successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("CAMPAIGN_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("START_CAMPAIGN_FAILED")
                            .message("Failed to start campaign: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Lấy tất cả chiến dịch khám đang bắt đầu", description = "Trả về danh sách tất cả chiến dịch khám sức khỏe.")
    @GetMapping("/campaignsStart")
    public ResponseEntity<ResponseObject> getAllCampaignsStart() {
        try {
            List<HealthCheckCampaignResponse> responses = healthCheckService.getAllCampaignsStart();
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_ALL_CAMPAIGNS_SUCCESS")
                            .message("Campaigns retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(responses)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_ALL_CAMPAIGNS_FAILED")
                            .message("Failed to get campaigns: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @Operation(summary = "Xóa chiến dịch đã tạo", description = "Đổi trạng chiến dịch thành REJECTED theo ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteCampaign(@PathVariable Long id) {
        healthCheckService.deleteCampaign(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Campaign deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy danh sách consent đã đồng ý theo campaign id", description = "Trả về danh sách consent đã đồng ý theo campaign id với phân trang và sắp xếp" +
            " bao gồm: student.id, parent,userId.")
    @GetMapping("/campaigns/{campaignId}/consents/approved")
    public ResponseEntity<ResponseObject> getApprovedConsentsByCampaign(
            @PathVariable Long campaignId,
            @ParameterObject
            @PageableDefault(page = 0, size = 10)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "id", direction = Sort.Direction.ASC)
            }) Pageable pageable) {
        try {
            PaginatedHealthCheckConsentResponse vaccinationConsentResponse = healthCheckConsentService.getApprovedConsentsByCampaign(campaignId, pageable);
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

    @Operation(
            summary = "Nhắc nhở phụ huynh chưa xác nhận",
            description = "Gửi lại email + notification cho tất cả phụ huynh còn trạng thái PENDING của chiến dịch."
    )
    @PostMapping("/campaigns/{id}/remind")
    public ResponseEntity<ResponseObject> remindUnconfirmedParents(@PathVariable Long id) {
        try {
            // Gọi service để gửi mail + push notification
            healthCheckService.remindUnconfirmedParents(id);

            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("REMIND_SUCCESS")
                            .message("Đã gửi nhắc nhở thành công")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .build()
            );
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code("CAMPAIGN_NOT_FOUND")
                            .message(e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("REMIND_FAILED")
                            .message("Lỗi gửi nhắc nhở: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }
}
