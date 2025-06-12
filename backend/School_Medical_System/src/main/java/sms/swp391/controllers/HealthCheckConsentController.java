package sms.swp391.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.HealthCheckConsentRequestDTO;
import sms.swp391.models.dtos.respones.HealthCheckConsentResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.exception.AuthFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.HealthCheckService;

import java.util.List;

@RestController
@RequestMapping("/api/health-check-consent")
@RequiredArgsConstructor
public class HealthCheckConsentController {
    private final HealthCheckService healthCheckService;
    @PutMapping("/consents/{id}")
    public ResponseEntity<ResponseObject> updateConsent(
            @PathVariable Long id,
            @RequestBody HealthCheckConsentRequestDTO request,
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

}
