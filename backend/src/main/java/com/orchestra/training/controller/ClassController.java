package com.orchestra.training.controller;

import com.orchestra.training.domain.ClassRoom;
import com.orchestra.training.repository.ClassRoomRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {
    private final ClassRoomRepository repo;

    public ClassController(ClassRoomRepository repo) { this.repo = repo; }

    @GetMapping
    public List<ClassRoom> list() { return repo.findAll(); }
}
