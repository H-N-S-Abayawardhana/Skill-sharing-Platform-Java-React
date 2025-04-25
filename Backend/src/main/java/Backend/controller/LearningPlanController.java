package Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import Backend.model.LearningPlanModel;
import Backend.repository.LearningPlanRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api")
public class LearningPlanController {
    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @PostMapping("/learning-plan")
    public LearningPlanModel newLearningPlanModel(@RequestBody LearningPlanModel newLearningPlanModel) {
        return learningPlanRepository.save(newLearningPlanModel);
    }
}
