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
    private Boolean followUpRequired;
    private LocalDate nextDoseDate;
    private LocalDate expirationDate;
    private String injectionSite;
    private String lotNumber;
    private String vaccineBatch;
    private String vaccineName;
    private String followUpNotes;
    private String reactionNotes;
    private LocalDateTime scheduleTime;
    // administarterdBy, administrationDtae, id, academicYear
}