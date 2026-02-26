package com.academic.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Academic Core Service - Application principale
 * Port: 8081
 * Responsabilité: Gestion des étudiants et des cours
 */
@SpringBootApplication
public class AcademicCoreServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademicCoreServiceApplication.class, args);
    }
}
