package com.univ.academic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entité JPA représentant un cours académique.
 * Le professorId est une référence externe vers le Student Service (non mappée par FK).
 */
@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 100, message = "Le titre ne doit pas dépasser 100 caractères")
    @Column(nullable = false, length = 100, unique = true)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Le nombre de crédits est obligatoire")
    @Column(nullable = false)
    private Integer credits;

    /**
     * Référence externe vers le professeur dans Student Service.
     * Aucune contrainte FK car c'est un service distant.
     */
    private Long professorId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
