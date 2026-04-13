package com.univ.academic.dto;

import com.univ.academic.entity.EnrollmentStatus;
import lombok.*;

import java.time.LocalDate;

/**
 * DTO de réponse pour une inscription.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponseDTO {

    private Long id;
    private Long studentId;
    private Long courseId;
    private String courseTitle;
    private LocalDate enrollmentDate;
    private EnrollmentStatus status;
}
