package sms.swp391.models.dtos.requests;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VaccinationCampaignRequestDTO {
    private String name;
    private String description;
    private LocalDate startDate;
    private Integer targetGrade;
    private String notes;
    private String vaccineType;
    private String location;
    //createdAt, createdBy, campaignId, status
}