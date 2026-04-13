package org.example.reclamationservice.event;

import org.example.reclamationservice.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Écoute les événements de notes dans reclamation-service.
 * Quand une note est publiée/modifiée, cela peut déclencher des réclamations.
 */
@Component
public class ReclamationEventListener {

    private static final Logger log = LoggerFactory.getLogger(ReclamationEventListener.class);

    /**
     * Scénario RabbitMQ : Quand une note est publiée,
     * reclamation-service le log pour faciliter le suivi des réclamations de type NOTE
     */
    @RabbitListener(queues = RabbitMQConfig.RECLAMATION_GRADE_QUEUE)
    public void handleGradeEvent(Map<String, Object> event) {
        String eventType = (String) event.get("eventType");
        String studentName = (String) event.get("studentName");
        String subject = (String) event.get("subject");
        Object score = event.get("score");

        switch (eventType) {
            case "CREATED" -> log.info(
                    "RabbitMQ ► reclamation-service: Note publiée pour '{}' en '{}' (score: {}). " +
                    "L'étudiant peut maintenant soumettre une réclamation si nécessaire.",
                    studentName, subject, score);
            case "UPDATED" -> log.info(
                    "RabbitMQ ► reclamation-service: Note modifiée pour '{}' en '{}' (score: {}). " +
                    "Vérification des réclamations en cours liées...",
                    studentName, subject, score);
            default -> log.warn("RabbitMQ ► reclamation-service: Événement grade inconnu: {}", eventType);
        }
    }
}
