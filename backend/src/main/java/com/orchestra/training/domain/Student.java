package com.orchestra.training.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity @Table(name = "students")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "student_no", nullable = false, unique = true) private String studentNo;
    @Column(nullable = false) private String name;
    @Column(name = "password_hash", nullable = false) private String passwordHash;
    @Column(name = "created_at", nullable = false) private OffsetDateTime createdAt;

    public Student() {}
    public Student(String studentNo, String name, String passwordHash) {
        this.studentNo = studentNo; this.name = name; this.passwordHash = passwordHash;
        this.createdAt = OffsetDateTime.now();
    }
    public Long getId() { return id; }
    public String getStudentNo() { return studentNo; }
    public String getName() { return name; }
    public String getPasswordHash() { return passwordHash; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
