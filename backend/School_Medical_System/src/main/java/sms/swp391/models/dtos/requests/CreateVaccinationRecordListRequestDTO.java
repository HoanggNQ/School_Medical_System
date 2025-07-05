package sms.swp391.models.dtos.requests;

import jakarta.validation.Valid;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateVaccinationRecordListRequestDTO {
    private Long campaignId;
    private List<@Valid VaccinationRecordRequestDTO> records;
}