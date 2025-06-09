package sms.swp391.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;


import sms.swp391.models.dtos.requests.MedicationRequestDTO;
import sms.swp391.models.dtos.respones.MedicationResponseDTO;

import java.util.UUID;

public interface MedicationService {
    MedicationResponseDTO create(MedicationRequestDTO dto);
    MedicationResponseDTO update(Long id, MedicationRequestDTO dto);
    void delete(Long id);
    MedicationResponseDTO getById(Long id);
    List<MedicationResponseDTO> getAll();
    Page<MedicationResponseDTO> getAll(Pageable pageable);
}
