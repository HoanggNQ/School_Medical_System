package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "medication_request_detail")
public class MedicationRequestDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "request_id", nullable = false)
    private MedicationRequestEntity request;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medication_id", nullable = false)
    private MedicationEntity medication;

    @NotNull
    @Column(name = "dosage", nullable = false, length = Integer.MAX_VALUE)
    private String dosage;

    @NotNull
    @Column(name = "frequency", nullable = false, length = Integer.MAX_VALUE)
    private String frequency;

    @Column(name = "administration_time")
    private List<LocalTime> administrationTime;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotNull
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "attachment_url", length = Integer.MAX_VALUE)
    private String attachmentUrl;

    @Column(name = "actual_administration")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> actualAdministration;

    @Size(max = 20)
    @Column(name = "status", length = 20)
    private String status;

}