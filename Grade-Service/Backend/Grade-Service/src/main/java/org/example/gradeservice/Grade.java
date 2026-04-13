package org.example.gradeservice;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String subject;
    private String examType;   // Midterm, Final, Quiz
    private String semester;   // Fall 2025
    private double score;

    private LocalDateTime createdAt;

    public Grade() {
        this.createdAt = LocalDateTime.now();
    }

    public Grade(String studentName, String subject, String examType, String semester, double score) {
        this.studentName = studentName;
        this.subject = subject;
        this.examType = examType;
        this.semester = semester;
        this.score = score;
        this.createdAt = LocalDateTime.now();
    }

    // GETTERS & SETTERS

    public Long getId() { return id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}