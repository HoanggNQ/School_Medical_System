package sms.swp391.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import sms.swp391.models.entities.HealthConsultationScheduleEntity;

import java.util.List;

public interface HealthConsultationScheduleRepository extends JpaRepository<HealthConsultationScheduleEntity, Long>,
        JpaSpecificationExecutor<HealthConsultationScheduleEntity> {
    List<HealthConsultationScheduleEntity> findByStudent_Id(Long studentId);

}
