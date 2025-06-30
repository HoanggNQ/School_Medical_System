package sms.swp391.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_consultation_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthConsultationScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Học sinh được tư vấn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true)
    private UserEntity parent;
    // Kết quả kiểm tra dẫn đến tư vấn
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    private HealthCheckResultEntity result;

    // Thời gian tư vấn
    @Column(name = "schedule_time", nullable = false)
    private LocalDateTime scheduleTime;

    // Lý do tư vấn
    @Column(name = "reason", nullable = false)
    private String reason;

    // Trạng thái (có thể dùng nếu bạn muốn quản lý trạng thái cuộc hẹn)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MedicalStatus status = MedicalStatus.PENDING;


    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
