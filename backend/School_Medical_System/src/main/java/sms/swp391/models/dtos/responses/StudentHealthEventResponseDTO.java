package sms.swp391.models.dtos.responses;
import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentHealthEventResponseDTO {
    private String type;
    private Long campaignId;
    private String campaignName;
    private Long consentId;
    private String consentStatusText;
    private LocalDate startDate;
    private LocalDate endDate;
    private String consentStatus;
    private String studentName;
    private String location;
    private String resultStatus;
}
