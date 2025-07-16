package sms.swp391.models.dtos.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateVaccinationRecordListRequestDTO {

    @NotNull(message = "Campaign ID không được để trống")
    private Long campaignId;

    @NotEmpty(message = "Danh sách bản ghi tiêm chủng không được để trống")
    private List<@Valid VaccinationRecordRequestDTO> records;
}
