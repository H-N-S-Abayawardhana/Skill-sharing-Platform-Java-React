package Backend.repository;

import Backend.model.CommentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentModel, Long> {
    // Find all comments for a specific learning plan
    List<CommentModel> findByLearningPlanId(Long learningPlanId);
    
    // Find all comments by a specific user
    List<CommentModel> findByUserId(Long userId);
    
    // Find comments by both learning plan ID and user ID
    List<CommentModel> findByLearningPlanIdAndUserId(Long learningPlanId, Long userId);
}