package com.orchestra.training.domain;

import jakarta.persistence.*;

@Entity @Table(name = "teachers")
public class Teacher {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true) private String username;
    @Column(nullable = false) private String name;
    @Column(name = "password_hash", nullable = false) private String passwordHash;

    public Teacher() {}
    public Teacher(String username, String name, String passwordHash) {
        this.username = username; this.name = name; this.passwordHash = passwordHash;
    }
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getPasswordHash() { return passwordHash; }
}
