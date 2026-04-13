package org.example.gradeservice;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/grades")
@CrossOrigin(origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST,
                RequestMethod.PUT, RequestMethod.DELETE},
        allowedHeaders = "*")
public class GradeRestAPI {

    private final GradeService gradeService;

    public GradeRestAPI(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    // 📌 CREATE a new grade
    // POST http://localhost:8084/grades
    @PostMapping
    public Grade addGrade(@RequestBody Grade grade) {
        return gradeService.addGrade(grade);
    }

    // 📌 GET ALL grades
    // GET http://localhost:8084/grades
    @GetMapping
    public List<Grade> getAllGrades() {
        return gradeService.getAllGrades();
    }

    // 📌 GET grade by ID
    // GET http://localhost:8084/grades/{id}
    @GetMapping("/{id}")
    public Grade getGradeById(@PathVariable Long id) {
        return gradeService.getGradeById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
    }

    // 📌 UPDATE a grade by ID
    // PUT http://localhost:8084/grades/{id}
    @PutMapping("/{id}")
    public Grade updateGrade(@PathVariable Long id, @RequestBody Grade grade) {
        return gradeService.updateGrade(id, grade);
    }

    // 📌 DELETE a grade by ID
    // DELETE http://localhost:8084/grades/{id}
    @DeleteMapping("/{id}")
    public void deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
    }

    // 📌 GET average score
    // GET http://localhost:8084/grades/stats/average
    @GetMapping("/stats/average")
    public Double getAverage() {
        return gradeService.getAverageScore();
    }

    // 📌 GET max score
    // GET http://localhost:8084/grades/stats/max
    @GetMapping("/stats/max")
    public Double getMax() {
        return gradeService.getMaxScore();
    }

    // 📌 GET min score
    // GET http://localhost:8084/grades/stats/min
    @GetMapping("/stats/min")
    public Double getMin() {
        return gradeService.getMinScore();
    }

    // 📌 GET total number of grades
    // GET http://localhost:8084/grades/stats/count
    @GetMapping("/stats/count")
    public Long getTotal() {
        return gradeService.getTotalGrades();
    }
}