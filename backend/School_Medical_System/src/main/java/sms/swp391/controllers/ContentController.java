package sms.swp391.controllers;

    import io.swagger.v3.oas.annotations.Operation;
    import lombok.AllArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import sms.swp391.models.dtos.requests.ContentRequest;
    import sms.swp391.models.dtos.respones.ContentResponse;
    import sms.swp391.models.dtos.respones.ResponseObject;
    import sms.swp391.services.ContentService;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.web.PageableDefault;
    import org.springframework.data.web.SortDefault;
    import org.springframework.data.domain.Sort;
    import sms.swp391.models.dtos.respones.PaginatedContentResponse;
    import org.springdoc.core.annotations.ParameterObject;

    import java.util.List;

    @RestController
    @RequestMapping("/api/contents")
    @AllArgsConstructor
    public class ContentController {
        private final ContentService contentService;

        @Operation(summary = "Tạo bài báo", description = "Khởi tạo một bài báo mới với mục có sẵn")
        @PostMapping("/create")
        public ResponseEntity<ResponseObject> create(@RequestBody ContentRequest request) {
            ContentResponse content = contentService.createContent(request);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("CREATE_SUCCESS")
                            .message("Content created successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(content)
                            .build()
            );
        }

        @Operation(summary = "Cập nhật bài báo", description = "Chỉnh sửa thông tin bài báo theo id")
        @PutMapping("/update/{id}")
        public ResponseEntity<ResponseObject> update(@PathVariable Long id, @RequestBody ContentRequest request) {
            ContentResponse content = contentService.updateContent(id, request);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("UPDATE_SUCCESS")
                            .message("Content updated successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(content)
                            .build()
            );
        }

        @Operation(summary = "Xóa bài báo", description = "Xóa bài báo theo ID.")
        @DeleteMapping("/delete/{id}")
        public ResponseEntity<ResponseObject> delete(@PathVariable Long id) {
            contentService.deleteContent(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("DELETE_SUCCESS")
                            .message("Content deleted successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(null)
                            .build()
            );
        }

        @Operation(summary = "Lấy bài báo theo ID", description = "Trả về thông tin bài báo theo ID.")
        @GetMapping("/getById/{id}")
        public ResponseEntity<ResponseObject> getById(@PathVariable Long id) {
            ContentResponse content = contentService.getContentById(id);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get content successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(content)
                            .build()
            );
        }

        @Operation(summary = "Lấy tất cả bài báo", description = "Trả về danh sách bài báo với phân trang và tìm kiếm.")
        @GetMapping("/getAll")
        public ResponseEntity<ResponseObject> getAll(
                @RequestParam(value = "search", required = false) String search,
                @ParameterObject
                @PageableDefault(page = 0, size = 10)
                @SortDefault.SortDefaults({
                        @SortDefault(sort = "title", direction = Sort.Direction.ASC)
                }) Pageable pageable) {
            PaginatedContentResponse contentResponse = contentService.getAllContents(search, pageable);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .code("GET_SUCCESS")
                            .message("Get all contents successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(contentResponse)
                            .build()
            );
        }

        @Operation(summary = "Tìm bài báo theo category id", description = "Trả về thông tin bài báo theo category id.")
        @GetMapping("/findContentByCategory/{categoryId}")
        public ResponseEntity<ResponseObject> getByCategory(@PathVariable Long categoryId) {
            List<ContentResponse> contents = contentService.findContentByCategory(categoryId);
            boolean found = !contents.isEmpty();
            return ResponseEntity.status(found ? HttpStatus.OK : HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .code(found ? "GET_SUCCESS" : "NOT_FOUND")
                            .message(found ? "Found contents" : "No content found for this category")
                            .status(found ? HttpStatus.OK : HttpStatus.NOT_FOUND)
                            .isSuccess(found)
                            .data(found ? contents : null)
                            .build()
            );
        }
    }