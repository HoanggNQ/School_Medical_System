package sms.swp391.models.dtos.requests;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationUpdateDTO {

    @NotBlank(message = "Academic year is required")
    @Size(max = 9, message = "Academic year must not exceed 9 characters")
    @Pattern(regexp = "\\d{4}-\\d{4}", message = "Academic year must be in format YYYY-YYYY")
    private String academicYear;

    @NotEmpty(message = "Health declaration details are required")
    @Valid
    private List<HealthDeclarationDetailRequestDTO> details;
}