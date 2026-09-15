package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.Notification;
import com.passwordvault.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(
            Long userId,
            String type,
            String title,
            String message) {

        Notification notification = new Notification(
                userId,
                type,
                title,
                message,
                LocalDateTime.now()
        );

        Notification savedNotification =
                notificationRepository.save(notification);

        User user = userRepository.findById(userId).orElse(null);

        if (user != null && user.getEmail() != null) {

            try {

                emailService.sendNotificationEmail(
                        user.getEmail(),
                        title,
                        message
                );

            } catch (Exception e) {

                System.out.println(
                        "Email notification failed: "
                                + e.getMessage()
                );
            }
        }

        return savedNotification;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public Notification markAsRead(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setRead(true);

        return notificationRepository.save(notification);
    }
}