package sms.swp391.models.dtos.responses;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApprovedEventResponse {
    private String eventType;
    private Long campaignId;
    private String campaignName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String academicYear;
}
