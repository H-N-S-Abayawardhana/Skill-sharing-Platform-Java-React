package Backend.repository;

import Backend.model.LearningPlanModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LearningPlanRepository extends JpaRepository<LearningPlanModel, Long> {
    List<LearningPlanModel> findByUserId(Long userId);
}