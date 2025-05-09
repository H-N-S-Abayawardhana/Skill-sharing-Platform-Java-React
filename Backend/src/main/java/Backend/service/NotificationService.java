package Backend.service;

import Backend.model.NotificationModel;
import Backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    // Create comment notification
    public void createCommentNotification(Long postOwnerId, Long commenterId, Long postId, Long commentId) {
        if (postOwnerId.equals(commenterId)) {
            return; // Don't notify for own comments
        }
        
        NotificationModel notification = new NotificationModel();
        notification.setUserId(postOwnerId);
        notification.setMessage("Someone commented on your post");
        notification.setType("comment");
        notification.setResourceId(postId);
        notification.setResourceType("post");
        
        notificationRepository.save(notification);
    }
    
    // Create reply notification
    public void createReplyNotification(Long commentOwnerId, Long replierId, Long commentId, Long replyId) {
        if (commentOwnerId.equals(replierId)) {
            return; // Don't notify for own replies
        }
        
        NotificationModel notification = new NotificationModel();
        notification.setUserId(commentOwnerId);
        notification.setMessage("Someone replied to your comment");
        notification.setType("reply");
        notification.setResourceId(commentId);
        notification.setResourceType("comment");
        
        notificationRepository.save(notification);
    }
    
    // Create like notification (for post)
    public void createPostLikeNotification(Long postOwnerId, Long likerId, Long postId) {
        if (postOwnerId.equals(likerId)) {
            return; // Don't notify for own likes
        }
        
        NotificationModel notification = new NotificationModel();
        notification.setUserId(postOwnerId);
        notification.setMessage("Someone liked your post");
        notification.setType("like");
        notification.setResourceId(postId);
        notification.setResourceType("post");
        
        notificationRepository.save(notification);
    }
    
    // Create like notification (for comment)
    public void createCommentLikeNotification(Long commentOwnerId, Long likerId, Long commentId) {
        if (commentOwnerId.equals(likerId)) {
            return; // Don't notify for own likes
        }
        
        NotificationModel notification = new NotificationModel();
        notification.setUserId(commentOwnerId);
        notification.setMessage("Someone liked your comment");
        notification.setType("like");
        notification.setResourceId(commentId);
        notification.setResourceType("comment");
        
        notificationRepository.save(notification);
    }
}