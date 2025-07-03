package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.VaccinationCampaignRequestDTO;
import sms.swp391.models.dtos.responses.VaccinationCampaignResponse;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.VaccinationService;

import java.util.List;

@RestController
@RequestMapping("/api/vaccination-campaign")
@RequiredArgsConstructor
public class VaccinationCampaignController {
    private final VaccinationService vaccinationService;

    @Operation(summary = "Tạo chiến dịch tiêm vaccine", description = "Khởi tạo một chiến tiêm vaccine mới với thông tin từ người tạo.")
    @PostMapping("/campaigns")
    public ResponseEntity<ResponseObject> createCampaign(
            @Valid @RequestBody VaccinationCampaignRequestDTO request,
            @AuthenticationPrincipal UserEntity createdById) {
        if (createdById == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .code("UNAUTHORIZED")
                            .message("Hãy đăng nhập bằng tài khoản admin để tạo chiến dịch tiêm vaccine.")
                            .status(HttpStatus.UNAUTHORIZED)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
        try {
            VaccinationCampaignResponse response = vaccinationService.createCampaign(request, createdById.getUserId());
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

    @Operation(summary = "Cập nhật chiến dịch tiêm vaccine", description = "Chỉnh sửa thông tin chiến tiêm vaccine theo ID.")
    @PutMapping("/campaigns/{id}")
    public ResponseEntity<ResponseObject> updateCampaign(
            @PathVariable Long id,
            @RequestBody VaccinationCampaignRequestDTO request) {
        try {
            VaccinationCampaignResponse response = vaccinationService.updateCampaign(id, request);
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

    @Operation(summary = "Bắt đầu chiến dịch tiêm vaccine", description = "Đổi trạng thái chiến dịch sang 'đang diễn ra'.")
    @PostMapping("/campaigns/{id}/start")
    public ResponseEntity<ResponseObject> startCampaign(@PathVariable Long id) {
        try {
            vaccinationService.startCampaign(id);
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

    @Operation(summary = "Lấy chiến dịch theo ID", description = "Trả về thông tin chiến dịch tiêm vaccine theo ID.")
    @GetMapping("/campaigns/{id}")
    public ResponseEntity<ResponseObject> getCampaignById(@PathVariable Long id) {
        try {
            VaccinationCampaignResponse response = vaccinationService.getCampaignById(id);
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

    @Operation(summary = "Lấy tất cả chiến dịch tiêm vaccine", description = "Trả về danh sách tất cả chiến dịch tiêm vaccine.")
    @GetMapping("/campaigns")
    public ResponseEntity<ResponseObject> getAllCampaigns() {
        try {
            List<VaccinationCampaignResponse> responses = vaccinationService.getAllCampaigns();
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

    @Operation(summary = "Kết thúc chiến dịch tiêm vaccine", description = "Đổi trạng thái chiến dịch sang 'đã kết thuc'.")
    @PostMapping("/campaigns/{id}/end")
    public ResponseEntity<ResponseObject> endCampaign(@PathVariable Long id) {
        try {
            vaccinationService.endCampaign(id);
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

    @Operation(summary = "Lấy tất cả chiến dịch tiêm vaccine đang bắt đầu", description = "Trả về danh sách tất cả chiến dịch tiêm vaccine.")
    @GetMapping("/campaignsStart")
    public ResponseEntity<ResponseObject> getAllCampaignsStart() {
        try {
            List<VaccinationCampaignResponse> responses = vaccinationService.getAllCampaignsStart();
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
        vaccinationService.deleteCampaign(id);
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
}