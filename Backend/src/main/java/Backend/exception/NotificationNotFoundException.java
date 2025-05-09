package Backend.exception;

public class NotificationNotFoundException extends RuntimeException {
    
    public NotificationNotFoundException(Long id) {
        super("Could not find notification with id: " + id);
    }
}