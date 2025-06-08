package sms.swp391.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.MedicineRequestCreateDTO;
import sms.swp391.models.dtos.responses.MedicineRequestResponse;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.services.MedicineRequestService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/medicine-requests")
public class MedicineRequestController {

    private final MedicineRequestService medicineRequestService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> createRequest(@ModelAttribute MedicineRequestCreateDTO request) {
        MedicineRequestResponse response = medicineRequestService.createRequest(request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("CREATE_SUCCESS")
                .message("Medicine request created successfully")
                .data(response)
                .status(HttpStatus.OK)
                .isSuccess(true)
                .build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ResponseObject> getRequestsByStudent(@PathVariable Long studentId) {
        List<MedicineRequestResponse> responses = medicineRequestService.getRequestsByStudent(studentId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("GET_SUCCESS")
                .message("Medicine requests retrieved successfully")
                .data(responses)
                .status(HttpStatus.OK)
                .isSuccess(true)
                .build());
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<ResponseObject> updateStatus(
            @PathVariable Long requestId,
            @RequestParam String status) {
        MedicineRequestResponse response = medicineRequestService.updateRequestStatus(requestId, status);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("UPDATE_SUCCESS")
                .message("Medicine request status updated successfully")
                .data(response)
                .status(HttpStatus.OK)
                .isSuccess(true)
                .build());
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<ResponseObject> deleteRequest(@PathVariable Long requestId) {
        medicineRequestService.deleteRequest(requestId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("DELETE_SUCCESS")
                .message("Medicine request deleted successfully")
                .data(null)
                .status(HttpStatus.OK)
                .isSuccess(true)
                .build());
    }
} 