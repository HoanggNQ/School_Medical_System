package sms.swp391.models.dtos.responses;

import lombok.*;

@Getter
@Setter
@Builder
public class ContentCategoryResponse {
    private Long id;
    private String contentcategoryName;
}