package com.univ.academic.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO de réponse pour un cours.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponseDTO {

    private Long id;
    private String title;
    private String description;
    private Integer credits;
    private Long professorId;
    private LocalDateTime createdAt;
}
