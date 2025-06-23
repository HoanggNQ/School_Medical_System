package sms.swp391.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthConsultationScheduleRequestDTO;
import sms.swp391.models.dtos.responses.HealthConsultationScheduleResponseDTO;

import java.util.List;

public interface HealthConsultationScheduleService {
    HealthConsultationScheduleResponseDTO updateStatus(Long id, MedicalStatus status);

    HealthConsultationScheduleResponseDTO createSchedule(HealthConsultationScheduleRequestDTO requestDTO);
    List<HealthConsultationScheduleResponseDTO> getSchedulesByStudent(Long studentId);
    Page<HealthConsultationScheduleResponseDTO> searchByFilters(Long studentId, Long resultId, MedicalStatus status, Pageable pageable);

}
