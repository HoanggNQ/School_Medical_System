package sms.swp391.services;

import sms.swp391.models.dtos.requests.MedicineRequestCreateDTO;
import sms.swp391.models.dtos.responses.MedicineRequestResponse;

import java.util.List;

public interface MedicineRequestService {
    MedicineRequestResponse createRequest(MedicineRequestCreateDTO request);
    List<MedicineRequestResponse> getRequestsByStudent(Long studentId);
    MedicineRequestResponse updateRequestStatus(Long requestId, String status);
    void deleteRequest(Long requestId);
} 