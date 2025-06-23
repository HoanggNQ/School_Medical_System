package sms.swp391.models.dtos.respones;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VaccinationCampaignResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate endDate;
    private LocalDate startDate;
    private String status;
    private Integer targetGrade;
    private String notes;
    private String vaccineType;
    private Long createdById;
    private Instant createdAt;
}
