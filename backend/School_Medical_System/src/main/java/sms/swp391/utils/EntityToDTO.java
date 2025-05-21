package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import sms.swp391.models.dtos.respones.NotificationResponse;
import sms.swp391.models.dtos.respones.UserResponse;
import sms.swp391.models.entities.*;



@RequiredArgsConstructor
public class EntityToDTO {

    public static UserResponse UserEntityToDTO(UserEntity userEntity) {
        return UserResponse.builder()
                .userId(userEntity.getUserId())
                .userName(userEntity.getUsername())
                .gender(userEntity.getGender())
                .phoneNumber(userEntity.getPhoneNumber())
                .dob(userEntity.getDob())
                .email(userEntity.getEmail())
                .fullName(userEntity.getFullname())
                .status(userEntity.getStatus().toString())
                .build();
    }

    public static NotificationResponse notificationEntityDTO(NotificationEntity notificationEntity) {
        return NotificationResponse.builder()
                .notificationId(notificationEntity.getNotificationId())
                .content(notificationEntity.getContent())
                .title(notificationEntity.getTitle())
                .userId(notificationEntity.getCreator().getUserId())
                .dateCreate(notificationEntity.getDateCreate())
                .build();
    }
}
