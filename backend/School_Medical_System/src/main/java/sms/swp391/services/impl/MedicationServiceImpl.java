package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.MedicationRequestDTO;
import sms.swp391.models.dtos.responses.FileObjectResponse;
import sms.swp391.models.dtos.responses.MedicationResponseDTO;
import sms.swp391.models.entities.MedicationEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.MedicationRepository;
import sms.swp391.services.FileDatabaseService;
import sms.swp391.services.MedicationService;
import sms.swp391.utils.MedicationMapper;

@Service
@RequiredArgsConstructor
public class MedicationServiceImpl implements MedicationService {

    private final MedicationRepository medicationRepository;
    private final FileDatabaseService fileDatabaseService;

    @Override
    public MedicationResponseDTO create(MedicationRequestDTO dto, MultipartFile image) {
        MedicationEntity entity = MedicationMapper.fromRequestDTO(dto);

        if (image != null && !image.isEmpty()) {
            FileObjectResponse fileRes = fileDatabaseService.uploadFile(image);
            entity.setMedicationImg(fileRes.getUrl());
        }

        MedicationEntity saved = medicationRepository.save(entity);
        return MedicationMapper.toDTO(saved);
    }

    @Override
    public MedicationResponseDTO update(Long id, MedicationRequestDTO dto, MultipartFile image) {
        MedicationEntity existing = medicationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Medication not found: " + id));

        MedicationMapper.updateEntityFromDTO(existing, dto);

        if (image != null && !image.isEmpty()) {
            FileObjectResponse fileRes = fileDatabaseService.uploadFile(image);
            existing.setMedicationImg(fileRes.getUrl());
        }

        MedicationEntity updated = medicationRepository.save(existing);
        return MedicationMapper.toDTO(updated);
    }


    @Override
    public void delete(Long id) {
        MedicationEntity existing = medicationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Medication not found with id: " + id));
        medicationRepository.delete(existing);
    }
    @Override
    public void updateQuantity(Long id, int quantity) {
        MedicationEntity m = medicationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Medication not found: " + id));

        int newQty = m.getQuantity() + quantity;
        if (newQty < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
        m.setQuantity(newQty);
        medicationRepository.save(m);
    }

    @Override
    public MedicationResponseDTO getById(Long id) {
        return medicationRepository.findById(id)
                .map(MedicationMapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Medication not found with id: " + id));
    }



    @Override
    public Page<MedicationResponseDTO> getAll(Pageable pageable) {
        return medicationRepository.getMedicationEntitiesByQuantity(pageable).map(MedicationMapper::toDTO);
    }
}
