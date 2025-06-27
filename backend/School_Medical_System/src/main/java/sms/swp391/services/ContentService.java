// src/main/java/sms/swp391/services/ContentService.java
    package sms.swp391.services;

    import sms.swp391.models.dtos.requests.ContentRequest;
    import sms.swp391.models.dtos.responses.ContentResponse;
    import org.springframework.data.domain.Pageable;
    import sms.swp391.models.dtos.responses.PaginatedContentResponse;

    import java.util.List;

    public interface ContentService {
        ContentResponse createContent(ContentRequest request);
        ContentResponse updateContent(Long id, ContentRequest request);
        void deleteContent(Long id);
        ContentResponse getContentById(Long id);
        List<ContentResponse> findContentByCategory(Long contentCategoryId);


        PaginatedContentResponse getAllContents(String search, Pageable pageable);
    }