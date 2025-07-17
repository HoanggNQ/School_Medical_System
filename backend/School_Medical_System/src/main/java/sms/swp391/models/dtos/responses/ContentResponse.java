package sms.swp391.models.dtos.responses;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder

public class ContentResponse {
    private Long id;
    private String title;
    private String bodyContent;
    private Long contentCategoryId;
    private String contentCategoryName;
    private String authorName;
    private String authorAvatarUrl;
    private LocalDateTime createdAt;
    private String imageUrl;
}