package sms.swp391.models.dtos.responses;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedMedicalEventResponse {
    private List<MedicalEventResponse> medicalEvents;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
