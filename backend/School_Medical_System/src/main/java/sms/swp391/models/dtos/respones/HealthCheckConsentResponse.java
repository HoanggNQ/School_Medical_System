package sms.swp391.models.dtos.respones;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckConsentResponse {
    private Long id;
    private Long campaignId;
    private Long studentId;
    private String studentName;
    private Long parentId;
    private int phoneNumber;
    private String parentName;
    private String status;
    private Instant responseDate;
    private String notes;
    private String specialRequests;
    private String academicYear;
}
