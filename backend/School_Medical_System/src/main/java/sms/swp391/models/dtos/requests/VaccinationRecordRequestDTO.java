package sms.swp391.models.dtos.requests;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VaccinationRecordRequestDTO {
    private Long campaignId;
    private Long studentId;
    private String injectionSite;
    private String vaccineName;
    private String followUpNotes;
    private String reactionNotes;
}