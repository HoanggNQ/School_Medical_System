// MedicalEventMedicationDTO.java
package sms.swp391.models.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalEventMedicationDTO {
    private Long medicationId;
    private Integer quantity;
}
