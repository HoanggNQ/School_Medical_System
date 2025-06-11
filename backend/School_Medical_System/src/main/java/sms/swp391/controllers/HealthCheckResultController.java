package sms.swp391.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.*;
import sms.swp391.models.dtos.respones.*;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.HealthCheckService;

import java.util.List;

@RestController
@RequestMapping("/api/health-check-result")
@RequiredArgsConstructor
public class HealthCheckResultController {
    private final HealthCheckService healthCheckService;

    @PostMapping("/results")
    public ResponseEntity<ResponseObject> saveResult(
            @RequestBody HealthCheckResultRequestDTO request,
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
