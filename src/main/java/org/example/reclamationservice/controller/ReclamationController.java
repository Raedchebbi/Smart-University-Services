package org.example.reclamationservice.controller;

import org.example.reclamationservice.entity.Reclamation;
import org.example.reclamationservice.service.ReclamationService;
import org.springframework.http.ResponseEntity;
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
    public Reclamation create(@RequestBody Reclamation r) {
        return service.create(r);
    }

    @GetMapping
    public List<Reclamation> getAll() {
        return service.getAll();
    }

    @GetMapping("/student/{id}")
    public List<Reclamation> getByStudent(@PathVariable Long id) {
        return service.getByStudent(id);
    }
    @PutMapping("/{id}")
    public Reclamation update(@PathVariable Long id, @RequestBody Reclamation r) {
        return service.update(id, r);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = service.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}