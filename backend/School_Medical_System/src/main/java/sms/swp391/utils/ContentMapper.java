package sms.swp391.utils;

import sms.swp391.models.dtos.responses.ContentResponse;
import sms.swp391.models.entities.ContentEntity;

public class ContentMapper {
    public static ContentResponse toResponse(ContentEntity entity) {
        if (entity == null) return null;

        return ContentResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .bodyContent(entity.getBodyContent())
                .contentCategoryId(entity.getContentCategoryEntity().getId())
                .contentCategoryName(entity.getContentCategoryEntity().getContentcategoryName())
                .authorName(entity.getCreatedBy().getFullname())
                .authorAvatarUrl(entity.getCreatedBy().getAvatarurl()) // đảm bảo UserEntity có trường này
                .createdAt(entity.getCreatedAt())
                .build();
    }
}