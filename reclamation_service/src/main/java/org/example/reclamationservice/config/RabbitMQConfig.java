package org.example.reclamationservice.config;

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
    public static final String RECLAMATION_QUEUE = "reclamation.queue";
    public static final String RECLAMATION_GRADE_QUEUE = "reclamation.grade.queue";

    // Routing keys
    public static final String RECLAMATION_CREATED_KEY = "reclamation.created";
    public static final String RECLAMATION_UPDATED_KEY = "reclamation.updated";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue reclamationQueue() {
        return QueueBuilder.durable(RECLAMATION_QUEUE).build();
    }

    @Bean
    public Queue reclamationGradeQueue() {
        return QueueBuilder.durable(RECLAMATION_GRADE_QUEUE).build();
    }

    @Bean
    public Binding reclamationBinding(Queue reclamationQueue, TopicExchange exchange) {
        return BindingBuilder.bind(reclamationQueue).to(exchange).with("reclamation.*");
    }

    @Bean
    public Binding gradeToReclamationBinding(Queue reclamationGradeQueue, TopicExchange exchange) {
        return BindingBuilder.bind(reclamationGradeQueue).to(exchange).with("grade.*");
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
