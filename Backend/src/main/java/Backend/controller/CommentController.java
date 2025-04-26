package Backend.controller;

import Backend.exception.CommentNotFoundException;
import Backend.model.CommentModel;
import Backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api")
public class CommentController {
    
    @Autowired
    private CommentRepository commentRepository;
    
    // Create a new comment
    @PostMapping("/comments")
    public CommentModel createComment(@RequestBody CommentModel newComment) {
        return commentRepository.save(newComment);
    }
    
    // Get all comments
    @GetMapping("/comments")
    public List<CommentModel> getAllComments() {
        return commentRepository.findAll();
    }
    
    // Get comments by learning plan ID
    @GetMapping("/learning-plans/{learningPlanId}/comments")
    public List<CommentModel> getCommentsByLearningPlanId(@PathVariable Long learningPlanId) {
        return commentRepository.findByLearningPlanId(learningPlanId);
    }
    
    // Get comments by user ID
    @GetMapping("/users/{userId}/comments")
    public List<CommentModel> getCommentsByUserId(@PathVariable Long userId) {
        return commentRepository.findByUserId(userId);
    }
    
    // Get a single comment by ID
    @GetMapping("/comments/{id}")
    public CommentModel getCommentById(@PathVariable Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(id));
    }
    
    // Update a comment
    @PutMapping("/comments/{id}")
    public CommentModel updateComment(@RequestBody CommentModel updatedComment, @PathVariable Long id) {
        return commentRepository.findById(id)
                .map(comment -> {
                    comment.setContent(updatedComment.getContent());
                    // We don't update learningPlanId or userId as these are relationships
                    return commentRepository.save(comment);
                })
                .orElseThrow(() -> new CommentNotFoundException(id));
    }
    
    // Delete a comment
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        if (!commentRepository.existsById(id)) {
            throw new CommentNotFoundException(id);
        }
        commentRepository.deleteById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Comment with id " + id + " has been deleted successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    // Delete all comments for a learning plan
    @DeleteMapping("/learning-plans/{learningPlanId}/comments")
    public ResponseEntity<?> deleteCommentsByLearningPlanId(@PathVariable Long learningPlanId) {
        List<CommentModel> comments = commentRepository.findByLearningPlanId(learningPlanId);
        commentRepository.deleteAll(comments);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "All comments for learning plan with id " + learningPlanId + " have been deleted");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}