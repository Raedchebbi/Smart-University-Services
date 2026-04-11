package com.univ.academic.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

/**
 * Entité JPA représentant l'inscription d'un étudiant à un cours.
 * Le studentId est une référence externe vers le Student Service.
 */
@Entity
@Table(name = "enrollments",
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"student_id", "course_id"},
           name = "uk_student_course"
       ))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Référence externe vers l'étudiant dans Student Service.
     */
    @NotNull(message = "Le studentId est obligatoire")
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private LocalDate enrollmentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.PENDING;

    @PrePersist
    protected void onCreate() {
        if (enrollmentDate == null) {
            enrollmentDate = LocalDate.now();
        }
    }
}
