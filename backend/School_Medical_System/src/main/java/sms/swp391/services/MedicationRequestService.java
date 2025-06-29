package sms.swp391.services;


import jakarta.transaction.Transactional;
import sms.swp391.models.dtos.requests.MedicationRequestCreateDTO;
import sms.swp391.models.dtos.responses.MedicationRequestResponseDTO;
import sms.swp391.models.entities.UserEntity;

import java.util.List;

public interface MedicationRequestService {
    MedicationRequestResponseDTO createRequest(MedicationRequestCreateDTO dto, Long parentId);

    @Transactional
    MedicationRequestResponseDTO createMedicationRequest(MedicationRequestCreateDTO dto, UserEntity parent);

    @Transactional
    List<MedicationRequestResponseDTO> getApproveRequests();

    @Transactional
    List<MedicationRequestResponseDTO> getRejectRequests();

    List<MedicationRequestResponseDTO> getPendingRequests();

    MedicationRequestResponseDTO getById(Long requestId);

    void approveRequest(Long requestId, Long staffId);

    void rejectRequest(Long requestId, Long staffId);

    @Transactional
    void doneRequest(Long requestId, Long staffId);
}
