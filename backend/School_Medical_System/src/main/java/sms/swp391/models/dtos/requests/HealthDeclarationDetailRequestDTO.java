package sms.swp391.models.dtos.requests;


import lombok.*;
import jakarta.validation.constraints.*;
import java.util.Map;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationDetailRequestDTO {

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @Size(max = 20, message = "Severity must not exceed 20 characters")
    private String severity;

    private Map<String, Object> additionalInfo;
}