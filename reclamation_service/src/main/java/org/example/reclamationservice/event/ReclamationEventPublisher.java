package org.example.reclamationservice.event;

import org.example.reclamationservice.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class ReclamationEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(ReclamationEventPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public ReclamationEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishReclamationCreated(ReclamationEvent event) {
        log.info("Publishing reclamation created event: {}", event.getReclamationId());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.RECLAMATION_CREATED_KEY,
                event
        );
    }

    public void publishReclamationUpdated(ReclamationEvent event) {
        log.info("Publishing reclamation updated event: {}", event.getReclamationId());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.RECLAMATION_UPDATED_KEY,
                event
        );
    }
}
