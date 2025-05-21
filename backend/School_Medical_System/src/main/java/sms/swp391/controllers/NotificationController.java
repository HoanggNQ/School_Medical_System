package sms.swp391.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.requests.NotificationCreateDTO;
import sms.swp391.models.dtos.requests.NotificationUpdateDTO;
import sms.swp391.models.dtos.respones.NotificationResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.services.NotificationService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notification")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping()
    public ResponseEntity<ResponseObject> listUser() {
        List<NotificationResponse> notificationResponses = notificationService.getAllNotification();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get list successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(notificationResponses)
                        .build()
        );
    }
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> create(@RequestBody NotificationCreateDTO notificationCreateDTO) {
        NotificationResponse notificationResponses = notificationService.createNotification( notificationCreateDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("CREATE successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(notificationResponses)
                        .build()
        );
    }
    @PutMapping("update/{id}")
    public ResponseEntity<ResponseObject> update(@RequestBody NotificationUpdateDTO notificationUpdateDTO) {
        NotificationResponse notificationResponses = notificationService.updateNotification( notificationUpdateDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("UPDATE successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(notificationResponses)
                        .build()
        );
    }
    @DeleteMapping("delete{id}")
    public ResponseEntity<ResponseObject> delete(@PathVariable long id) {
        NotificationResponse notificationResponses = notificationService.deleteNotification( id);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("delete successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(notificationResponses)
                        .build()
        );
    }
}
