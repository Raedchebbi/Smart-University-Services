package org.example.gradeservice;

import org.example.gradeservice.client.AcademicServiceClient;
import org.example.gradeservice.client.UserServiceClient;
import org.example.gradeservice.event.GradeEvent;
import org.example.gradeservice.event.GradeEventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GradeService {

    private static final Logger log = LoggerFactory.getLogger(GradeService.class);

    private final GradeRepository gradeRepository;
    private final GradeEventPublisher eventPublisher;
    private final AcademicServiceClient academicServiceClient;
    private final UserServiceClient userServiceClient;

    public GradeService(GradeRepository gradeRepository,
                        GradeEventPublisher eventPublisher,
                        AcademicServiceClient academicServiceClient,
                        UserServiceClient userServiceClient) {
        this.gradeRepository = gradeRepository;
        this.eventPublisher = eventPublisher;
        this.academicServiceClient = academicServiceClient;
        this.userServiceClient = userServiceClient;
    }

    /**
     * Scénario Feign 3 : Valider que le cours (subject) existe dans academic-service
     * Scénario Feign 4 : Valider que l'étudiant existe dans user-service
     */
    public Grade addGrade(Grade grade) {
        // --- Feign: Valider le cours via academic-service ---
        try {
            var courses = academicServiceClient.getAllCourses();
            boolean courseExists = courses.stream()
                    .anyMatch(c -> grade.getSubject().equalsIgnoreCase((String) c.get("title")));
            if (courseExists) {
                log.info("Feign ► Cours '{}' validé via academic-service", grade.getSubject());
            } else {
                log.warn("Feign ► Cours '{}' non trouvé dans academic-service", grade.getSubject());
            }
        } catch (Exception e) {
            log.warn("Feign ► Impossible de valider le cours via academic-service: {}", e.getMessage());
        }

        // --- Feign: Valider l'étudiant via user-service ---
        try {
            Map<String, Object> user = userServiceClient.getUserByName(grade.getStudentName());
            log.info("Feign ► Étudiant '{}' validé via user-service (email: {})",
                    user.get("name"), user.get("email"));
        } catch (Exception e) {
            log.warn("Feign ► Étudiant '{}' non trouvé dans user-service: {}",
                    grade.getStudentName(), e.getMessage());
        }

        Grade saved = gradeRepository.save(grade);

        // --- RabbitMQ: Publier l'événement ---
        eventPublisher.publishGradeCreated(new GradeEvent(
                saved.getId(), saved.getStudentName(), saved.getSubject(),
                saved.getScore(), "CREATED", LocalDateTime.now()));

        return saved;
    }

    // READ ALL
    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    /**
     * Scénario Feign 5 : Enrichir la note avec les infos de l'étudiant
     */
    public Optional<Grade> getGradeById(Long id) {
        return gradeRepository.findById(id);
    }

    /**
     * Enrichir les infos étudiant lors de la récupération d'une note
     */
    public Map<String, Object> getGradeWithStudentInfo(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", grade.getId());
        result.put("studentName", grade.getStudentName());
        result.put("subject", grade.getSubject());
        result.put("examType", grade.getExamType());
        result.put("semester", grade.getSemester());
        result.put("score", grade.getScore());
        result.put("createdAt", grade.getCreatedAt());

        // --- Feign: Enrichir avec les infos de l'étudiant via user-service ---
        try {
            Map<String, Object> studentInfo = userServiceClient.getUserByName(grade.getStudentName());
            result.put("studentEmail", studentInfo.get("email"));
            result.put("studentRole", studentInfo.get("role"));
            log.info("Feign ► Infos étudiant enrichies pour la note id={}", id);
        } catch (Exception e) {
            log.warn("Feign ► Impossible d'enrichir les infos étudiant: {}", e.getMessage());
            result.put("studentEmail", "N/A");
            result.put("studentRole", "N/A");
        }

        return result;
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
                    Grade updated = gradeRepository.save(grade);

                    eventPublisher.publishGradeUpdated(new GradeEvent(
                            updated.getId(), updated.getStudentName(), updated.getSubject(),
                            updated.getScore(), "UPDATED", LocalDateTime.now()));

                    return updated;
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