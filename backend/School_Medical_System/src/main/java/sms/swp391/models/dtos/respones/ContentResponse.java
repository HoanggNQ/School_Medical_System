package sms.swp391.models.dtos.respones;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class ContentResponse {
    private Long id;
    private String title;
    private String bodyContent;
    private Long contentCategoryId;
    private String contentCategoryName;
}