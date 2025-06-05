package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.requests.NotificationCreateDTO;
import sms.swp391.models.dtos.requests.NotificationUpdateDTO;
import sms.swp391.models.dtos.respones.NotificationResponse;
import sms.swp391.models.entities.NotificationEntity;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.NotificationRepository;
import sms.swp391.services.NotificationService;
import sms.swp391.utils.NotificationMapper;


import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceIplm implements NotificationService {

    private final NotificationRepository notificationRepository;
    @Override
    public List<NotificationResponse> getAllNotification() {
        List<NotificationEntity> notificationEntities = notificationRepository.findAll();

        var notificationResponses = notificationEntities.stream().map(NotificationMapper::toDTO).toList();
        return notificationResponses;
    }
    @Override
    public NotificationResponse createNotification(NotificationCreateDTO notificationCreateDTO) {
        NotificationEntity notificationEntity = new NotificationEntity();
        notificationEntity.setContent(notificationCreateDTO.getContent());
        notificationEntity.setTitle(notificationCreateDTO.getTitle());
        notificationEntity.setDateCreate(LocalDate.now());
        notificationRepository.save(notificationEntity);
        NotificationResponse notificationResponse = NotificationMapper.toDTO(notificationEntity);

        return notificationResponse;
    }

    @Override
    public NotificationResponse updateNotification(NotificationUpdateDTO notificationUpdateDTO) {

        NotificationEntity notificationEntity = new NotificationEntity();
        notificationEntity.setContent(notificationUpdateDTO.getContent());
        notificationEntity.setTitle(notificationUpdateDTO.getTitle());
        notificationRepository.save(notificationEntity);
        NotificationResponse notificationResponse = NotificationMapper.toDTO(notificationEntity);
        return notificationResponse;
    }

    @Override
    public NotificationResponse deleteNotification(long id) {
        NotificationEntity notificationEntity = notificationRepository.findById(id).orElseThrow(
                ()-> new NotFoundException("Notification with id " + id + " not found")
        );
        notificationRepository.delete(notificationEntity);
        return null;
    }

}
