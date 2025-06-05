package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.respones.NotificationResponse;
import sms.swp391.models.entities.NotificationEntity;
@RequiredArgsConstructor
public class NotificationMapper {
    public static NotificationResponse toDTO(NotificationEntity entity) {
        if (entity == null) return null;

        return NotificationResponse.builder()
                .notificationId(entity.getNotificationId())
                .content(entity.getContent())
                .title(entity.getTitle())
                .userId(entity.getCreator().getUserId())
                .dateCreate(entity.getDateCreate())
                .build();
    }
}