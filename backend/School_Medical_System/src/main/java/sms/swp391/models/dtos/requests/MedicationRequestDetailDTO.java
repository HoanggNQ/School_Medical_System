package sms.swp391.models.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRequestDetailDTO {
    private Long medicationId;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer quantity;
    private Boolean providedByParent; // true = phụ huynh gửi thuốc, false/null = dùng thuốc từ kho
}

