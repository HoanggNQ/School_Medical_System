package sms.swp391.models.dtos.requests;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContentRequest {
    private String title;
    private String bodyContent;
    private Long contentCategoryId;
}