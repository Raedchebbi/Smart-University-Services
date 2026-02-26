package com.academic.registration.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * Entité Registration - Représente une inscription d'un étudiant à un cours
 */
@Entity
@Table(name = "registrations", uniqueConstraints = @UniqueConstraint(columnNames = { "student_id", "course_id" }))
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'identifiant de l'étudiant est obligatoire")
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @NotNull(message = "L'identifiant du cours est obligatoire")
    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    // =============================================
    // Constructeurs
    // =============================================

    public Registration() {
    }

    /**
     * Initialise automatiquement la date d'inscription avant l'insertion en BDD
     * Utiliser @PrePersist est plus fiable que l'initialisation dans le
     * constructeur vide,
     * car il est appelé par JPA juste avant l'INSERT, indépendamment du
     * constructeur utilisé.
     */
    @PrePersist
    protected void onCreate() {
        if (this.registrationDate == null) {
            this.registrationDate = LocalDate.now();
        }
    }

    public Registration(Long studentId, Long courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.registrationDate = LocalDate.now();
    }

    // =============================================
    // Getters & Setters
    // =============================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    @Override
    public String toString() {
        return "Registration{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", courseId=" + courseId +
                ", registrationDate=" + registrationDate +
                '}';
    }
}
