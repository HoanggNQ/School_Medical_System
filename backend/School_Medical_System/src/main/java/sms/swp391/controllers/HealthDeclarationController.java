package sms.swp391.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.HealthDeclarationRequestDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationReviewDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.services.HealthDeclarationService;

import java.util.List;

@RestController
@RequestMapping("/api/health-declarations")
@RequiredArgsConstructor
public class HealthDeclarationController {

    private final HealthDeclarationService healthDeclarationService;

    // --- Health Declaration CRUD APIs ---

    @PostMapping
    public ResponseEntity<ResponseObject> createHealthDeclaration(
            @RequestBody HealthDeclarationRequestDTO request,
            @RequestParam Long parentId) {
        try {
            HealthDeclarationResponseDTO response = healthDeclarationService.createHealthDeclaration(parentId, request);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("CREATE_HEALTH_DECLARATION_SUCCESS")
                            .message("Health declaration created successfully")
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
        } catch (ActionFailedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("ACTION_FAILED")
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("CREATE_HEALTH_DECLARATION_FAILED")
                            .message("Failed to create health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @PutMapping("/{declarationId}")
    public ResponseEntity<ResponseObject> updateHealthDeclaration(
            @PathVariable Long declarationId,
            @RequestBody HealthDeclarationUpdateDTO request,
            @RequestParam Long parentId) {
        try {
            HealthDeclarationResponseDTO response = healthDeclarationService.updateHealthDeclaration(parentId, declarationId, request);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("UPDATE_HEALTH_DECLARATION_SUCCESS")
                            .message("Health declaration updated successfully")
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
        } catch (ActionFailedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("ACTION_FAILED")
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("UPDATE_HEALTH_DECLARATION_FAILED")
                            .message("Failed to update health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @GetMapping("/{declarationId}")
    public ResponseEntity<ResponseObject> getHealthDeclarationById(@PathVariable Long declarationId) {
        try {
            HealthDeclarationResponseDTO response = healthDeclarationService.getHealthDeclarationById(declarationId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_HEALTH_DECLARATION_SUCCESS")
                            .message("Health declaration retrieved successfully")
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_HEALTH_DECLARATION_FAILED")
                            .message("Failed to get health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @DeleteMapping("/{declarationId}")
    public ResponseEntity<ResponseObject> deleteHealthDeclaration(
            @PathVariable Long declarationId,
            @RequestParam Long parentId) {
        try {
            healthDeclarationService.deleteHealthDeclaration(parentId, declarationId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("DELETE_HEALTH_DECLARATION_SUCCESS")
                            .message("Health declaration deleted successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
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
        } catch (ActionFailedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .code("ACTION_FAILED")
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .isSuccess(false)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("DELETE_HEALTH_DECLARATION_FAILED")
                            .message("Failed to delete health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    // --- Query APIs ---

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ResponseObject> getHealthDeclarationsByStudent(@PathVariable Long studentId) {
        try {
            List<HealthDeclarationResponseDTO> response = healthDeclarationService.getHealthDeclarationsByStudent(studentId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_STUDENT_HEALTH_DECLARATIONS_SUCCESS")
                            .message("Student health declarations retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_STUDENT_HEALTH_DECLARATIONS_FAILED")
                            .message("Failed to get student health declarations: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<ResponseObject> getHealthDeclarationsByParent(@PathVariable Long parentId) {
        try {
            List<HealthDeclarationResponseDTO> response = healthDeclarationService.getHealthDeclarationsByParent(parentId);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_PARENT_HEALTH_DECLARATIONS_SUCCESS")
                            .message("Parent health declarations retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_PARENT_HEALTH_DECLARATIONS_FAILED")
                            .message("Failed to get parent health declarations: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    @GetMapping("/list-declaration")
    public ResponseEntity<ResponseObject> getHealthDeclarationsList() {
        try {
            List<HealthDeclarationResponseDTO> response = healthDeclarationService.getListHealthDeclarations();
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_HEALTH_DECLARATIONS_SUCCESS")
                            .message("Health declarations by status retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_HEALTH_DECLARATIONS_FAILED")
                            .message("Failed to get health declarations by status: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }  @GetMapping("/status/{status}")
    public ResponseEntity<ResponseObject> getHealthDeclarationsByStatus(@PathVariable String status) {
        try {
            List<HealthDeclarationResponseDTO> response = healthDeclarationService.getHealthDeclarationsByStatus(status);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_HEALTH_DECLARATIONS_BY_STATUS_SUCCESS")
                            .message("Health declarations by status retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(response)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_HEALTH_DECLARATIONS_BY_STATUS_FAILED")
                            .message("Failed to get health declarations by status: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }

    // --- Review API ---

    @PutMapping("/{declarationId}/review")
    public ResponseEntity<ResponseObject> reviewHealthDeclaration(
            @PathVariable Long declarationId,
            @RequestBody HealthDeclarationReviewDTO reviewDto,
            @RequestParam Long reviewerId) {
        try {
            HealthDeclarationResponseDTO response = healthDeclarationService.reviewHealthDeclaration(reviewerId, declarationId, reviewDto);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("REVIEW_HEALTH_DECLARATION_SUCCESS")
                            .message("Health declaration reviewed successfully")
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("REVIEW_HEALTH_DECLARATION_FAILED")
                            .message("Failed to review health declaration: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .build()
            );
        }
    }
}