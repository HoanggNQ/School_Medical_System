package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.requests.HealthConsultationScheduleRequestDTO;
import sms.swp391.models.dtos.responses.HealthConsultationScheduleResponseDTO;
import sms.swp391.models.entities.*;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.*;
import sms.swp391.services.HealthConsultationScheduleService;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;
import sms.swp391.services.NotificationService;
import sms.swp391.services.SendMailService;

import java.util.stream.Collectors;
@Transactional
@Service
@RequiredArgsConstructor
public class HealthConsultationScheduleServiceImpl implements HealthConsultationScheduleService {

    private final HealthConsultationScheduleRepository scheduleRepo;
    private final StudentRepository studentRepo;
    private final HealthCheckResultRepository resultRepo;
    private final SendMailService sendMailService;
    private final NotificationService notificationService;
    private final UserRepository userRepo;

    @Override
    public HealthConsultationScheduleResponseDTO updateStatus(Long id, MedicalStatus status,String note) {
        HealthConsultationScheduleEntity schedule = scheduleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule.setReason(note);
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
    public HealthConsultationScheduleResponseDTO getById(Long id) {
        HealthConsultationScheduleEntity entity = scheduleRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lịch tư vấn với id: " + id));
        return toResponse(entity);
    }
    @Override
    public HealthConsultationScheduleResponseDTO createSchedule(HealthConsultationScheduleRequestDTO request, Long createdById) {

        StudentEntity student = studentRepo.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh."));

        HealthCheckResultEntity result = resultRepo.findById(request.getResultId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kết quả khám sức khỏe."));

        UserEntity parent = student.getParent();
        if (parent == null) {
            throw new RuntimeException("Học sinh chưa được gán phụ huynh.");
        }

        UserEntity creator = userRepo.findById(createdById)
                .orElseThrow(() -> new RuntimeException("Người tạo không tồn tại."));

        if (!RoleEnum.SCHOOL_NURSE.equals(creator.getRoleName())) {
            throw new RuntimeException("Chỉ nhân viên y tế mới được tạo lịch tư vấn.");
        }

        if (scheduleRepo.existsByStudent_IdAndResult_ResultId(student.getId(), result.getResultId())) {
            throw new RuntimeException("Đã có lịch tư vấn cho kết quả khám này.");
        }

        if (scheduleRepo.existsByStudent_IdAndStatus(student.getId(), MedicalStatus.PENDING)) {
            throw new RuntimeException("Học sinh này đã có một lịch hẹn đang chờ xử lý.");
        }

        List<MedicalStatus> statuses = List.of(MedicalStatus.PENDING, MedicalStatus.APPROVED);
        LocalDateTime requestedTime = request.getScheduleTime();
        LocalDateTime scheduleTime = requestedTime;

        LocalTime startTime = LocalTime.of(8, 0);
        LocalTime endTime = LocalTime.of(17, 0);

        if (requestedTime.toLocalTime().isBefore(startTime) || requestedTime.toLocalTime().isAfter(endTime.minusMinutes(20))) {
            throw new RuntimeException("Thời gian hẹn tư vấn phải trong khung giờ 08:00 - 17:00. Mỗi phiên cách nhau 20 phút.");
        }

        while (scheduleRepo.existsByStudent_IdAndScheduleTimeAndStatusIn(student.getId(), scheduleTime, statuses)) {
            scheduleTime = scheduleTime.plusMinutes(20);

            if (scheduleTime.toLocalTime().isAfter(endTime.minusMinutes(20))) {
                throw new RuntimeException("Không còn khung giờ trống phù hợp trong ngày để đặt lịch tư vấn.");
            }
        }

        HealthConsultationScheduleEntity entity = HealthConsultationScheduleEntity.builder()
                .student(student)
                .result(result)
                .parent(parent)
                .reason(request.getReason())
                .scheduleTime(scheduleTime)
                .status(MedicalStatus.PENDING)
                .build();

        HealthConsultationScheduleEntity saved = scheduleRepo.save(entity);

        String formattedTime = scheduleTime.format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"));

        sendMailService.sendConsultationScheduleEmail(
                parent.getEmail(),
                student.getUser().getFullname(),
                formattedTime,
                request.getReason()
        );

        notificationService.push(
                creator.getUserId(),
                parent.getUserId(),
                "Lịch tư vấn sức khỏe",
                "Bạn đã đặt lịch tư vấn cho con vào " + formattedTime
        );

        return toResponse(saved);
    }


    @Override
    public List<HealthConsultationScheduleResponseDTO> getSchedulesByStudent(Long studentId) {
        return scheduleRepo.findByStudent_Id(studentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<HealthConsultationScheduleResponseDTO> getSchedulesByParent(Long parent_Id) {
        return scheduleRepo.findByStudent_Parent_UserId(parent_Id)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private HealthConsultationScheduleResponseDTO toResponse(HealthConsultationScheduleEntity entity) {
        return HealthConsultationScheduleResponseDTO.builder()
                .id(entity.getId())
                .studentName(entity.getStudent().getUser().getFullname())
                .studentId(entity.getStudent().getId())
                .parentName(entity.getStudent().getParent().getFullname())
                .parentId(entity.getStudent().getParent().getUserId())
                .resultId(entity.getResult().getResultId())
                .scheduleTime(entity.getScheduleTime())
                .reason(entity.getReason())
                .status(entity.getStatus())
                .build();
    }
}
