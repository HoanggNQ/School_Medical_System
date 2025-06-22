package sms.swp391.services;


import jakarta.transaction.Transactional;
import sms.swp391.models.dtos.requests.MedicationRequestCreateDTO;
import sms.swp391.models.dtos.respones.MedicationRequestResponseDTO;
import sms.swp391.models.entities.UserEntity;

import java.util.List;

public interface MedicationRequestService {
    MedicationRequestResponseDTO createRequest(MedicationRequestCreateDTO dto, Long parentId);

    @Transactional
    MedicationRequestResponseDTO createMedicationRequest(MedicationRequestCreateDTO dto, UserEntity parent);

    List<MedicationRequestResponseDTO> getPendingRequests();

    MedicationRequestResponseDTO getById(Long requestId);

    void approveRequest(Long requestId, Long staffId);

    void rejectRequest(Long requestId, Long staffId);
}
