package sms.swp391.models.dtos.respones;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckCampaignResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate checkDate;
    private String status;
    private Integer targetGrade;
    private String location;
    private String requiredEquipment;
    private Long createdById;
    private Instant createdAt;
}
