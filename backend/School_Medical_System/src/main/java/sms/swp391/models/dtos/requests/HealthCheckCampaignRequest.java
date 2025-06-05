package sms.swp391.models.dtos.requests;

import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckCampaignRequest {
    private String name;
    private String description;
    private LocalDate checkDate;
    private Integer targetGrade;
    private String location;
    private String requiredEquipment;
}
