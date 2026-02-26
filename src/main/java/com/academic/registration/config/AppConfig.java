package com.academic.registration.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration de l'application Registration Service
 * Initialise le RestTemplate pour la communication inter-services
 */
@Configuration
public class AppConfig {

    @Value("${academic.core.service.url}")
    private String coreServiceUrl;

    /**
     * Bean RestTemplate pour les appels REST vers les autres microservices
     * 
     * @return instance configurée de RestTemplate
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getCoreServiceUrl() {
        return coreServiceUrl;
    }
}
