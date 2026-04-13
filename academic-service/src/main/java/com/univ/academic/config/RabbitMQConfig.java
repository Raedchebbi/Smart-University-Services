package com.univ.academic.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange
    public static final String EXCHANGE = "smart-university-exchange";

    // Queues
    public static final String ENROLLMENT_QUEUE = "enrollment.queue";
    public static final String COURSE_QUEUE = "course.queue";
    public static final String ACADEMIC_GRADE_QUEUE = "academic.grade.queue";
    public static final String ACADEMIC_RECLAMATION_QUEUE = "academic.reclamation.queue";

    // Routing keys
    public static final String ENROLLMENT_CREATED_KEY = "enrollment.created";
    public static final String ENROLLMENT_CANCELLED_KEY = "enrollment.cancelled";
    public static final String COURSE_CREATED_KEY = "course.created";
    public static final String COURSE_UPDATED_KEY = "course.updated";
    public static final String COURSE_DELETED_KEY = "course.deleted";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue enrollmentQueue() {
        return QueueBuilder.durable(ENROLLMENT_QUEUE).build();
    }

    @Bean
    public Queue courseQueue() {
        return QueueBuilder.durable(COURSE_QUEUE).build();
    }

    @Bean
    public Binding enrollmentBinding(Queue enrollmentQueue, TopicExchange exchange) {
        return BindingBuilder.bind(enrollmentQueue).to(exchange).with("enrollment.*");
    }

    @Bean
    public Binding courseBinding(Queue courseQueue, TopicExchange exchange) {
        return BindingBuilder.bind(courseQueue).to(exchange).with("course.*");
    }

    @Bean
    public Queue academicGradeQueue() {
        return QueueBuilder.durable(ACADEMIC_GRADE_QUEUE).build();
    }

    @Bean
    public Queue academicReclamationQueue() {
        return QueueBuilder.durable(ACADEMIC_RECLAMATION_QUEUE).build();
    }

    @Bean
    public Binding gradeToAcademicBinding(Queue academicGradeQueue, TopicExchange exchange) {
        return BindingBuilder.bind(academicGradeQueue).to(exchange).with("grade.*");
    }

    @Bean
    public Binding reclamationToAcademicBinding(Queue academicReclamationQueue, TopicExchange exchange) {
        return BindingBuilder.bind(academicReclamationQueue).to(exchange).with("reclamation.*");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
