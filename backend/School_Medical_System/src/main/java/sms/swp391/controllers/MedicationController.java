package sms.swp391.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.MedicationRequestDTO;
import sms.swp391.models.dtos.respones.MedicationResponseDTO;
import sms.swp391.models.entities.MedicationEntity;
import sms.swp391.repositories.MedicationRepository;
import sms.swp391.services.MedicationService;
import sms.swp391.utils.MedicationExcelExporter;
import sms.swp391.models.dtos.respones.ResponseObject;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;
    private final MedicationRepository medicationRepository;

    @PostMapping
    public ResponseEntity<ResponseObject> create(@RequestBody MedicationRequestDTO dto) {
        try {
            MedicationResponseDTO created = medicationService.create(dto);
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

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable Long id, @RequestBody MedicationRequestDTO dto) {
        try {
            MedicationResponseDTO updated = medicationService.update(id, dto);
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

    @GetMapping
    public ResponseEntity<ResponseObject> getAll(Pageable pageable) {
        try {
            Page<MedicationResponseDTO> page = medicationService.getAll(pageable);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_ALL_MEDICATIONS_SUCCESS")
                            .message("Medications retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(page)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_ALL_MEDICATIONS_FAILED")
                            .message("Failed to get medications: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseObject> getAllList() {
        try {
            List<MedicationResponseDTO> list = medicationService.getAll();
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_ALL_MEDICATIONS_LIST_SUCCESS")
                            .message("Medications list retrieved successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(list)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("GET_ALL_MEDICATIONS_LIST_FAILED")
                            .message("Failed to get medications list: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        try {
            List<MedicationEntity> list = medicationRepository.findAll();
            ByteArrayInputStream in = MedicationExcelExporter.export(list);

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
