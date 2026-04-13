package org.example.reclamationservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private String subject;

    @Column(length = 2000)
    private String description;

    private String type;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}