package com.univ.academic.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseEvent implements Serializable {

    private Long courseId;
    private String courseName;
    private String eventType; // CREATED, UPDATED, DELETED
    private LocalDateTime timestamp;
}
