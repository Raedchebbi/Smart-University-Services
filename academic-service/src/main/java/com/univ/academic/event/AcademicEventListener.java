package com.univ.academic.event;

import com.univ.academic.config.RabbitMQConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Écoute les événements grade et reclamation via RabbitMQ dans academic-service.
 */
@Component
@Slf4j
public class AcademicEventListener {

    /**
     * Scénario RabbitMQ : Quand une note est créée/modifiée pour un cours,
     * academic-service reçoit l'info pour mettre à jour ses statistiques
     */
    @RabbitListener(queues = RabbitMQConfig.ACADEMIC_GRADE_QUEUE)
    public void handleGradeEvent(Map<String, Object> event) {
        String eventType = (String) event.get("eventType");
        String studentName = (String) event.get("studentName");
        String subject = (String) event.get("subject");
        Object score = event.get("score");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► academic-service: Note créée pour '{}' en '{}' (score: {})",
                    studentName, subject, score);
            case "UPDATED" -> log.info(
                    "RabbitMQ ► academic-service: Note mise à jour pour '{}' en '{}' (score: {})",
                    studentName, subject, score);
            default -> log.warn("RabbitMQ ► academic-service: Événement grade inconnu: {}", eventType);
        }
    }

    /**
     * Scénario RabbitMQ : Quand une réclamation est créée sur un cours,
     * academic-service en est notifié
     */
    @RabbitListener(queues = RabbitMQConfig.ACADEMIC_RECLAMATION_QUEUE)
    public void handleReclamationEvent(Map<String, Object> event) {
        String eventType = (String) event.get("eventType");
        String studentName = (String) event.get("studentName");
        String subject = (String) event.get("subject");
        String type = (String) event.get("type");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► academic-service: Réclamation '{}' de '{}' concernant '{}'. À traiter par l'enseignant.",
                    type, studentName, subject);
            case "UPDATED" -> log.info(
                    "RabbitMQ ► academic-service: Réclamation de '{}' mise à jour (sujet: '{}')",
                    studentName, subject);
            default -> log.warn("RabbitMQ ► academic-service: Événement réclamation inconnu: {}", eventType);
        }
    }
}
