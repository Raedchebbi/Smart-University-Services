package com.univ.academic.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception levée lorsqu'un étudiant est déjà inscrit à un cours.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateEnrollmentException extends RuntimeException {

    public DuplicateEnrollmentException(String message) {
        super(message);
    }

    public DuplicateEnrollmentException(Long studentId, Long courseId) {
        super(String.format("L'étudiant %d est déjà inscrit au cours %d", studentId, courseId));
    }
}
