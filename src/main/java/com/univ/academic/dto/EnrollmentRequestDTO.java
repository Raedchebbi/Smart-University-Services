package com.univ.academic.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO pour l'inscription d'un étudiant à un cours.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentRequestDTO {

    @NotNull(message = "Le studentId est obligatoire")
    private Long studentId;

    @NotNull(message = "Le courseId est obligatoire")
    private Long courseId;
}
