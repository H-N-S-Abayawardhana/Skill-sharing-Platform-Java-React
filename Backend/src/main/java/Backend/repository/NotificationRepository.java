package Backend.repository;

import Backend.model.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    
    // Find all notifications for a specific user, sorted by creation date (newest first)
    List<NotificationModel> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find all unread notifications for a specific user
    List<NotificationModel> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    
    // Count unread notifications for a specific user
    long countByUserIdAndIsReadFalse(Long userId);
    
    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE NotificationModel n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    void markAllAsRead(@Param("userId") Long userId);
}