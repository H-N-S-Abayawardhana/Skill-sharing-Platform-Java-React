package Backend.exception;

public class CommentNotFoundException extends RuntimeException {
    public CommentNotFoundException(Long id) {
        super("Could not find comment " + id);
    }
    
    public CommentNotFoundException(String message) {
        super(message);
    }
}