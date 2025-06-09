package sms.swp391.models.dtos.respones;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDeclarationDetailResponseDTO {

    private Long id;
    private String category;
    private String description;
    private String severity;
    private Map<String, Object> additionalInfo;
    private String createdAt;
}