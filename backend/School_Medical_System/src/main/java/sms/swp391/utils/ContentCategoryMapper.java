package sms.swp391.utils;

import sms.swp391.models.dtos.requests.ContentCategoryRequestDTO;
import sms.swp391.models.dtos.responses.ContentCategoryResponse;
import sms.swp391.models.entities.ContentCategoryEntity;

public class ContentCategoryMapper {
    public static ContentCategoryEntity toEntity(ContentCategoryRequestDTO dto) {
        return ContentCategoryEntity.builder()
                .contentcategoryName(dto.getContentcategoryName())
                .build();
    }

    public static ContentCategoryResponse toResponse(ContentCategoryEntity entity) {
        return ContentCategoryResponse.builder()
                .id(entity.getId())
                .contentcategoryName(entity.getContentcategoryName())
                .build();
    }
}