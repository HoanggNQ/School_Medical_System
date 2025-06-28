package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.requests.ContentCategoryRequestDTO;
import sms.swp391.models.dtos.responses.ContentCategoryResponse;
import sms.swp391.models.entities.ContentCategoryEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.ContentCategoryRepository;
import sms.swp391.services.ContentCategoryService;
import sms.swp391.utils.ContentCategoryMapper;
import sms.swp391.models.exception.ActionFailedException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ContentCategoryServiceImpl implements ContentCategoryService {
    private final ContentCategoryRepository repository;

    @Override
    public ContentCategoryResponse create(ContentCategoryRequestDTO request) {
        ContentCategoryEntity entity = ContentCategoryMapper.toEntity(request);
        return ContentCategoryMapper.toResponse(repository.save(entity));
    }

    @Override
    public ContentCategoryResponse update(Long id, ContentCategoryRequestDTO request) {
        ContentCategoryEntity entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Content category not found"));
        entity.setContentcategoryName(request.getContentcategoryName());
        return ContentCategoryMapper.toResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        ContentCategoryEntity entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Content category not found"));
        if (entity.getContentEntities() != null && !entity.getContentEntities().isEmpty()) {
            throw new ActionFailedException("Cannot delete: Content category is in use by content(s)");
        }
        repository.deleteById(id);
    }

    @Override
    public ContentCategoryResponse getById(Long id) {
        return repository.findById(id)
                .map(ContentCategoryMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Content category not found"));
    }

    @Override
    public List<ContentCategoryResponse> getAll() {
        return repository.findAll().stream()
                .map(ContentCategoryMapper::toResponse)
                .collect(Collectors.toList());
    }
}