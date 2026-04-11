package com.univ.academic.controller;

import com.univ.academic.dto.EnrollmentRequestDTO;
import com.univ.academic.dto.EnrollmentResponseDTO;
import com.univ.academic.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des inscriptions.
 * Les rôles sont vérifiés via @PreAuthorize (extraits du JWT Keycloak).
 */
@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    /**
     * Inscrire un étudiant à un cours.
     * Accessible aux rôles : ADMIN, PROF
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROF')")
    public ResponseEntity<EnrollmentResponseDTO> enrollStudent(
            @Valid @RequestBody EnrollmentRequestDTO request) {
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Lister toutes les inscriptions.
     * Accessible uniquement au rôle : ADMIN
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentResponseDTO>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    /**
     * Inscriptions d'un étudiant spécifique.
     * Accessible aux rôles : ADMIN, PROF, ETUDIANT
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROF', 'ETUDIANT')")
    public ResponseEntity<List<EnrollmentResponseDTO>> getEnrollmentsByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudent(studentId));
    }

    /**
     * Inscriptions pour un cours spécifique.
     * Accessible aux rôles : ADMIN, PROF
     */
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROF')")
    public ResponseEntity<List<EnrollmentResponseDTO>> getEnrollmentsByCourse(
            @PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourse(courseId));
    }

    /**
     * Annuler une inscription.
     * Accessible aux rôles : ADMIN, PROF
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROF')")
    public ResponseEntity<EnrollmentResponseDTO> cancelEnrollment(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.cancelEnrollment(id));
    }
}
