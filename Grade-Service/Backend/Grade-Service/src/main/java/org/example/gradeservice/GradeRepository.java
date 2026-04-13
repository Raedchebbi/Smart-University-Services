package org.example.gradeservice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GradeRepository extends JpaRepository<Grade, Long> {

    @Query("SELECT AVG(g.score) FROM Grade g")
    Double getAverageScore();

    @Query("SELECT MAX(g.score) FROM Grade g")
    Double getMaxScore();

    @Query("SELECT MIN(g.score) FROM Grade g")
    Double getMinScore();

    @Query("SELECT COUNT(g) FROM Grade g")
    Long getTotalGrades();
}