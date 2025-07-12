package sms.swp391.services;


import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.requests.MedicationRequestCreateDTO;
import sms.swp391.models.dtos.responses.MedicationRequestResponseDTO;
import sms.swp391.models.entities.UserEntity;

import java.util.List;

public interface MedicationRequestService {
    List<MedicationRequestResponseDTO> getRequestsByStudentId(Long studentId);

    @Transactional
    void cancelRequest(Long requestId, Long requesterId);

    MedicationRequestResponseDTO updateRequest(Long requestId, MedicationRequestCreateDTO dto, Long parentId);

    @Transactional
    List<MedicationRequestResponseDTO> getRequestsByParentId(Long parentId);

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

    Page<MedicationRequestResponseDTO> getAllRequests(Pageable pageable);
}
