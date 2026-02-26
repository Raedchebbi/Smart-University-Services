package com.academic.registration.service;

import com.academic.registration.client.AcademicCoreClient;
import com.academic.registration.entity.Registration;
import com.academic.registration.exception.ResourceNotFoundException;
import com.academic.registration.repository.RegistrationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service métier pour la gestion des inscriptions
 *
 * Logique métier:
 * - Vérifie l'existence de l'étudiant dans le Core Service avant inscription
 * - Vérifie l'existence du cours dans le Core Service avant inscription
 * - Empêche les doublons d'inscription
 */
@Service
@Transactional
public class RegistrationService {

    private static final Logger log = LoggerFactory.getLogger(RegistrationService.class);

    private final RegistrationRepository registrationRepository;
    private final AcademicCoreClient academicCoreClient;

    public RegistrationService(RegistrationRepository registrationRepository,
            AcademicCoreClient academicCoreClient) {
        this.registrationRepository = registrationRepository;
        this.academicCoreClient = academicCoreClient;
    }

    /**
     * Crée une nouvelle inscription
     *
     * Processus:
     * 1. Vérifie que l'étudiant existe dans Academic Core Service (GET
     * /students/{id}/exists)
     * 2. Vérifie que le cours existe dans Academic Core Service (GET
     * /courses/{id}/exists)
     * 3. Vérifie qu'il n'y a pas de doublon d'inscription
     * 4. Sauvegarde l'inscription
     *
     * @param registration les données d'inscription
     * @return l'inscription créée avec son ID généré
     */
    public Registration createRegistration(Registration registration) {
        Long studentId = registration.getStudentId();
        Long courseId = registration.getCourseId();

        // Étape 1: Vérifier l'existence de l'étudiant via REST → Core Service
        log.info("Vérification de l'étudiant id={} dans Academic Core Service...", studentId);
        if (!academicCoreClient.studentExists(studentId)) {
            throw new ResourceNotFoundException(
                    "L'étudiant avec l'id " + studentId + " n'existe pas dans Academic Core Service");
        }
        log.info("✓ Étudiant id={} validé", studentId);

        // Étape 2: Vérifier l'existence du cours via REST → Core Service
        log.info("Vérification du cours id={} dans Academic Core Service...", courseId);
        if (!academicCoreClient.courseExists(courseId)) {
            throw new ResourceNotFoundException(
                    "Le cours avec l'id " + courseId + " n'existe pas dans Academic Core Service");
        }
        log.info("✓ Cours id={} validé", courseId);

        // Étape 3: Vérifier l'unicité de l'inscription
        if (registrationRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new IllegalArgumentException(
                    "L'étudiant " + studentId + " est déjà inscrit au cours " + courseId);
        }

        // Étape 4: Sauvegarder l'inscription
        Registration saved = registrationRepository.save(registration);
        log.info("✓ Inscription créée: étudiant {} → cours {} (id={})", studentId, courseId, saved.getId());
        return saved;
    }

    /**
     * Récupère toutes les inscriptions
     * 
     * @return liste de toutes les inscriptions
     */
    @Transactional(readOnly = true)
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    /**
     * Récupère toutes les inscriptions d'un étudiant
     * 
     * @param studentId l'identifiant de l'étudiant
     * @return liste des inscriptions de l'étudiant
     */
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByStudent(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }

    /**
     * Vérifie si un étudiant est inscrit à un cours (utilisé par l'Evaluation
     * Service)
     * 
     * @param studentId l'identifiant de l'étudiant
     * @param courseId  l'identifiant du cours
     * @return true si l'étudiant est inscrit au cours
     */
    @Transactional(readOnly = true)
    public boolean isStudentEnrolled(Long studentId, Long courseId) {
        return registrationRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }

    /**
     * Récupère toutes les inscriptions à un cours
     * 
     * @param courseId l'identifiant du cours
     * @return liste des inscriptions au cours
     */
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByCourse(Long courseId) {
        return registrationRepository.findByCourseId(courseId);
    }
}
