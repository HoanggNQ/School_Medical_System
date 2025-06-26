package sms.swp391.services;

import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.requests.MedicalEventRequestDTO;
import sms.swp391.models.dtos.respones.MedicalEventResponse;
import sms.swp391.models.dtos.respones.PaginatedContentResponse;
import sms.swp391.models.dtos.respones.PaginatedMedicalEventResponse;

import java.util.List;

public interface MedicalEventService {
    MedicalEventResponse create(MedicalEventRequestDTO request);
    MedicalEventResponse update(Long id, MedicalEventRequestDTO request);
    void delete(Long id);
    MedicalEventResponse getById(Long id);
    PaginatedMedicalEventResponse getAllMedicalEvents(String search, Pageable pageable);
}