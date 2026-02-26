package com.academic.core.controller;

import com.academic.core.entity.Course;
import com.academic.core.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST pour la gestion des cours
 * Base URL: /courses
 */
@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /**
     * GET /courses - Récupère tous les cours
     */
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    /**
     * GET /courses/{id} - Récupère un cours par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    /**
     * GET /courses/{id}/exists - Vérifie si un cours existe (utilisé par les autres
     * microservices)
     */
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> existsById(@PathVariable Long id) {
        boolean exists = courseService.existsById(id);
        return ResponseEntity.ok(exists);
    }

    /**
     * GET /courses/search?title={title} - Recherche des cours par titre
     */
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCoursesByTitle(@RequestParam String title) {
        List<Course> courses = courseService.searchCoursesByTitle(title);
        return ResponseEntity.ok(courses);
    }

    /**
     * POST /courses - Crée un nouveau cours
     */
    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    /**
     * PUT /courses/{id} - Met à jour un cours existant
     */
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody Course course) {
        Course updatedCourse = courseService.updateCourse(id, course);
        return ResponseEntity.ok(updatedCourse);
    }

    /**
     * DELETE /courses/{id} - Supprime un cours
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
