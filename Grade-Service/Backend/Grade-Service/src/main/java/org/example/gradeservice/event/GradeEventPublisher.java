package org.example.gradeservice.event;

import org.example.gradeservice.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class GradeEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(GradeEventPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public GradeEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishGradeCreated(GradeEvent event) {
        log.info("Publishing grade created event: {}", event.getGradeId());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.GRADE_CREATED_KEY,
                event
        );
    }

    public void publishGradeUpdated(GradeEvent event) {
        log.info("Publishing grade updated event: {}", event.getGradeId());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.GRADE_UPDATED_KEY,
                event
        );
    }
}
