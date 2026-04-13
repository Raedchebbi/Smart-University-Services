package org.example.gradeservice.event;

import java.io.Serializable;
import java.time.LocalDateTime;

public class GradeEvent implements Serializable {

    private Long gradeId;
    private String studentName;
    private String subject;
    private double score;
    private String eventType; // CREATED, UPDATED
    private LocalDateTime timestamp;

    public GradeEvent() {}

    public GradeEvent(Long gradeId, String studentName, String subject,
                      double score, String eventType, LocalDateTime timestamp) {
        this.gradeId = gradeId;
        this.studentName = studentName;
        this.subject = subject;
        this.score = score;
        this.eventType = eventType;
        this.timestamp = timestamp;
    }

    public Long getGradeId() { return gradeId; }
    public void setGradeId(Long gradeId) { this.gradeId = gradeId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
