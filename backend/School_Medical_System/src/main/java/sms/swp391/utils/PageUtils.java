package sms.swp391.utils;

import org.springframework.data.domain.Page;
import sms.swp391.models.dtos.responses.PagedResponse;

// util/PageUtils.java
public final class PageUtils {
    private PageUtils() {}

    public static <T> PagedResponse<T> toPagedResponse(Page<T> page) {
        return PagedResponse.<T>builder()
                .content(page.getContent())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
