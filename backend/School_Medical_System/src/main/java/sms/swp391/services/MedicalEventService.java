package sms.swp391.services;

import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.requests.MedicalEventCreateRequestDTO;
import sms.swp391.models.dtos.requests.MedicalEventUpdateRequestDTO;
import sms.swp391.models.dtos.responses.MedicalEventResponse;
import sms.swp391.models.dtos.responses.PaginatedMedicalEventResponse;

public interface MedicalEventService {
    MedicalEventResponse create(MedicalEventCreateRequestDTO request);
    MedicalEventResponse update(Long id, MedicalEventUpdateRequestDTO request);
    void delete(Long id);
    MedicalEventResponse getById(Long id);
    PaginatedMedicalEventResponse getAllMedicalEvents(String search, Pageable pageable);
}