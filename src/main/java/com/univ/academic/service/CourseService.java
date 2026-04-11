package com.univ.academic.service;

import com.univ.academic.dto.CourseRequestDTO;
import com.univ.academic.dto.CourseResponseDTO;
import com.univ.academic.entity.Course;
import com.univ.academic.exception.ResourceNotFoundException;
import com.univ.academic.exception.ValidationException;
import com.univ.academic.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service métier pour la gestion des cours.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;

    /**
     * Crée un nouveau cours après vérification de l'unicité du titre.
     */
    public CourseResponseDTO createCourse(CourseRequestDTO request) {
        // Vérification unicité du titre
        if (courseRepository.existsByTitle(request.getTitle())) {
            throw new ValidationException(
                    "Un cours avec le titre '" + request.getTitle() + "' existe déjà");
        }

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .credits(request.getCredits())
                .professorId(request.getProfessorId())
                .build();

        Course saved = courseRepository.save(course);
        log.info("Cours créé avec succès : id={}, titre={}", saved.getId(), saved.getTitle());
        return toResponseDTO(saved);
    }

    /**
     * Retourne la liste de tous les cours.
     */
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retourne le détail d'un cours par son identifiant.
     */
    @Transactional(readOnly = true)
    public CourseResponseDTO getCourseById(Long id) {
        Course course = findCourseOrThrow(id);
        return toResponseDTO(course);
    }

    /**
     * Met à jour un cours existant.
     * Vérifie l'unicité du titre si celui-ci est modifié.
     */
    public CourseResponseDTO updateCourse(Long id, CourseRequestDTO request) {
        Course course = findCourseOrThrow(id);

        // Si le titre change, vérifier qu'il n'est pas déjà pris
        if (!course.getTitle().equals(request.getTitle())
                && courseRepository.existsByTitle(request.getTitle())) {
            throw new ValidationException(
                    "Un cours avec le titre '" + request.getTitle() + "' existe déjà");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setProfessorId(request.getProfessorId());

        Course updated = courseRepository.save(course);
        log.info("Cours mis à jour : id={}", updated.getId());
        return toResponseDTO(updated);
    }

    /**
     * Supprime un cours par son identifiant.
     */
    public void deleteCourse(Long id) {
        Course course = findCourseOrThrow(id);
        courseRepository.delete(course);
        log.info("Cours supprimé : id={}", id);
    }

    // --- Méthodes utilitaires internes ---

    public Course findCourseOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours", id));
    }

    private CourseResponseDTO toResponseDTO(Course course) {
        return CourseResponseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .credits(course.getCredits())
                .professorId(course.getProfessorId())
                .createdAt(course.getCreatedAt())
                .build();
    }
}
