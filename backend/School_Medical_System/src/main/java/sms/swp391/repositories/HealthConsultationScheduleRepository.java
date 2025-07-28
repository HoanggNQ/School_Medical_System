package sms.swp391.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.entities.HealthConsultationScheduleEntity;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Repository;
@Repository
public interface HealthConsultationScheduleRepository extends JpaRepository<HealthConsultationScheduleEntity, Long>,
        JpaSpecificationExecutor<HealthConsultationScheduleEntity> {
    List<HealthConsultationScheduleEntity> findByStudent_Id(Long studentId);
    List<HealthConsultationScheduleEntity> findByStudent_Parent_UserId(Long parentId);
    boolean existsByStudentIdAndScheduleTime(Long studentId, LocalDateTime scheduleTime);
    boolean existsByStudent_IdAndResult_ResultId(Long id, Long resultId);
    boolean existsByStudent_IdAndScheduleTimeBetweenAndStatusIn(Long studentId,  LocalDateTime startTime,
                                                         LocalDateTime endTime, List<MedicalStatus> statuses);

    boolean existsByStudent_IdAndStatus(Long studentId, MedicalStatus status);
}
