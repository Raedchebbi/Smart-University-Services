package org.example.gradeservice.config;

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
    public static final String GRADE_QUEUE = "grade.queue";
    public static final String GRADE_ENROLLMENT_QUEUE = "grade.enrollment.queue";
    public static final String GRADE_COURSE_QUEUE = "grade.course.queue";

    // Routing keys
    public static final String GRADE_CREATED_KEY = "grade.created";
    public static final String GRADE_UPDATED_KEY = "grade.updated";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue gradeQueue() {
        return QueueBuilder.durable(GRADE_QUEUE).build();
    }

    @Bean
    public Binding gradeBinding(Queue gradeQueue, TopicExchange exchange) {
        return BindingBuilder.bind(gradeQueue).to(exchange).with("grade.*");
    }

    @Bean
    public Queue gradeEnrollmentQueue() {
        return QueueBuilder.durable(GRADE_ENROLLMENT_QUEUE).build();
    }

    @Bean
    public Queue gradeCourseQueue() {
        return QueueBuilder.durable(GRADE_COURSE_QUEUE).build();
    }

    @Bean
    public Binding enrollmentToGradeBinding(Queue gradeEnrollmentQueue, TopicExchange exchange) {
        return BindingBuilder.bind(gradeEnrollmentQueue).to(exchange).with("enrollment.*");
    }

    @Bean
    public Binding courseToGradeBinding(Queue gradeCourseQueue, TopicExchange exchange) {
        return BindingBuilder.bind(gradeCourseQueue).to(exchange).with("course.*");
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
