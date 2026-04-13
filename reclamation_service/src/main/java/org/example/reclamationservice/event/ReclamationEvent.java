package org.example.reclamationservice.event;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ReclamationEvent implements Serializable {

    private Long reclamationId;
    private String studentName;
    private String subject;
    private String type;
    private String status;
    private String eventType; // CREATED, UPDATED
    private LocalDateTime timestamp;

    public ReclamationEvent() {}

    public ReclamationEvent(Long reclamationId, String studentName, String subject,
                            String type, String status, String eventType, LocalDateTime timestamp) {
        this.reclamationId = reclamationId;
        this.studentName = studentName;
        this.subject = subject;
        this.type = type;
        this.status = status;
        this.eventType = eventType;
        this.timestamp = timestamp;
    }

    public Long getReclamationId() { return reclamationId; }
    public void setReclamationId(Long reclamationId) { this.reclamationId = reclamationId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
