package sms.swp391.models.dtos.responses;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class PaginatedVaccinationConsentResponse {
    private List<VaccinationConsentResponse> vaccinationConsents;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
