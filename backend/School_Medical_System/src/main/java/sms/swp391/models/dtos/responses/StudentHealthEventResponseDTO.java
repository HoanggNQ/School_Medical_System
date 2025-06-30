package sms.swp391.models.dtos.responses;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentHealthEventResponseDTO {
    private String type;                    // "HEALTH_CHECK" / "VACCINATION"
    private Long eventId;
    private String campaign;
    private String description;
    private LocalDate checkDate;
    private String studentName;
    private String location;
    private String requirementEquipment;
    private String consentStatus;
    private boolean completed;
    private String resultStatus;
}
