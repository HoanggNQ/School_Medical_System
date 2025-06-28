package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Builder
@Data
public class MedicationRequestResponseDTO {
    private Long id;
    private Long studentId;
    private String studentName;       // optional nếu chỉ cần studentId
    private String academicYear;
    private String priority;
    private String status;
    private String notes;
    private LocalDate requestDate;
    private List<MedicationRequestDetailResponseDTO> details;
}
