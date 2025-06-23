package sms.swp391.models.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRequestCreateDTO {
    private Long studentId;
    private String notes;
    private String priority; // Optional: LOW / NORMAL / HIGH
    private List<MedicationRequestDetailDTO> medications;
}
