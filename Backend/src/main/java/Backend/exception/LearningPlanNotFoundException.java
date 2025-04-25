package Backend.exception;

public class LearningPlanNotFoundException extends RuntimeException {
    public LearningPlanNotFoundException(Long id) {
        super("Could not find learning plan " + id);
    }
    public LearningPlanNotFoundException(String message) {
        super(message);
    }
}
