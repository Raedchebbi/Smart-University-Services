package org.example.reclamationservice.controller;

import org.example.reclamationservice.entity.Reclamation;
import org.example.reclamationservice.service.ReclamationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reclamations")
public class ReclamationController {

    private final ReclamationService service;

    public ReclamationController(ReclamationService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public Reclamation create(@RequestBody Reclamation r) {
        return service.create(r);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<Reclamation> getAll() {
        return service.getAll();
    }

    @GetMapping("/student/{username}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public List<Reclamation> getByStudent(@PathVariable String username) {
        return service.getByStudent(username);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public Reclamation update(@PathVariable Long id, @RequestBody Reclamation r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = service.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}