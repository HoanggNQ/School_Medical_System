package sms.swp391.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.respones.*;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.HealthCheckService;

import java.util.List;

@RestController
@RequestMapping("/api/health-check")
@RequiredArgsConstructor
public class HealthCheckController {

    private final HealthCheckService healthCheckService;

    // --- Campaign APIs ---

    @PostMapping("/campaigns")
    public ResponseEntity<ResponseObject> createCampaign(
            @RequestBody HealthCheckCampaignRequest request,
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
            @RequestBody HealthCheckCampaignRequest request) {
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

    // --- Consent APIs ---

    @PutMapping("/consents/{id}")
    public ResponseEntity<ResponseObject> updateConsent(
            @PathVariable Long id,
            @RequestBody HealthCheckConsentRequest request,
            @RequestParam Long parentId) {
        try {
            HealthCheckConsentResponse response = healthCheckService.updateConsent(id, request, parentId);
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

    @GetMapping("/campaigns/{campaignId}/consents/pending")
    public ResponseEntity<ResponseObject> getConsentsByCampaign(@PathVariable Long campaignId) {
        try {
            List<HealthCheckConsentResponse> responses = healthCheckService.getConsentsByCampaign(campaignId);
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

    @GetMapping("/consents/{id}")
    public ResponseEntity<ResponseObject> getConsentById(@PathVariable Long id) {
        try {
            HealthCheckConsentResponse response = healthCheckService.getConsentById(id);
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

    @GetMapping("/parents/{parentId}/consents/pending")
    public ResponseEntity<ResponseObject> getPendingConsentsByParent(@PathVariable Long parentId) {
        try {
            List<HealthCheckConsentResponse> responses = healthCheckService.getPendingConsentsByParent(parentId);
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

    // --- Result APIs ---

    @PostMapping("/results")
    public ResponseEntity<ResponseObject> saveResult(
            @RequestBody HealthCheckResultRequest request,
            @RequestParam Long checkedById) {
        try {
            HealthCheckResultResponse response = healthCheckService.saveResult(request, checkedById);
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_RESULTS_FAILED")
                            .message("Failed to get results: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_RESULTS_FAILED")
                            .message("Failed to get results: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }
}
