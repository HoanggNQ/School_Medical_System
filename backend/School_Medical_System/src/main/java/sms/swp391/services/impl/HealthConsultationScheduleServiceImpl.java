package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.requests.HealthConsultationScheduleRequestDTO;
import sms.swp391.models.dtos.responses.HealthConsultationScheduleResponseDTO;
import sms.swp391.models.entities.*;
import sms.swp391.repositories.*;
import sms.swp391.services.HealthConsultationScheduleService;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

import java.util.stream.Collectors;
@Transactional
@Service
@RequiredArgsConstructor
public class HealthConsultationScheduleServiceImpl implements HealthConsultationScheduleService {

    private final HealthConsultationScheduleRepository scheduleRepo;
    private final StudentRepository studentRepo;
    private final HealthCheckResultRepository resultRepo;
    @Override
    public HealthConsultationScheduleResponseDTO updateStatus(Long id, MedicalStatus status) {
        HealthConsultationScheduleEntity schedule = scheduleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule.setStatus(status);
        return toResponse(scheduleRepo.save(schedule));
    }
    @Override
    public Page<HealthConsultationScheduleResponseDTO> searchByFilters(Long studentId, Long resultId, MedicalStatus status, Pageable pageable) {
        // Gọi custom query hoặc dùng Specification
        Page<HealthConsultationScheduleEntity> resultPage = scheduleRepo.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (studentId != null) {
                predicates.add(cb.equal(root.get("student").get("id"), studentId));
            }

            if (resultId != null) {
                predicates.add(cb.equal(root.get("result").get("id"), resultId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        return resultPage.map(this::toResponse);
    }

    @Override
    public HealthConsultationScheduleResponseDTO createSchedule(HealthConsultationScheduleRequestDTO request) {
        StudentEntity student = studentRepo.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        HealthCheckResultEntity result = resultRepo.findById(request.getResultId())
                .orElseThrow(() -> new RuntimeException("Result not found"));

        HealthConsultationScheduleEntity entity = HealthConsultationScheduleEntity.builder()
                .student(student)
                .result(result)
                .reason(request.getReason())
                .scheduleTime(request.getScheduleTime())
                .status(MedicalStatus.PENDING)
                .build();

        HealthConsultationScheduleEntity saved = scheduleRepo.save(entity);

        return toResponse(saved);
    }

    @Override
    public List<HealthConsultationScheduleResponseDTO> getSchedulesByStudent(Long studentId) {
        return scheduleRepo.findByStudent_Id(studentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private HealthConsultationScheduleResponseDTO toResponse(HealthConsultationScheduleEntity entity) {
        return HealthConsultationScheduleResponseDTO.builder()
                .id(entity.getId())
                .studentName(entity.getStudent().getUser().getFullname())
                .resultId(entity.getResult().getId())
                .scheduleTime(entity.getScheduleTime())
                .reason(entity.getReason())
                .status(entity.getStatus())
                .build();
    }
}
