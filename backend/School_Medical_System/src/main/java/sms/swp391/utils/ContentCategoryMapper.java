package sms.swp391.utils;

import sms.swp391.models.dtos.requests.ContentCategoryRequestDTO;
import sms.swp391.models.dtos.responses.ContentCategoryResponse;
import sms.swp391.models.entities.ContentCategoryEntity;

public class ContentCategoryMapper {
    public static ContentCategoryEntity toEntity(ContentCategoryRequestDTO dto) {
        ContentCategoryEntity entity = new ContentCategoryEntity();
        entity.setContentcategoryName(dto.getContentcategoryName());
        return entity;
    }

    public static ContentCategoryResponse toResponse(ContentCategoryEntity entity) {
        ContentCategoryResponse response = new ContentCategoryResponse();
        response.setId(entity.getId());
        response.setContentcategoryName(entity.getContentcategoryName());
        return response;
    }
}