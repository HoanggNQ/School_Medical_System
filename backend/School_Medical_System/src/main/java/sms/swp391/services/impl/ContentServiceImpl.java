package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.requests.ContentRequest;
import sms.swp391.models.dtos.respones.ContentResponse;
import sms.swp391.models.entities.ContentCategoryEntity;
import sms.swp391.models.entities.ContentEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.ContentCategoryRepository;
import sms.swp391.repositories.ContentRepository;
import sms.swp391.services.ContentService;
import sms.swp391.utils.ContentMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sms.swp391.models.dtos.respones.PaginatedContentResponse;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import java.util.stream.Collectors;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {
    private final ContentRepository contentRepository;
    private final ContentCategoryRepository contentCategoryRepository;

    @Override
    public ContentResponse createContent(ContentRequest request) {
        ContentCategoryEntity category = contentCategoryRepository.findById(request.getContentCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));
        ContentEntity entity = new ContentEntity();
        entity.setTitle(request.getTitle());
        entity.setBodyContent(request.getBodyContent());
        entity.setContentCategoryEntity(category);
        return ContentMapper.toResponse(contentRepository.save(entity));
    }

    @Override
    public ContentResponse updateContent(Long id, ContentRequest request) {
        ContentEntity entity = contentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Content not found"));
        ContentCategoryEntity category = contentCategoryRepository.findById(request.getContentCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));
        entity.setTitle(request.getTitle());
        entity.setBodyContent(request.getBodyContent());
        entity.setContentCategoryEntity(category);
        return ContentMapper.toResponse(contentRepository.save(entity));
    }

    @Override
    public void deleteContent(Long id) {
        if (!contentRepository.existsById(id)) throw new NotFoundException("Content not found");
        contentRepository.deleteById(id);
    }

    @Override
    public ContentResponse getContentById(Long id) {
        return contentRepository.findById(id)
                .map(ContentMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Content not found"));
    }

    @Override
    public PaginatedContentResponse getAllContents(String search, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String property = order.getProperty();
                    return property.equals("title") || property.equals("id");
                })
                .collect(Collectors.collectingAndThen(
                        Collectors.toList(),
                        Sort::by
                ));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<ContentEntity> contentPage;
        if (search != null && !search.isEmpty()) {
            contentPage = contentRepository.searchContents(search, validatedPageable);
        } else {
            contentPage = contentRepository.findAll(validatedPageable);
        }

        List<ContentResponse> contentDTOs = contentPage.stream()
                .map(ContentMapper::toResponse)
                .toList();

        return PaginatedContentResponse.builder()
                .contents(contentDTOs)
                .totalElements(contentPage.getTotalElements())
                .totalPages(contentPage.getTotalPages())
                .currentPage(contentPage.getNumber())
                .build();
    }

    @Override
    public List<ContentResponse> findContentByCategory(Long contentCategoryId) {
        return contentRepository.findByContentCategoryEntity_Id(contentCategoryId)
                .stream().map(ContentMapper::toResponse).toList();
    }
}