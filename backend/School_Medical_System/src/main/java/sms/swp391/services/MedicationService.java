package sms.swp391.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.MedicationRequestDTO;
import sms.swp391.models.dtos.responses.MedicationResponseDTO;

public interface MedicationService {
    MedicationResponseDTO create(MedicationRequestDTO dto, MultipartFile image);
    MedicationResponseDTO update(Long id, MedicationRequestDTO dto, MultipartFile image);
    void delete(Long id);
    MedicationResponseDTO getById(Long id);
    Page<MedicationResponseDTO> getAll(Pageable pageable);
    void updateQuantity(Long id, int quantity);
}
