package org.example.reclamationservice.service;

import org.example.reclamationservice.client.AcademicServiceClient;
import org.example.reclamationservice.client.UserServiceClient;
import org.example.reclamationservice.entity.Reclamation;
import org.example.reclamationservice.repository.ReclamationRepository;
import org.example.reclamationservice.event.ReclamationEvent;
import org.example.reclamationservice.event.ReclamationEventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReclamationService {

    private static final Logger log = LoggerFactory.getLogger(ReclamationService.class);

    private final ReclamationRepository repository;
    private final ReclamationEventPublisher eventPublisher;
    private final UserServiceClient userServiceClient;
    private final AcademicServiceClient academicServiceClient;

    public ReclamationService(ReclamationRepository repository,
                              ReclamationEventPublisher eventPublisher,
                              UserServiceClient userServiceClient,
                              AcademicServiceClient academicServiceClient) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
        this.userServiceClient = userServiceClient;
        this.academicServiceClient = academicServiceClient;
    }

    /**
     * Scénario Feign 1 : Valider que l'étudiant existe dans user-service
     * Scénario Feign 2 : Si type=NOTE, valider que le cours existe dans academic-service
     */
    public Reclamation create(Reclamation r) {
        // --- Feign: Valider l'étudiant via user-service ---
        try {
            Map<String, Object> user = userServiceClient.getUserByName(r.getStudentName());
            log.info("Feign ► Étudiant validé via user-service: {}", user.get("name"));
        } catch (Exception e) {
            log.error("Feign ► Étudiant '{}' introuvable dans user-service", r.getStudentName());
            throw new RuntimeException("Étudiant '" + r.getStudentName() + "' introuvable dans le système");
        }

        // --- Feign: Si type=NOTE, valider le cours via academic-service ---
        if ("NOTE".equalsIgnoreCase(r.getType()) && r.getSubject() != null) {
            try {
                var courses = academicServiceClient.getAllCourses();
                boolean courseExists = courses.stream()
                        .anyMatch(c -> r.getSubject().equalsIgnoreCase((String) c.get("title")));
                if (courseExists) {
                    log.info("Feign ► Cours '{}' validé via academic-service", r.getSubject());
                } else {
                    log.warn("Feign ► Cours '{}' non trouvé dans academic-service", r.getSubject());
                }
            } catch (Exception e) {
                log.warn("Feign ► Impossible de valider le cours via academic-service: {}", e.getMessage());
            }
        }

        r.setStatus("PENDING");
        r.setCreatedAt(LocalDateTime.now());
        r.setUpdatedAt(LocalDateTime.now());
        Reclamation saved = repository.save(r);

        // --- RabbitMQ: Publier l'événement de création ---
        eventPublisher.publishReclamationCreated(new ReclamationEvent(
                saved.getId(), saved.getStudentName(), saved.getSubject(),
                saved.getType(), saved.getStatus(), "CREATED", LocalDateTime.now()));

        return saved;
    }

    public List<Reclamation> getAll() {
        return repository.findAll();
    }

    public List<Reclamation> getByStudent(String studentName) {
        return repository.findByStudentName(studentName);
    }

    public Reclamation update(Long id, Reclamation r) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setSubject(r.getSubject());
                    existing.setDescription(r.getDescription());
                    existing.setType(r.getType());
                    existing.setStatus(r.getStatus());
                    existing.setUpdatedAt(LocalDateTime.now());
                    Reclamation updated = repository.save(existing);

                    eventPublisher.publishReclamationUpdated(new ReclamationEvent(
                            updated.getId(), updated.getStudentName(), updated.getSubject(),
                            updated.getType(), updated.getStatus(), "UPDATED", LocalDateTime.now()));

                    return updated;
                })
                .orElseThrow(() -> new RuntimeException("Reclamation not found with id " + id));
    }

    public boolean delete(Long id) {
        return repository.findById(id)
                .map(r -> {
                    repository.delete(r);
                    return true;
                }).orElse(false);
    }
}