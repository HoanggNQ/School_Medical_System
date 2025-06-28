package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class MedicationRequestDetailResponseDTO {
    private Long medicationId;
    private String medicationName;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer quantity;
    private Boolean providedByParent;
}