package sms.swp391.models.dtos.responses;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VaccinationRecordResponse {
    private Long id;
    private Long campaignId;
    private Long studentId;
    private String studentName;
    private Long administrationById;
    private String administrationByName;
    private Instant administrationDate;
    private String academicYear;
    private LocalDate expirationDate;
    private Boolean followUpRequired;
    private LocalDate nextDoseDate;
    private String injectionSite;
    private String lotNumber;
    private String vaccineBatch;
    private String vaccineName;
    private String followUpNotes;
    private String reactionNotes;

}
