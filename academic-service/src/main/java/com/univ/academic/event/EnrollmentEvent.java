package com.univ.academic.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentEvent implements Serializable {

    private Long enrollmentId;
    private Long studentId;
    private Long courseId;
    private String status;
    private String eventType; // CREATED, CANCELLED
    private LocalDateTime timestamp;
}
