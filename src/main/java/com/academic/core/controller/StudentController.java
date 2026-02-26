package com.academic.core.controller;

import com.academic.core.entity.Student;
import com.academic.core.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST pour la gestion des étudiants
 * Base URL: /students
 */
@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * GET /students - Récupère tous les étudiants
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    /**
     * GET /students/{id} - Récupère un étudiant par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    /**
     * GET /students/{id}/exists - Vérifie si un étudiant existe (utilisé par les
     * autres microservices)
     */
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> existsById(@PathVariable Long id) {
        boolean exists = studentService.existsById(id);
        return ResponseEntity.ok(exists);
    }

    /**
     * GET /students/level/{level} - Récupère les étudiants par niveau
     */
    @GetMapping("/level/{level}")
    public ResponseEntity<List<Student>> getStudentsByLevel(@PathVariable String level) {
        List<Student> students = studentService.getStudentsByLevel(level);
        return ResponseEntity.ok(students);
    }

    /**
     * POST /students - Crée un nouvel étudiant
     */
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student createdStudent = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
    }

    /**
     * PUT /students/{id} - Met à jour un étudiant existant
     */
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student student) {
        Student updatedStudent = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updatedStudent);
    }

    /**
     * DELETE /students/{id} - Supprime un étudiant
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
