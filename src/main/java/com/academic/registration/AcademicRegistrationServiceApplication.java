package com.academic.registration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Academic Registration Service - Application principale
 * Port: 8082
 * Responsabilité: Gestion des inscriptions étudiants aux cours
 * Dépend de: Academic Core Service (port 8081)
 */
@SpringBootApplication
public class AcademicRegistrationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademicRegistrationServiceApplication.class, args);
    }
}
