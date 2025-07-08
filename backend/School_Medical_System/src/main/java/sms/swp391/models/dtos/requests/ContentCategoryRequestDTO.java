package sms.swp391.models.dtos.requests;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ContentCategoryRequestDTO {
    private String contentcategoryName;
}