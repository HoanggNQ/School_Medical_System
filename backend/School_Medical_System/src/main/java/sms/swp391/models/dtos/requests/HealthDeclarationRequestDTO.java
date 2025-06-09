package sms.swp391.models.dtos.requests;

import lombok.*;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import java.util.List;

// DTO for creating health declaration
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationRequestDTO {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Academic year is required")
    @Size(max = 9, message = "Academic year must not exceed 9 characters")
    @Pattern(regexp = "\\d{4}-\\d{4}", message = "Academic year must be in format YYYY-YYYY")
    private String academicYear;

    @NotEmpty(message = "Health declaration details are required")
    @Valid
    private List<HealthDeclarationDetailRequestDTO> details;
}