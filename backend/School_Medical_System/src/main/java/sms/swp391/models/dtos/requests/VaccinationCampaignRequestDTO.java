package sms.swp391.models.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VaccinationCampaignRequestDTO {
    @NotBlank(message = "Tên chiến dịch không được để trống")
    @Size(max = 100, message = "Tên chiến dịch không được vượt quá 100 ký tự")
    private String name;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @FutureOrPresent(message = "Ngày bắt đầu phải là hôm nay hoặc trong tương lai")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    @Future(message = "Ngày kết thúc phải sau hôm nay")
    private LocalDate endDate;

    @NotEmpty(message = "Phải chọn ít nhất một khối từ 1 đến 12")
    private List<@Pattern(regexp = "^(1[0-2]|[1-9])$", message = "Khối chỉ được từ 1 đến 12") String> targetGrade;

    @Size(max = 500, message = "Ghi chú không được vượt quá 500 ký tự")
    private String notes;

    @NotBlank(message = "Loại vắc xin không được để trống")
    @Size(max = 100, message = "Loại vắc xin không được vượt quá 100 ký tự")
    private String vaccineType;

    @NotBlank(message = "Địa điểm tiêm không được để trống")
    @Size(max = 255, message = "Địa điểm không được vượt quá 255 ký tự")
    private String location;
    //createdAt, createdBy, campaignId, status
}