package sms.swp391.models.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationReviewDTO {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "APPROVED|REJECTED|PENDING", message = "Status must be APPROVED, REJECTED, or PENDING")
    private String status;

    private String reviewNote;
}