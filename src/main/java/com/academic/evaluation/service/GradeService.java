package com.academic.evaluation.service;

import com.academic.evaluation.client.AcademicRegistrationClient;
import com.academic.evaluation.entity.Grade;
import com.academic.evaluation.exception.ResourceNotFoundException;
import com.academic.evaluation.repository.GradeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service métier pour la gestion des notes (grades)
 *
 * Logique métier:
 * - Vérifie que l'étudiant est inscrit au cours dans le Registration Service
 * avant d'ajouter une note
 * - Calcule les moyennes
 */
@Service
@Transactional
public class GradeService {

    private static final Logger log = LoggerFactory.getLogger(GradeService.class);

    private final GradeRepository gradeRepository;
    private final AcademicRegistrationClient registrationClient;

    public GradeService(GradeRepository gradeRepository,
            AcademicRegistrationClient registrationClient) {
        this.gradeRepository = gradeRepository;
        this.registrationClient = registrationClient;
    }

    /**
     * Ajoute une note pour un étudiant dans un cours
     *
     * Processus:
     * 1. Vérifie que l'étudiant est inscrit au cours dans le Registration Service
     * (GET /registrations/check?studentId={sid}&courseId={cid})
     * 2. Sauvegarde la note
     *
     * @param grade les données de la note
     * @return la note créée avec son ID généré
     * @throws ResourceNotFoundException si l'étudiant n'est pas inscrit au cours
     */
    public Grade addGrade(Grade grade) {
        Long studentId = grade.getStudentId();
        Long courseId = grade.getCourseId();

        // Étape 1: Vérifier l'inscription via REST → Registration Service
        log.info("Vérification de l'inscription de l'étudiant id={} au cours id={} dans le Registration Service...",
                studentId, courseId);

        if (!registrationClient.isStudentEnrolled(studentId, courseId)) {
            throw new ResourceNotFoundException(
                    "L'étudiant " + studentId + " n'est pas inscrit au cours " + courseId +
                            ". Une inscription préalable est requise dans l'Academic Registration Service.");
        }
        log.info("✓ Inscription validée: étudiant id={} est bien inscrit au cours id={}", studentId, courseId);

        // Étape 2: Sauvegarder la note
        Grade saved = gradeRepository.save(grade);
        log.info("✓ Note ajoutée: étudiant={} cours={} note={} session='{}' (id={})",
                studentId, courseId, grade.getValue(), grade.getSession(), saved.getId());
        return saved;
    }

    /**
     * Récupère toutes les notes d'un étudiant
     * 
     * @param studentId l'identifiant de l'étudiant
     * @return liste de toutes les notes de l'étudiant
     */
    @Transactional(readOnly = true)
    public List<Grade> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId);
    }

    /**
     * Récupère toutes les notes pour un cours
     * 
     * @param courseId l'identifiant du cours
     * @return liste des notes du cours
     */
    @Transactional(readOnly = true)
    public List<Grade> getGradesByCourse(Long courseId) {
        return gradeRepository.findByCourseId(courseId);
    }

    /**
     * Calcule la moyenne d'un étudiant
     * 
     * @param studentId l'identifiant de l'étudiant
     * @return la moyenne ou 0 si aucune note
     */
    @Transactional(readOnly = true)
    public Double getStudentAverage(Long studentId) {
        Double average = gradeRepository.calculateAverageByStudent(studentId);
        return average != null ? average : 0.0;
    }

    /**
     * Récupère toutes les notes
     * 
     * @return liste de toutes les notes
     */
    @Transactional(readOnly = true)
    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }
}
