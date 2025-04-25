package Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Backend.exception.LearningPlanNotFoundException;
import Backend.model.LearningPlanModel;
import Backend.repository.LearningPlanRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api")
public class LearningPlanController {
    
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    
    // Create a new learning plan
    @PostMapping("/learning-plan")
    public LearningPlanModel newLearningPlanModel(@RequestBody LearningPlanModel newLearningPlanModel) {
        return learningPlanRepository.save(newLearningPlanModel);
    }
    
    // Get all learning plans
    @GetMapping("/learning-plans")
    public List<LearningPlanModel> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }
    
    // Get learning plans by user ID
    @GetMapping("/learning-plans/user/{userId}")
    public List<LearningPlanModel> getLearningPlansByUserId(@PathVariable Long userId) {
        return learningPlanRepository.findByUserId(userId);
    }
    
    // Get learning plan by ID
    @GetMapping("/learning-plan/{id}")
    public LearningPlanModel getLearningPlanById(@PathVariable Long id) {
        return learningPlanRepository.findById(id)
                .orElseThrow(() -> new LearningPlanNotFoundException(id));
    }
    
    // Update learning plan
    @PutMapping("/learning-plan/{id}")
    public LearningPlanModel updateLearningPlan(@RequestBody LearningPlanModel updatedPlan, @PathVariable Long id) {
        return learningPlanRepository.findById(id)
                .map(learningPlan -> {
                    learningPlan.setTitle(updatedPlan.getTitle());
                    learningPlan.setDescription(updatedPlan.getDescription());
                    learningPlan.setStartDate(updatedPlan.getStartDate());
                    learningPlan.setEndDate(updatedPlan.getEndDate());
                    learningPlan.setTopics(updatedPlan.getTopics());
                    learningPlan.setResources(updatedPlan.getResources());
                    learningPlan.setProgressPercentage(updatedPlan.getProgressPercentage());
                    learningPlan.setStatus(updatedPlan.getStatus());
                    learningPlan.setUpdatedAt(LocalDateTime.now());
                    return learningPlanRepository.save(learningPlan);
                })
                .orElseThrow(() -> new LearningPlanNotFoundException(id));
    }
    
    // Delete learning plan
    @DeleteMapping("/learning-plan/{id}")
    public ResponseEntity<?> deleteLearningPlan(@PathVariable Long id) {
        return learningPlanRepository.findById(id)
                .map(learningPlan -> {
                    learningPlanRepository.delete(learningPlan);
                    return ResponseEntity.ok().build();
                })
                .orElseThrow(() -> new LearningPlanNotFoundException(id));
    }
}