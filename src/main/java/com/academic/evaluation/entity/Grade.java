package com.academic.evaluation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Entité Grade - Représente une note d'un étudiant pour un cours
 */
@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'identifiant de l'étudiant est obligatoire")
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @NotNull(message = "L'identifiant du cours est obligatoire")
    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @NotNull(message = "La note est obligatoire")
    @DecimalMin(value = "0.0", message = "La note ne peut pas être négative")
    @DecimalMax(value = "20.0", message = "La note ne peut pas dépasser 20")
    @Column(name = "grade_value", nullable = false)
    private Double value;

    @NotBlank(message = "La session d'examen est obligatoire")
    @Column(name = "session", nullable = false)
    private String session;

    // =============================================
    // Constructeurs
    // =============================================

    public Grade() {
    }

    public Grade(Long studentId, Long courseId, Double value, String session) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.value = value;
        this.session = session;
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

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getSession() {
        return session;
    }

    public void setSession(String session) {
        this.session = session;
    }

    @Override
    public String toString() {
        return "Grade{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", courseId=" + courseId +
                ", value=" + value +
                ", session='" + session + '\'' +
                '}';
    }
}
