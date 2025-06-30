package sms.swp391.models.dtos.responses;
import lombok.*;
import sms.swp391.models.dtos.enums.MedicalStatus;

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
    private MedicalStatus status;
    private Integer targetGrade;
    private String notes;
    private String vaccineType;
    private Long createdById;
    private LocalDate createdAt;
    private String location;
}
