package org.example.reclamationservice.repository;


import org.example.reclamationservice.entity.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    List<Reclamation> findByStudentName(String studentName);
}
