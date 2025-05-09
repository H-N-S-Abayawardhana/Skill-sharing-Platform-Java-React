package Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import Backend.model.NotificationModel;
import Backend.repository.NotificationRepository;
import Backend.exception.NotificationNotFoundException;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    // CREATE - Create a new notification
    @PostMapping
    public NotificationModel createNotification(@RequestBody NotificationModel newNotification) {
        return notificationRepository.save(newNotification);
    }
    
    // READ - Get all notifications for a user
    @GetMapping("/user/{userId}")
    public List<NotificationModel> getUserNotifications(@PathVariable Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    // READ - Get unread notifications for a user
    @GetMapping("/user/{userId}/unread")
    public List<NotificationModel> getUnreadNotifications(@PathVariable Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    // READ - Count unread notifications for a user
    @GetMapping("/user/{userId}/unread/count")
    public Map<String, Long> countUnreadNotifications(@PathVariable Long userId) {
        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        return Map.of("count", count);
    }
    
    // READ - Get a single notification by ID
    @GetMapping("/{id}")
    public NotificationModel getNotificationById(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));
    }
    
    // UPDATE - Mark a notification as read
    @PutMapping("/{id}/read")
    public NotificationModel markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setRead(true);
                    return notificationRepository.save(notification);
                })
                .orElseThrow(() -> new NotificationNotFoundException(id));
    }
    
    // UPDATE - Mark all notifications as read for a user
    @PutMapping("/user/{userId}/mark-all-read")
    @Transactional
    public ResponseEntity<?> markAllAsRead(@PathVariable Long userId) {
        notificationRepository.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
    
    // DELETE - Delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notificationRepository.delete(notification);
                    return ResponseEntity.ok().build();
                })
                .orElseThrow(() -> new NotificationNotFoundException(id));
    }
}