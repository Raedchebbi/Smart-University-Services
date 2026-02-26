package com.academic.evaluation.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration de l'application Evaluation Service
 */
@Configuration
public class AppConfig {

    @Value("${academic.registration.service.url}")
    private String registrationServiceUrl;

    /**
     * Bean RestTemplate pour les appels REST vers les autres microservices
     * 
     * @return instance configurée de RestTemplate
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getRegistrationServiceUrl() {
        return registrationServiceUrl;
    }
}
