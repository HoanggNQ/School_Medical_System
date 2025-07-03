package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.MedicationRequestDTO;
import sms.swp391.models.dtos.responses.MedicationResponseDTO;
import sms.swp391.models.entities.MedicationEntity;
import sms.swp391.repositories.MedicationRepository;
import sms.swp391.services.MedicationService;
import sms.swp391.utils.ExcelExporter;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.utils.PageUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;
    private final MedicationRepository medicationRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> createMedication(
            @RequestPart("medication") @Valid MedicationRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            MedicationResponseDTO created = medicationService.create(dto,image);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("CREATE_MEDICATION_SUCCESS")
                            .message("Medication created successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(created)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("CREATE_MEDICATION_FAILED")
                            .message("Failed to create medication: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @PostMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> updateMedication(
            @PathVariable Long id,
            @RequestPart("medication") @Valid MedicationRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            MedicationResponseDTO updated = medicationService.update(id, dto,image);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("UPDATE_MEDICATION_SUCCESS")
                            .message("Medication updated successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(updated)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("UPDATE_MEDICATION_FAILED")
                            .message("Failed to update medication: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable Long id) {
        try {
            medicationService.delete(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("DELETE_MEDICATION_SUCCESS")
                            .message("Medication deleted successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(null)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("DELETE_MEDICATION_FAILED")
                            .message("Failed to delete medication: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getById(@PathVariable Long id) {
        try {
            MedicationResponseDTO dto = medicationService.getById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_MEDICATION_SUCCESS")
                            .message("Medication retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(dto)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_MEDICATION_FAILED")
                            .message("Failed to get medication: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }
    @PatchMapping("/{id}/quantity")
    public ResponseEntity<Void> updateQuantity(@PathVariable Long id, @RequestParam int quantity) {
        medicationService.updateQuantity(id, quantity);
        return ResponseEntity.ok().build();
    }
    @Operation(summary = "Danh sách thuốc trong kho")
    @GetMapping
    public ResponseEntity<ResponseObject> getAll(
            @ParameterObject
            @PageableDefault(size = 10,
                    sort = "medicationName",
                    direction = Sort.Direction.ASC) Pageable pageable) {

        Page<MedicationResponseDTO> page = medicationService.getAll(pageable);

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_ALL_MEDICATIONS_SUCCESS")
                        .message("Medications retrieved successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(PageUtils.toPagedResponse(page))
                        .build());
    }

       @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        try {
            List<MedicationEntity> list = medicationRepository.findAll();
            ByteArrayInputStream in = ExcelExporter.export(list);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=medications.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(in.readAllBytes());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
