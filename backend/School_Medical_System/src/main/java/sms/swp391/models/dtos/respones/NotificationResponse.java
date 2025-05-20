package sms.swp391.models.dtos.respones;


import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {

    private Long notificationId;


    private String content;


    private LocalDate dateCreate;


    private String title;


    private long userId ;
}
