package sms.swp391.models.dtos.responses;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CampaignStatusStatsDTO {
    private Long total;
    private Long pending;
    private Long approved;
    private Long active;
    private Long done;
    private Long rejected;
}
