package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.NotificationCreateDTO;
import sms.swp391.models.dtos.requests.NotificationUpdateDTO;
import sms.swp391.models.dtos.responses.NotificationResponse;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.services.NotificationService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notification")
@Tag(name = "Notification", description = "Quản lý thông báo trong hệ thống")
public class NotificationController {

    private final NotificationService notificationService;

    private Long getCurrentUserId() {
        return ((UserEntity) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal()).getUserId();
    }

    @Operation(summary = "Lấy thông báo của người dùng hiện tại",
            description = "Trả về danh sách thông báo thuộc về người dùng đang đăng nhập.")
    @GetMapping
    public ResponseEntity<ResponseObject> getMyNotifications() {
        Long userId = getCurrentUserId();
        List<NotificationResponse> data = notificationService.getAllNotificationForUser(userId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Lấy thông báo cá nhân thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(data)
                        .build()
        );
    }

    @Operation(summary = "Đánh dấu thông báo đã đọc",
            description = "Đánh dấu một thông báo là đã đọc dựa trên ID.")
    @PutMapping("/{id}/read")
    public ResponseEntity<ResponseObject> markAsRead(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        NotificationResponse data = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("MARK_READ_SUCCESS")
                        .message("Đã đánh dấu là đã đọc")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(data)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả thông báo",
            description = "Lấy danh sách toàn bộ thông báo (chỉ dành cho Admin hoặc mục tiêu debug).")
    @GetMapping("/all")
    public ResponseEntity<ResponseObject> listAllNotifications() {
        List<NotificationResponse> data = notificationService.getAllNotification();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_ALL_SUCCESS")
                        .message("Lấy toàn bộ thông báo thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(data)
                        .build()
        );
    }

    @Operation(summary = "Tạo mới thông báo",
            description = "Tạo một thông báo mới dựa trên thông tin được cung cấp.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> create(@RequestBody NotificationCreateDTO dto) {
        NotificationResponse data = notificationService.createNotification(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Tạo thông báo thành công")
                        .status(HttpStatus.CREATED)
                        .isSuccess(true)
                        .data(data)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật thông báo",
            description = "Cập nhật nội dung của một thông báo.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> update(
            @PathVariable Long id,
            @RequestBody NotificationUpdateDTO dto) {
        dto.setId(id); // đảm bảo DTO có id
        NotificationResponse data = notificationService.updateNotification(dto);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Cập nhật thông báo thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(data)
                        .build()
        );
    }

    @Operation(summary = "Xóa thông báo",
            description = "Xóa một thông báo theo ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable long id) {
        NotificationResponse data = notificationService.deleteNotification(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Xóa thông báo thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(data)
                        .build()
        );
    }
}
