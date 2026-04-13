package esprit.userservice.event;

import esprit.userservice.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Écoute tous les événements du système via RabbitMQ.
 *
 * Scénario RabbitMQ 1 : enrollment.created  → notifier l'étudiant de son inscription
 * Scénario RabbitMQ 2 : enrollment.cancelled → notifier l'étudiant de l'annulation
 * Scénario RabbitMQ 3 : grade.created → notifier l'étudiant qu'une note a été publiée
 * Scénario RabbitMQ 4 : reclamation.created → notifier les admins/enseignants
 * Scénario RabbitMQ 5 : course.updated → notifier les étudiants inscrits
 */
@Component
public class UserEventListener {

    private static final Logger log = LoggerFactory.getLogger(UserEventListener.class);

    @RabbitListener(queues = RabbitMQConfig.USER_NOTIFICATION_QUEUE)
    public void handleEvent(Map<String, Object> event) {
        String eventType = (String) event.get("eventType");
        log.info("RabbitMQ ► Événement reçu: type={}, payload={}", eventType, event);

        if (eventType == null) {
            log.warn("RabbitMQ ► Événement sans type reçu: {}", event);
            return;
        }

        // Détecter le type d'événement par les champs présents
        if (event.containsKey("enrollmentId")) {
            handleEnrollmentEvent(eventType, event);
        } else if (event.containsKey("gradeId")) {
            handleGradeEvent(eventType, event);
        } else if (event.containsKey("reclamationId")) {
            handleReclamationEvent(eventType, event);
        } else if (event.containsKey("courseId") && event.containsKey("courseName")) {
            handleCourseEvent(eventType, event);
        } else {
            log.warn("RabbitMQ ► Type d'événement inconnu: {}", event);
        }
    }

    /**
     * Scénario RabbitMQ 1 & 2 : Événements d'inscription
     */
    private void handleEnrollmentEvent(String eventType, Map<String, Object> event) {
        Object studentId = event.get("studentId");
        Object courseId = event.get("courseId");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► NOTIFICATION: L'étudiant id={} a été inscrit au cours id={}. Envoi de notification...",
                    studentId, courseId);
            case "CANCELLED" -> log.info(
                    "RabbitMQ ► NOTIFICATION: L'inscription de l'étudiant id={} au cours id={} a été annulée.",
                    studentId, courseId);
            default -> log.warn("RabbitMQ ► Événement inscription inconnu: {}", eventType);
        }
    }

    /**
     * Scénario RabbitMQ 3 : Événements de notes
     */
    private void handleGradeEvent(String eventType, Map<String, Object> event) {
        String studentName = (String) event.get("studentName");
        String subject = (String) event.get("subject");
        Object score = event.get("score");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► NOTIFICATION: Nouvelle note pour '{}' en '{}': {}. Envoi de notification à l'étudiant...",
                    studentName, subject, score);
            case "UPDATED" -> log.info(
                    "RabbitMQ ► NOTIFICATION: Note mise à jour pour '{}' en '{}': {}. Envoi de notification...",
                    studentName, subject, score);
            default -> log.warn("RabbitMQ ► Événement note inconnu: {}", eventType);
        }
    }

    /**
     * Scénario RabbitMQ 4 : Événements de réclamation
     */
    private void handleReclamationEvent(String eventType, Map<String, Object> event) {
        String studentName = (String) event.get("studentName");
        String subject = (String) event.get("subject");
        String status = (String) event.get("status");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► NOTIFICATION ADMIN: Nouvelle réclamation de '{}' - sujet: '{}'. Notification envoyée aux admins.",
                    studentName, subject);
            case "UPDATED" -> log.info(
                    "RabbitMQ ► NOTIFICATION: Réclamation de '{}' mise à jour → statut: '{}'. Notification envoyée.",
                    studentName, status);
            default -> log.warn("RabbitMQ ► Événement réclamation inconnu: {}", eventType);
        }
    }

    /**
     * Scénario RabbitMQ 5 : Événements de cours
     */
    private void handleCourseEvent(String eventType, Map<String, Object> event) {
        String courseName = (String) event.get("courseName");
        Object courseId = event.get("courseId");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► INFO: Nouveau cours créé: '{}' (id={})", courseName, courseId);
            case "UPDATED" -> log.info(
                    "RabbitMQ ► NOTIFICATION: Le cours '{}' (id={}) a été modifié. Notification aux étudiants inscrits...",
                    courseName, courseId);
            case "DELETED" -> log.info(
                    "RabbitMQ ► ALERTE: Le cours '{}' (id={}) a été supprimé. Notification urgente aux étudiants inscrits...",
                    courseName, courseId);
            default -> log.warn("RabbitMQ ► Événement cours inconnu: {}", eventType);
        }
    }
}
