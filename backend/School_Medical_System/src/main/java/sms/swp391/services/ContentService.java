// src/main/java/sms/swp391/services/ContentService.java
    package sms.swp391.services;

    import sms.swp391.models.dtos.requests.ContentRequest;
    import sms.swp391.models.dtos.respones.ContentResponse;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import sms.swp391.models.dtos.respones.PaginatedContentResponse;
    import sms.swp391.models.entities.ContentEntity;
    import java.util.List;

    public interface ContentService {
        ContentResponse createContent(ContentRequest request);
        ContentResponse updateContent(Long id, ContentRequest request);
        void deleteContent(Long id);
        ContentResponse getContentById(Long id);
        List<ContentResponse> findContentByCategory(Long contentCategoryId);


        PaginatedContentResponse getAllContents(String search, Pageable pageable);
    }