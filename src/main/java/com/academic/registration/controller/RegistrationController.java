package com.academic.registration.controller;

import com.academic.registration.entity.Registration;
import com.academic.registration.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST pour la gestion des inscriptions
 * Base URL: /registrations
 */
@RestController
@RequestMapping("/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /**
     * POST /registrations - Crée une nouvelle inscription
     * Vérifie préalablement via REST que l'étudiant et le cours existent
     */
    @PostMapping
    public ResponseEntity<Registration> createRegistration(@Valid @RequestBody Registration registration) {
        Registration created = registrationService.createRegistration(registration);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /registrations - Récupère toutes les inscriptions
     */
    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        List<Registration> registrations = registrationService.getAllRegistrations();
        return ResponseEntity.ok(registrations);
    }

    /**
     * GET /registrations/student/{id} - Récupère les inscriptions d'un étudiant
     */
    @GetMapping("/student/{id}")
    public ResponseEntity<List<Registration>> getRegistrationsByStudent(@PathVariable Long id) {
        List<Registration> registrations = registrationService.getRegistrationsByStudent(id);
        return ResponseEntity.ok(registrations);
    }

    /**
     * GET /registrations/course/{id} - Récupère les inscriptions à un cours
     */
    @GetMapping("/course/{id}")
    public ResponseEntity<List<Registration>> getRegistrationsByCourse(@PathVariable Long id) {
        List<Registration> registrations = registrationService.getRegistrationsByCourse(id);
        return ResponseEntity.ok(registrations);
    }

    /**
     * GET /registrations/check?studentId={sid}&courseId={cid} - Vérifie
     * l'inscription
     * Endpoint utilisé par l'Academic Evaluation Service
     */
    @GetMapping("/check")
    public ResponseEntity<Boolean> isStudentEnrolled(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        boolean enrolled = registrationService.isStudentEnrolled(studentId, courseId);
        return ResponseEntity.ok(enrolled);
    }
}
