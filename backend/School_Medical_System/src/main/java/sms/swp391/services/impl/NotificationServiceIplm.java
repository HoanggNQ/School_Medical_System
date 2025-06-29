package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.enums.NotificationStatus;
import sms.swp391.models.dtos.requests.NotificationCreateDTO;
import sms.swp391.models.dtos.requests.NotificationUpdateDTO;
import sms.swp391.models.dtos.responses.NotificationResponse;
import sms.swp391.models.entities.NotificationEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.BusinessException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.repositories.NotificationRepository;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.NotificationService;
import sms.swp391.utils.NotificationMapper;


import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceIplm implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));

        if (!notification.getReceiver().getUserId().equals(userId)) {
            throw new BusinessException("Bạn không được phép đánh dấu thông báo này");
        }

        notification.setStatus(NotificationStatus.SEEN);
        notificationRepository.save(notification);
        return NotificationMapper.toDTO(notification);
    }

    @Override
    public List<NotificationResponse> getAllNotificationForUser(Long userId) {
        List<NotificationEntity> list = notificationRepository.findByReceiver_UserIdOrderByDateCreateDesc(userId);
        return list.stream()
                .map(NotificationMapper::toDTO)
                .toList();
    }

    @Override
    public List<NotificationResponse> getAllNotification() {
        List<NotificationEntity> notificationEntities = notificationRepository.findAll();

        return notificationEntities.stream().map(NotificationMapper::toDTO).toList();
    }
    @Override
    public NotificationResponse createNotification(NotificationCreateDTO dto) {

        UserEntity creator  = userRepository.findById(dto.getCreatorId())
                .orElseThrow(() -> new NotFoundException("Creator not found"));

        UserEntity receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new NotFoundException("Receiver not found"));   // 👈

        NotificationEntity entity = new NotificationEntity();
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setCreator(creator);
        entity.setReceiver(receiver);
        entity.setStatus(NotificationStatus.UNREAD);
        entity.setDateCreate(LocalDateTime.now());

        notificationRepository.save(entity);
        return NotificationMapper.toDTO(entity);
    }

    @Override
    public NotificationResponse push(Long creatorId,
                                     Long receiverId,
                                     String title,
                                     String content) {
        NotificationCreateDTO dto = new NotificationCreateDTO(title, content, creatorId, receiverId);
        return createNotification(dto);
    }


    @Override
    public NotificationResponse updateNotification(NotificationUpdateDTO notificationUpdateDTO) {

        NotificationEntity notificationEntity = new NotificationEntity();
        notificationEntity.setContent(notificationUpdateDTO.getContent());
        notificationEntity.setTitle(notificationUpdateDTO.getTitle());
        notificationRepository.save(notificationEntity);
        return NotificationMapper.toDTO(notificationEntity);
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
