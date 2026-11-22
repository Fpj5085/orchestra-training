package com.orchestra.training.controller;

import com.orchestra.training.domain.Student;
import com.orchestra.training.repository.StudentRepository;
import com.orchestra.training.service.RecordService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentRepository students;
    private final RecordService recordService;

    public StudentController(StudentRepository students, RecordService recordService) {
        this.students = students; this.recordService = recordService;
    }

    @GetMapping
    public List<Student> list() { return students.findAll(); }

    @GetMapping("/{studentNo}/stats")
    public Map<String, Object> stats(@PathVariable String studentNo) {
        return recordService.statsOf(studentNo);
    }
}
