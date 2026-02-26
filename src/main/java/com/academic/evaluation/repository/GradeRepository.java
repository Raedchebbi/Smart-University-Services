package com.academic.evaluation.repository;

import com.academic.evaluation.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour l'entité Grade
 */
@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    /**
     * Récupère toutes les notes d'un étudiant
     * 
     * @param studentId l'identifiant de l'étudiant
     * @return liste des notes
     */
    List<Grade> findByStudentId(Long studentId);

    /**
     * Récupère toutes les notes pour un cours
     * 
     * @param courseId l'identifiant du cours
     * @return liste des notes
     */
    List<Grade> findByCourseId(Long courseId);

    /**
     * Récupère les notes d'un étudiant pour un cours
     * 
     * @param studentId l'identifiant de l'étudiant
     * @param courseId  l'identifiant du cours
     * @return liste des notes
     */
    List<Grade> findByStudentIdAndCourseId(Long studentId, Long courseId);

    /**
     * Récupère les notes par session
     * 
     * @param session la session d'examen
     * @return liste des notes pour cette session
     */
    List<Grade> findBySession(String session);

    /**
     * Calcule la moyenne d'un étudiant
     * 
     * @param studentId l'identifiant de l'étudiant
     * @return la moyenne des notes
     */
    @Query("SELECT AVG(g.value) FROM Grade g WHERE g.studentId = :studentId")
    Double calculateAverageByStudent(@Param("studentId") Long studentId);
}
