package Backend.repository;

import Backend.model.LearningPlanModel;
import org.springframework.data.jpa.repository.JpaRepository;


public interface  LearningPlanRepository extends JpaRepository<LearningPlanModel, Long> {
  

}
