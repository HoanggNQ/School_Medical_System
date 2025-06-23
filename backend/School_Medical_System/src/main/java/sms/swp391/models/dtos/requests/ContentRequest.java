package sms.swp391.models.dtos.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentRequest {
    private String title;
    private String bodyContent;
    private Long contentCategoryId;
}