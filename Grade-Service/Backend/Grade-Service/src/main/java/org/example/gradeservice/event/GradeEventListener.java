package org.example.gradeservice.event;

import org.example.gradeservice.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Écoute les événements d'inscription et de cours dans grade-service.
 */
@Component
public class GradeEventListener {

    private static final Logger log = LoggerFactory.getLogger(GradeEventListener.class);

    /**
     * Scénario RabbitMQ : Quand un étudiant s'inscrit à un cours,
     * grade-service prépare l'espace pour ses futures notes
     */
    @RabbitListener(queues = RabbitMQConfig.GRADE_ENROLLMENT_QUEUE)
    public void handleEnrollmentEvent(Map<String, Object> event) {
        String eventType = (String) event.get("eventType");
        Object studentId = event.get("studentId");
        Object courseId = event.get("courseId");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► grade-service: Étudiant id={} inscrit au cours id={}. Prêt à recevoir des notes.",
                    studentId, courseId);
            case "CANCELLED" -> log.info(
                    "RabbitMQ ► grade-service: Inscription annulée pour étudiant id={} cours id={}. Notes conservées.",
                    studentId, courseId);
            default -> log.warn("RabbitMQ ► grade-service: Événement inscription inconnu: {}", eventType);
        }
    }

    /**
     * Scénario RabbitMQ : Quand un cours est modifié/supprimé,
     * grade-service met à jour la référence du cours dans les notes
     */
    @RabbitListener(queues = RabbitMQConfig.GRADE_COURSE_QUEUE)
    public void handleCourseEvent(Map<String, Object> event) {
        String eventType = (String) event.get("eventType");
        String courseName = (String) event.get("courseName");
        Object courseId = event.get("courseId");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► grade-service: Nouveau cours '{}' (id={}) disponible pour les notes.",
                    courseName, courseId);
            case "UPDATED" -> log.info(
                    "RabbitMQ ► grade-service: Cours '{}' (id={}) modifié. Mise à jour des références.",
                    courseName, courseId);
            case "DELETED" -> log.info(
                    "RabbitMQ ► grade-service: Cours '{}' (id={}) supprimé. Les notes existantes sont conservées.",
                    courseName, courseId);
            default -> log.warn("RabbitMQ ► grade-service: Événement cours inconnu: {}", eventType);
        }
    }
}
