package sms.swp391.models.dtos.requests;

import lombok.Data;

@Data
public class ConfirmScheduleRequestDTO {
    private Long studentId;
    private Long campaignId;
}
