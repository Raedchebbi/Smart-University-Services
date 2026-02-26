package com.academic.core.repository;

import com.academic.core.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository pour l'entité Student
 * Fournit les opérations CRUD et des requêtes personnalisées
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Recherche un étudiant par son email
     * @param email l'email de l'étudiant
     * @return l'étudiant trouvé ou vide
     */
    Optional<Student> findByEmail(String email);

    /**
     * Vérifie si un email existe déjà
     * @param email l'email à vérifier
     * @return true si l'email existe
     */
    boolean existsByEmail(String email);

    /**
     * Recherche des étudiants par niveau
     * @param level le niveau académique
     * @return liste des étudiants du niveau
     */
    java.util.List<Student> findByLevel(String level);
}
