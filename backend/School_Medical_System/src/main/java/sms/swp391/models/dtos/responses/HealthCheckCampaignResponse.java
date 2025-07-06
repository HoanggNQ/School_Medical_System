package sms.swp391.models.dtos.responses;
import lombok.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
    private List<String> targetGrade;
    private String location;
    private Long createdById;
    private LocalDateTime createdAt;
}
