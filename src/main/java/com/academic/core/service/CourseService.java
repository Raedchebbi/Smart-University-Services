package com.academic.core.service;

import com.academic.core.entity.Course;
import com.academic.core.exception.ResourceNotFoundException;
import com.academic.core.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service pour la gestion des cours
 * Contient la logique métier pour les opérations CRUD
 */
@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // =============================================
    // CRUD Operations
    // =============================================

    /**
     * Récupère tous les cours
     * 
     * @return liste de tous les cours
     */
    @Transactional(readOnly = true)
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    /**
     * Récupère un cours par son ID
     * 
     * @param id l'identifiant du cours
     * @return le cours trouvé
     * @throws ResourceNotFoundException si le cours n'existe pas
     */
    @Transactional(readOnly = true)
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", id));
    }

    /**
     * Crée un nouveau cours
     * 
     * @param course les données du cours
     * @return le cours créé
     */
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    /**
     * Met à jour un cours existant
     * 
     * @param id            l'identifiant du cours
     * @param updatedCourse les nouvelles données
     * @return le cours mis à jour
     * @throws ResourceNotFoundException si le cours n'existe pas
     */
    public Course updateCourse(Long id, Course updatedCourse) {
        Course existingCourse = getCourseById(id);

        existingCourse.setTitle(updatedCourse.getTitle());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setCredits(updatedCourse.getCredits());

        return courseRepository.save(existingCourse);
    }

    /**
     * Supprime un cours
     * 
     * @param id l'identifiant du cours à supprimer
     * @throws ResourceNotFoundException si le cours n'existe pas
     */
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }

    /**
     * Vérifie si un cours existe
     * 
     * @param id l'identifiant du cours
     * @return true si le cours existe
     */
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return courseRepository.existsById(id);
    }

    /**
     * Recherche des cours par titre
     * 
     * @param title le titre à rechercher
     * @return liste des cours correspondants
     */
    @Transactional(readOnly = true)
    public List<Course> searchCoursesByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }
}
