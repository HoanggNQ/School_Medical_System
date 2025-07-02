package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    @Override
    @Transactional
        public List<NotificationResponse> getAllNotificationForUser(Long userId) {
        return notificationRepository.findByReceiver_UserIdOrderByDateCreateDesc(userId)
                .stream()
                .map(NotificationMapper::toDTO)
                .toList();
    }

    @Override
    public List<NotificationResponse> getAllNotification() {
        return notificationRepository.findAll()
                .stream()
                .map(NotificationMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));

        if (!notification.getReceiver().getUserId().equals(userId)) {
            throw new BusinessException("Bạn không được phép đánh dấu thông báo này");
        }
        if (notification.getStatus() == NotificationStatus.SEEN) {
            // đã đọc rồi – trả về luôn
            return NotificationMapper.toDTO(notification);
        }

        notification.setStatus(NotificationStatus.SEEN);
        return NotificationMapper.toDTO(notification);   // hibernate tự flush
    }

    @Override
    @Transactional
    public NotificationResponse createNotification(NotificationCreateDTO dto) {
        UserEntity creator = userRepository.findById(dto.getCreatorId())
                .orElseThrow(() -> new NotFoundException("Creator not found"));
        UserEntity receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new NotFoundException("Receiver not found"));

        NotificationEntity entity = NotificationEntity.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .creator(creator)
                .receiver(receiver)
                .status(NotificationStatus.UNREAD)
                .dateCreate(LocalDateTime.now())
                .build();

        notificationRepository.save(entity);
        return NotificationMapper.toDTO(entity);
    }


    @Override
    @Transactional
    public NotificationResponse push(Long creatorId,
                                     Long receiverId,
                                     String title,
                                     String content) {
        return createNotification(new NotificationCreateDTO(title, content, creatorId, receiverId));
    }


    @Override
    @Transactional
    public NotificationResponse updateNotification(NotificationUpdateDTO dto) {
        NotificationEntity entity = notificationRepository.findById(dto.getId())
                .orElseThrow(() -> new NotFoundException("Notification not found"));

        if (dto.getTitle() != null) entity.setTitle(dto.getTitle());
        if (dto.getContent() != null) entity.setContent(dto.getContent());

        return NotificationMapper.toDTO(entity); // entity đã cập nhật, Hibernate flush
    }


    @Override
    @Transactional
    public NotificationResponse deleteNotification(long id) {
        NotificationEntity entity = notificationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Notification with id " + id + " not found"));

        notificationRepository.delete(entity);
        return NotificationMapper.toDTO(entity);
    }
}
