package org.example.gradeservice;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/grades")
public class GradeRestAPI {

    private final GradeService gradeService;

    public GradeRestAPI(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public Grade addGrade(@RequestBody Grade grade) {
        return gradeService.addGrade(grade);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public List<Grade> getAllGrades() {
        return gradeService.getAllGrades();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public Grade getGradeById(@PathVariable Long id) {
        return gradeService.getGradeById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public Grade updateGrade(@PathVariable Long id, @RequestBody Grade grade) {
        return gradeService.updateGrade(id, grade);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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