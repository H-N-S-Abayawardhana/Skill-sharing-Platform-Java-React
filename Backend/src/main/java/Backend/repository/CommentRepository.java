package Backend.repository;

import Backend.model.CommentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<CommentModel, Long> {
    // Find all comments for a specific post
    List<CommentModel> findByPostId(Long postId);
    
    // Find all replies to a specific comment
    List<CommentModel> findByParentCommentId(Long parentCommentId);
    
    // Find all top-level comments (no parent) for a specific post  
    List<CommentModel> findByPostIdAndParentCommentIdIsNull(Long postId);
    
    // Find comments by user
    List<CommentModel> findByUserId(Long userId);
}