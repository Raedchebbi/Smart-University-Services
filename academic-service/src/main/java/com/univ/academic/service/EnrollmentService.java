package com.univ.academic.service;

import com.univ.academic.dto.EnrollmentRequestDTO;
import com.univ.academic.dto.EnrollmentResponseDTO;
import com.univ.academic.entity.Course;
import com.univ.academic.entity.Enrollment;
import com.univ.academic.entity.EnrollmentStatus;
import com.univ.academic.exception.DuplicateEnrollmentException;
import com.univ.academic.exception.ResourceNotFoundException;
import com.univ.academic.exception.ValidationException;
import com.univ.academic.repository.EnrollmentRepository;
import com.univ.academic.event.AcademicEventPublisher;
import com.univ.academic.event.EnrollmentEvent;
import com.univ.academic.client.UserServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

/**
 * Service métier pour la gestion des inscriptions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;
    private final AcademicEventPublisher eventPublisher;
    private final UserServiceClient userServiceClient;

    /**
     * Inscrit un étudiant à un cours.
     * Scénario Feign : Valider l'étudiant via user-service
     */
    public EnrollmentResponseDTO enrollStudent(EnrollmentRequestDTO request) {
        // Vérifier que le cours existe
        Course course = courseService.findCourseOrThrow(request.getCourseId());

        // --- Feign: Valider l'étudiant via user-service ---
        try {
            var user = userServiceClient.getUserById(request.getStudentId());
            log.info("Feign ► Étudiant id={} validé via user-service: {}",
                    request.getStudentId(), user.get("name"));
        } catch (Exception e) {
            log.error("Feign ► Étudiant id={} introuvable dans user-service", request.getStudentId());
            throw new ValidationException("Étudiant avec id=" + request.getStudentId() + " introuvable");
        }

        // Vérifier que l'étudiant n'est pas déjà inscrit
        if (enrollmentRepository.existsByStudentIdAndCourseId(
                request.getStudentId(), request.getCourseId())) {
            throw new DuplicateEnrollmentException(request.getStudentId(), request.getCourseId());
        }

        Enrollment enrollment = Enrollment.builder()
                .studentId(request.getStudentId())
                .course(course)
                .status(EnrollmentStatus.PENDING)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        log.info("Inscription créée : id={}, étudiant={}, cours={}",
                saved.getId(), saved.getStudentId(), course.getId());

        eventPublisher.publishEnrollmentCreated(new EnrollmentEvent(
                saved.getId(), saved.getStudentId(), course.getId(),
                "PENDING", "CREATED", LocalDateTime.now()));

        return toResponseDTO(saved);
    }

    /**
     * Annule une inscription existante.
     * Seules les inscriptions PENDING ou CONFIRMED peuvent être annulées.
     */
    public EnrollmentResponseDTO cancelEnrollment(Long enrollmentId) {
        Enrollment enrollment = findEnrollmentOrThrow(enrollmentId);

        if (enrollment.getStatus() == EnrollmentStatus.CANCELLED) {
            throw new ValidationException("Cette inscription est déjà annulée");
        }

        enrollment.setStatus(EnrollmentStatus.CANCELLED);
        Enrollment updated = enrollmentRepository.save(enrollment);
        log.info("Inscription annulée : id={}", enrollmentId);

        eventPublisher.publishEnrollmentCancelled(new EnrollmentEvent(
                updated.getId(), updated.getStudentId(), updated.getCourse().getId(),
                "CANCELLED", "CANCELLED", LocalDateTime.now()));

        return toResponseDTO(updated);
    }

    /**
     * Retourne toutes les inscriptions.
     */
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retourne les inscriptions d'un étudiant spécifique.
     */
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retourne les inscriptions pour un cours spécifique.
     */
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getEnrollmentsByCourse(Long courseId) {
        // Vérifier que le cours existe
        courseService.findCourseOrThrow(courseId);
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // --- Méthodes utilitaires internes ---

    private Enrollment findEnrollmentOrThrow(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscription", id));
    }

    private EnrollmentResponseDTO toResponseDTO(Enrollment enrollment) {
        return EnrollmentResponseDTO.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudentId())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .status(enrollment.getStatus())
                .build();
    }
}
