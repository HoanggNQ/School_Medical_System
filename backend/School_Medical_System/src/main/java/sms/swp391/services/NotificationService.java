package sms.swp391.services;

import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.requests.NotificationCreateDTO;
import sms.swp391.models.dtos.requests.NotificationUpdateDTO;
import sms.swp391.models.dtos.respones.NotificationResponse;


import java.util.List;

@Service
public interface NotificationService {
    List<NotificationResponse> getAllNotification();

    NotificationResponse createNotification(NotificationCreateDTO notificationCreateDTO);

    NotificationResponse updateNotification(NotificationUpdateDTO notificationUpdateDTO);

    NotificationResponse deleteNotification(long id);
}
