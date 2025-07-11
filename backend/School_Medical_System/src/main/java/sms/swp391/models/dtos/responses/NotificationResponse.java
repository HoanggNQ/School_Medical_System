package sms.swp391.models.dtos.responses;


import lombok.*;
import sms.swp391.models.dtos.enums.NotificationStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {

    private Long notificationId;


    private String content;


    private LocalDateTime dateCreate;


    private String title;


    private Long userId ;
    private NotificationStatus status ;
}
