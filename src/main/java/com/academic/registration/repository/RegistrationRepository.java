package com.academic.registration.repository;

import com.academic.registration.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Registration
 */
@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    /**
     * Récupère toutes les inscriptions d'un étudiant
     * 
     * @param studentId l'identifiant de l'étudiant
     * @return liste des inscriptions
     */
    List<Registration> findByStudentId(Long studentId);

    /**
     * Récupère toutes les inscriptions à un cours
     * 
     * @param courseId l'identifiant du cours
     * @return liste des inscriptions
     */
    List<Registration> findByCourseId(Long courseId);

    /**
     * Vérifie si un étudiant est déjà inscrit à un cours
     * 
     * @param studentId l'identifiant de l'étudiant
     * @param courseId  l'identifiant du cours
     * @return true si l'inscription existe déjà
     */
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    /**
     * Trouve une inscription spécifique étudiant/cours
     * 
     * @param studentId l'identifiant de l'étudiant
     * @param courseId  l'identifiant du cours
     * @return l'inscription si elle existe
     */
    Optional<Registration> findByStudentIdAndCourseId(Long studentId, Long courseId);
}
