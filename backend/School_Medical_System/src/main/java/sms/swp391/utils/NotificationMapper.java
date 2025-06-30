package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.requests.NotificationCreateDTO;
import sms.swp391.models.dtos.responses.NotificationResponse;
import sms.swp391.models.entities.NotificationEntity;
import sms.swp391.models.entities.UserEntity;

import java.time.LocalDateTime;

@RequiredArgsConstructor
public class NotificationMapper {
    public static NotificationResponse toDTO(NotificationEntity e) {
        return NotificationResponse.builder()
                .notificationId(e.getNotificationId())
                .title(e.getTitle())
                .content(e.getContent())
                .dateCreate(e.getDateCreate())
                .userId(e.getReceiver().getUserId())
                .build();
    }


    public static NotificationEntity fromDTO(NotificationCreateDTO dto, UserEntity creator) {
        NotificationEntity entity = new NotificationEntity();
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setCreator(creator);
        entity.setDateCreate(LocalDateTime.now());
        return entity;
    }

}