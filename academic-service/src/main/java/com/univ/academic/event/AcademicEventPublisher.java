package com.univ.academic.event;

import com.univ.academic.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AcademicEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishEnrollmentCreated(EnrollmentEvent event) {
        log.info("Publishing enrollment created event: {}", event);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ENROLLMENT_CREATED_KEY,
                event
        );
    }

    public void publishEnrollmentCancelled(EnrollmentEvent event) {
        log.info("Publishing enrollment cancelled event: {}", event);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ENROLLMENT_CANCELLED_KEY,
                event
        );
    }

    public void publishCourseCreated(CourseEvent event) {
        log.info("Publishing course created event: {}", event);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.COURSE_CREATED_KEY,
                event
        );
    }

    public void publishCourseUpdated(CourseEvent event) {
        log.info("Publishing course updated event: {}", event);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.COURSE_UPDATED_KEY,
                event
        );
    }

    public void publishCourseDeleted(CourseEvent event) {
        log.info("Publishing course deleted event: {}", event);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.COURSE_DELETED_KEY,
                event
        );
    }
}
