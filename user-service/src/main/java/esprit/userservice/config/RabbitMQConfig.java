package esprit.userservice.config;

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

    // Queues that user-service listens to
    public static final String USER_NOTIFICATION_QUEUE = "user.notification.queue";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue userNotificationQueue() {
        return QueueBuilder.durable(USER_NOTIFICATION_QUEUE).build();
    }

    // Listen to enrollment events
    @Bean
    public Binding enrollmentBinding(Queue userNotificationQueue, TopicExchange exchange) {
        return BindingBuilder.bind(userNotificationQueue).to(exchange).with("enrollment.*");
    }

    // Listen to grade events
    @Bean
    public Binding gradeBinding(Queue userNotificationQueue, TopicExchange exchange) {
        return BindingBuilder.bind(userNotificationQueue).to(exchange).with("grade.*");
    }

    // Listen to reclamation events
    @Bean
    public Binding reclamationBinding(Queue userNotificationQueue, TopicExchange exchange) {
        return BindingBuilder.bind(userNotificationQueue).to(exchange).with("reclamation.*");
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
