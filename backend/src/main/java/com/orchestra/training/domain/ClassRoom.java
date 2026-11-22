package com.orchestra.training.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity @Table(name = "classes")
public class ClassRoom {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    @Column(name = "join_code", nullable = false, unique = true) private String joinCode;
    @Column(name = "teacher_username", nullable = false) private String teacherUsername;
    @Column(name = "created_at", nullable = false) private OffsetDateTime createdAt;

    public ClassRoom() {}
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getJoinCode() { return joinCode; }
    public String getTeacherUsername() { return teacherUsername; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
