package com.academic.evaluation.controller;

import com.academic.evaluation.entity.Grade;
import com.academic.evaluation.service.GradeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller REST pour la gestion des notes
 * Base URL: /grades
 */
@RestController
@RequestMapping("/grades")
@CrossOrigin(origins = "*")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    /**
     * POST /grades - Ajoute une nouvelle note
     * Vérifie préalablement via REST que l'étudiant est inscrit au cours
     */
    @PostMapping
    public ResponseEntity<Grade> addGrade(@Valid @RequestBody Grade grade) {
        Grade created = gradeService.addGrade(grade);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * GET /grades - Récupère toutes les notes
     */
    @GetMapping
    public ResponseEntity<List<Grade>> getAllGrades() {
        List<Grade> grades = gradeService.getAllGrades();
        return ResponseEntity.ok(grades);
    }

    /**
     * GET /grades/student/{id} - Récupère les notes d'un étudiant
     */
    @GetMapping("/student/{id}")
    public ResponseEntity<List<Grade>> getGradesByStudent(@PathVariable Long id) {
        List<Grade> grades = gradeService.getGradesByStudent(id);
        return ResponseEntity.ok(grades);
    }

    /**
     * GET /grades/course/{id} - Récupère les notes d'un cours
     */
    @GetMapping("/course/{id}")
    public ResponseEntity<List<Grade>> getGradesByCourse(@PathVariable Long id) {
        List<Grade> grades = gradeService.getGradesByCourse(id);
        return ResponseEntity.ok(grades);
    }

    /**
     * GET /grades/student/{id}/average - Calcule la moyenne d'un étudiant
     */
    @GetMapping("/student/{id}/average")
    public ResponseEntity<Map<String, Object>> getStudentAverage(@PathVariable Long id) {
        Double average = gradeService.getStudentAverage(id);
        return ResponseEntity.ok(Map.of(
                "studentId", id,
                "average", average,
                "mention", getMention(average)));
    }

    /**
     * Détermine la mention en fonction de la moyenne
     */
    private String getMention(Double average) {
        if (average >= 16)
            return "Très Bien";
        if (average >= 14)
            return "Bien";
        if (average >= 12)
            return "Assez Bien";
        if (average >= 10)
            return "Passable";
        return "Insuffisant";
    }
}
