package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MedicalEventMedicationResponse {
    private String medicationName;
    private Integer quantity;
}
