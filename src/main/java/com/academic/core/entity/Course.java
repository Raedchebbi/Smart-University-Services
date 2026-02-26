package com.academic.core.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Entité Course - Représente un cours dans le système académique
 */
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Les crédits sont obligatoires")
    @Min(value = 1, message = "Les crédits doivent être au minimum 1")
    @Column(name = "credits", nullable = false)
    private Integer credits;

    // =============================================
    // Constructeurs
    // =============================================

    public Course() {}

    public Course(String title, String description, Integer credits) {
        this.title = title;
        this.description = description;
        this.credits = credits;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    @Override
    public String toString() {
        return "Course{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", credits=" + credits +
                '}';
    }
}
