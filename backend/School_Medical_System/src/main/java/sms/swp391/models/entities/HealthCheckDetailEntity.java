package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "health_check_detail", schema = "public")
public class HealthCheckDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "health_check_detail_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "health_check_id")
    private HealthCheckEntity healthCheckEntity;

    @Size(max = 255)
    @Column(name = "health_check_item")
    private String healthCheckItem;

    @Column(name = "health_check_result", length = Integer.MAX_VALUE)
    private String healthCheckResult;

}