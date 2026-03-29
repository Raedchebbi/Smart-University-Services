package org.example.gradeservice;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    // CREATE
    public Grade addGrade(Grade grade) {
        return gradeRepository.save(grade);
    }

    // READ ALL
    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    // READ BY ID
    public Optional<Grade> getGradeById(Long id) {
        return gradeRepository.findById(id);
    }

    // UPDATE
    public Grade updateGrade(Long id, Grade newGrade) {
        return gradeRepository.findById(id)
                .map(grade -> {
                    grade.setStudentName(newGrade.getStudentName());
                    grade.setSubject(newGrade.getSubject());
                    grade.setExamType(newGrade.getExamType());
                    grade.setSemester(newGrade.getSemester());
                    grade.setScore(newGrade.getScore());
                    return gradeRepository.save(grade);
                })
                .orElseThrow(() -> new RuntimeException("Grade not found"));
    }

    // DELETE
    public void deleteGrade(Long id) {
        gradeRepository.deleteById(id);
    }

    // STATISTICS
    public Double getAverageScore() {
        return gradeRepository.getAverageScore();
    }

    public Double getMaxScore() {
        return gradeRepository.getMaxScore();
    }

    public Double getMinScore() {
        return gradeRepository.getMinScore();
    }

    public Long getTotalGrades() {
        return gradeRepository.getTotalGrades();
    }
}