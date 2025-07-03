package sms.swp391.models.dtos.responses;
import lombok.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckCampaignResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private MedicalStatus status;
    private Integer targetGrade;
    private String location;
    private String requiredEquipment;
    private Long createdById;
    private LocalDateTime createdAt;
}
