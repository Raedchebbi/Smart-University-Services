package com.academic.core.service;

import com.academic.core.entity.Student;
import com.academic.core.exception.ResourceNotFoundException;
import com.academic.core.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service pour la gestion des étudiants
 * Contient la logique métier pour les opérations CRUD
 */
@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // =============================================
    // CRUD Operations
    // =============================================

    /**
     * Récupère tous les étudiants
     * 
     * @return liste de tous les étudiants
     */
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Récupère un étudiant par son ID
     * 
     * @param id l'identifiant de l'étudiant
     * @return l'étudiant trouvé
     * @throws ResourceNotFoundException si l'étudiant n'existe pas
     */
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
    }

    /**
     * Crée un nouvel étudiant
     * 
     * @param student les données de l'étudiant
     * @return l'étudiant créé
     * @throws IllegalArgumentException si l'email est déjà utilisé
     */
    public Student createStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new IllegalArgumentException(
                    "L'email '" + student.getEmail() + "' est déjà utilisé par un autre étudiant");
        }
        return studentRepository.save(student);
    }

    /**
     * Met à jour un étudiant existant
     * 
     * @param id             l'identifiant de l'étudiant
     * @param updatedStudent les nouvelles données
     * @return l'étudiant mis à jour
     * @throws ResourceNotFoundException si l'étudiant n'existe pas
     */
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = getStudentById(id);

        // Vérifier si le nouvel email est déjà utilisé par un autre étudiant
        if (!existingStudent.getEmail().equals(updatedStudent.getEmail()) &&
                studentRepository.existsByEmail(updatedStudent.getEmail())) {
            throw new IllegalArgumentException(
                    "L'email '" + updatedStudent.getEmail() + "' est déjà utilisé par un autre étudiant");
        }

        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setLevel(updatedStudent.getLevel());

        return studentRepository.save(existingStudent);
    }

    /**
     * Supprime un étudiant
     * 
     * @param id l'identifiant de l'étudiant à supprimer
     * @throws ResourceNotFoundException si l'étudiant n'existe pas
     */
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    /**
     * Vérifie si un étudiant existe
     * 
     * @param id l'identifiant de l'étudiant
     * @return true si l'étudiant existe
     */
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return studentRepository.existsById(id);
    }

    /**
     * Récupère des étudiants par niveau
     * 
     * @param level le niveau académique
     * @return liste des étudiants du niveau
     */
    @Transactional(readOnly = true)
    public List<Student> getStudentsByLevel(String level) {
        return studentRepository.findByLevel(level);
    }
}
