package org.example.reclamationservice.service;

import org.example.reclamationservice.entity.Reclamation;
import org.example.reclamationservice.repository.ReclamationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {

    private final ReclamationRepository repository;

    public ReclamationService(ReclamationRepository repository) {
        this.repository = repository;
    }

    public Reclamation create(Reclamation r) {
        r.setStatus("PENDING");
        r.setCreatedAt(LocalDateTime.now());
        r.setUpdatedAt(LocalDateTime.now());
        return repository.save(r);
    }

    public List<Reclamation> getAll() {
        return repository.findAll();
    }

    public List<Reclamation> getByStudent(String studentName) {
        return repository.findByStudentName(studentName);
    }

    public Reclamation update(Long id, Reclamation r) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setSubject(r.getSubject());
                    existing.setDescription(r.getDescription());
                    existing.setType(r.getType());
                    existing.setStatus(r.getStatus());
                    existing.setUpdatedAt(LocalDateTime.now());
                    return repository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Reclamation not found with id " + id));
    }

    public boolean delete(Long id) {
        return repository.findById(id)
                .map(r -> {
                    repository.delete(r);
                    return true;
                }).orElse(false);
    }
}