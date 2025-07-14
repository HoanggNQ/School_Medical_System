package sms.swp391.models.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckResultRequestDTO {

    @NotNull(message = "ID chiến dịch không được để trống")
    private Long campaignId;

    @NotNull(message = "ID học sinh không được để trống")
    private Long studentId;

    @DecimalMin(value = "30.0", message = "Chiều cao không hợp lệ")
    @DecimalMax(value = "250.0", message = "Chiều cao vượt quá giới hạn")
    private BigDecimal heightCm;

    @DecimalMin(value = "3.0", message = "Cân nặng không hợp lệ")
    @DecimalMax(value = "200.0", message = "Cân nặng vượt quá giới hạn")
    private BigDecimal weightKg;

    @Size(max = 20, message = "Thị lực trái quá dài")
    private String visionLeft;

    @Size(max = 20, message = "Thị lực phải quá dài")
    private String visionRight;

    @Size(max = 255, message = "Thông tin thính lực quá dài")
    private String hearing;

    @Size(max = 255, message = "Thông tin răng miệng quá dài")
    private String dentalHealth;

    @Size(max = 50, message = "Huyết áp quá dài")
    private String bloodPressure;

    @Min(value = 30, message = "Nhịp tim quá thấp")
    @Max(value = 200, message = "Nhịp tim quá cao")
    private Integer pulse;

    @DecimalMin(value = "34.0", message = "Nhiệt độ thấp bất thường")
    @DecimalMax(value = "43.0", message = "Nhiệt độ cao bất thường")
    private BigDecimal temperature;

    @Size(max = 500, message = "Ghi chú khác quá dài")
    private String otherNotes;

    @Size(max = 500, message = "Khuyến nghị quá dài")
    private String recommendation;

    @Size(max = 500, message = "Ghi chú theo dõi quá dài")
    private String followUpNotes;

    @Size(max = 100, message = "Xếp loại sức khỏe quá dài")
    private String overallHealthRating;

    // Có thể kiểm tra không ở quá khứ nếu là lịch hẹn
  //  private LocalDateTime scheduleTime;

}
