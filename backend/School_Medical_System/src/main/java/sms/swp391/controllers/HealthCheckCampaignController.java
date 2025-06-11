package sms.swp391.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.HealthCheckCampaignRequestDTO;
import sms.swp391.models.dtos.respones.HealthCheckCampaignResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.HealthCheckService;

import java.util.List;

@RestController
@RequestMapping("/api/health-check-campaign")
@RequiredArgsConstructor
public class HealthCheckCampaignController {
    private final HealthCheckService healthCheckService;



    @PostMapping("/campaigns")
    public ResponseEntity<ResponseObject> createCampaign(
            @RequestBody HealthCheckCampaignRequestDTO request,
            @RequestParam Long createdById) {
        try {
            HealthCheckCampaignResponse response = healthCheckService.createCampaign(request, createdById);
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
}
