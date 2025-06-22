package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.requests.MedicationRequestDTO;
import sms.swp391.models.dtos.respones.MedicationResponseDTO;
import sms.swp391.models.entities.MedicationEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.MedicationRepository;
import sms.swp391.services.MedicationService;
import sms.swp391.utils.MedicationMapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationServiceImpl implements MedicationService {

    private final MedicationRepository medicationRepository;

    @Override
    public MedicationResponseDTO create(MedicationRequestDTO dto) {
        MedicationEntity entity = MedicationMapper.fromRequestDTO(dto);
        MedicationEntity saved = medicationRepository.save(entity);
        return MedicationMapper.toDTO(saved);
    }

    @Override
    public MedicationResponseDTO update(Long id, MedicationRequestDTO dto) {
        MedicationEntity existing = medicationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Medication not found with id: " + id));
        MedicationMapper.updateEntityFromDTO(existing, dto);
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
        MedicationEntity medication = medicationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Medication not found with id: " + id));
        medication.setQuantity(quantity);
        medicationRepository.save(medication);
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
