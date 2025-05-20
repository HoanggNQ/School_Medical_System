package sms.swp391.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "health_check", schema = "public")
public class HealthCheckEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "health_check_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "student_id")
    private StudentEntity studentEntity;

    @Column(name = "health_check_date")
    private LocalDate healthCheckDate;

    @Column(name = "health_check_result", length = Integer.MAX_VALUE)
    private String healthCheckResult;

    @OneToMany(mappedBy = "healthCheckEntity")
    private Set<HealthCheckDetailEntity> healthCheckDetailEntities = new LinkedHashSet<>();

}