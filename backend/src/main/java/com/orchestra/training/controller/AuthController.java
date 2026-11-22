package com.orchestra.training.controller;

import com.orchestra.training.repository.StudentRepository;
import com.orchestra.training.repository.TeacherRepository;
import com.orchestra.training.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final StudentRepository students;
    private final TeacherRepository teachers;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(StudentRepository students, TeacherRepository teachers,
                          PasswordEncoder encoder, JwtService jwt) {
        this.students = students; this.teachers = teachers; this.encoder = encoder; this.jwt = jwt;
    }

    public record LoginRequest(String username, String password, String role) {}

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        String role = req.role() == null ? "STUDENT" : req.role().toUpperCase();
        String name;
        if ("TEACHER".equals(role)) {
            name = teachers.findByUsername(req.username())
                .filter(t -> encoder.matches(req.password(), t.getPasswordHash()))
                .map(t -> t.getName()).orElseThrow(() -> bad(role));
        } else {
            name = students.findByStudentNo(req.username())
                .filter(s -> encoder.matches(req.password(), s.getPasswordHash()))
                .map(s -> s.getName()).orElseThrow(() -> bad(role));
        }
        return Map.of("token", jwt.issue(req.username(), role), "role", role, "name", name, "username", req.username());
    }

    private ResponseStatusException bad(String role) {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials for role " + role);
    }
}
