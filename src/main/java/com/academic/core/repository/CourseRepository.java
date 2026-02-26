package com.academic.core.repository;

import com.academic.core.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour l'entité Course
 * Fournit les opérations CRUD et des requêtes personnalisées
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * Recherche des cours par titre (contient)
     * @param title le titre à rechercher
     * @return liste des cours trouvés
     */
    List<Course> findByTitleContainingIgnoreCase(String title);

    /**
     * Recherche des cours par nombre de crédits
     * @param credits le nombre de crédits
     * @return liste des cours avec ce nombre de crédits
     */
    List<Course> findByCredits(Integer credits);

    /**
     * Vérifier si un cours existe par son titre (exact)
     * @param title le titre du cours
     * @return true si le titre existe
     */
    boolean existsByTitle(String title);
}
