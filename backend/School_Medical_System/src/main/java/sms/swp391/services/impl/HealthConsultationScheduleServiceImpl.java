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
import sms.swp391.repositories.*;
import sms.swp391.services.HealthConsultationScheduleService;

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
    public HealthConsultationScheduleResponseDTO createSchedule(HealthConsultationScheduleRequestDTO request, Long createdById)
    {

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
        if (scheduleRepo.existsByStudent_IdAndScheduleTimeAndStatusIn(student.getId(), request.getScheduleTime(), statuses)) {
            throw new RuntimeException("Học sinh đã có lịch tư vấn vào thời điểm này.");
        }

        HealthConsultationScheduleEntity entity = HealthConsultationScheduleEntity.builder()
                .student(student)
                .result(result)
                .parent(parent)
                .reason(request.getReason())
                .scheduleTime(request.getScheduleTime())
                .status(MedicalStatus.PENDING)
                .build();

        HealthConsultationScheduleEntity saved = scheduleRepo.save(entity);

        String formattedTime = request.getScheduleTime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"));
        sendMailService.sendConsultationScheduleEmail(
                parent.getEmail(),
                student.getUser().getFullname(),
                formattedTime,
                request.getReason()
        );

        notificationService.push(
                creator.getUserId(),  // Nếu bạn có thông tin người tạo, truyền ID vào đây
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
                .parentName(entity.getStudent().getParent().getFullname())
                .resultId(entity.getResult().getResultId())
                .scheduleTime(entity.getScheduleTime())
                .reason(entity.getReason())
                .status(entity.getStatus())
                .build();
    }
}
