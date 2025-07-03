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
public class HealthCheckCampaignRequestDTO {
    @NotBlank(message = "Tên chiến dịch không được để trống")
    private String name;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @Future(message = "Ngày bắt đầu phải sau hôm nay")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    @Future(message = "Ngày kết thúc phải sau hôm nay")
    private LocalDate endDate;

    @NotEmpty(message = "Phải chọn ít nhất một khối từ 1 đến 12")
    private List<@Pattern(regexp = "^(1[0-2]|[1-9])$", message = "Khối chỉ được từ 1 đến 12") String> targetGrade;

    @NotBlank(message = "Địa điểm không được để trống")
    private String location;
}
