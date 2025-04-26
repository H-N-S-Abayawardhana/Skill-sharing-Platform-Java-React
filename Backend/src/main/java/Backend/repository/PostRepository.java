package Backend.repository;

import Backend.model.PostModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<PostModel, Long> {
    // Custom methods can be added here if needed
}