package sms.swp391.services;

import sms.swp391.models.dtos.requests.ContentCategoryRequestDTO;
import sms.swp391.models.dtos.respones.ContentCategoryResponse;

import java.util.List;

public interface ContentCategoryService {
    ContentCategoryResponse create(ContentCategoryRequestDTO request);
    ContentCategoryResponse update(Long id, ContentCategoryRequestDTO request);
    void delete(Long id);
    ContentCategoryResponse getById(Long id);
    List<ContentCategoryResponse> getAll();
}