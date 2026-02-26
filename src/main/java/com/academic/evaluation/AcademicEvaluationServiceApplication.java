package com.academic.evaluation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Academic Evaluation Service - Application principale
 * Port: 8083
 * Responsabilité: Gestion des notes des étudiants
 * Dépend de: Academic Registration Service (port 8082)
 */
@SpringBootApplication
public class AcademicEvaluationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademicEvaluationServiceApplication.class, args);
    }
}
