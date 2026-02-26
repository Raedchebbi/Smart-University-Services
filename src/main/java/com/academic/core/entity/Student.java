package com.academic.core.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Entité Student - Représente un étudiant dans le système académique
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le prénom est obligatoire")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format email invalide")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Le niveau est obligatoire")
    @Column(name = "level", nullable = false)
    private String level;

    // =============================================
    // Constructeurs
    // =============================================

    public Student() {
    }

    public Student(String firstName, String lastName, String email, String level) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.level = level;
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", level='" + level + '\'' +
                '}';
    }
}
