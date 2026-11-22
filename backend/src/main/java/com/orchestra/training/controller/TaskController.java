package com.orchestra.training.controller;

import com.orchestra.training.domain.TrainingTask;
import com.orchestra.training.service.TaskService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) { this.taskService = taskService; }

    public record CreateTask(String instrumentId, String title, String requirement, OffsetDateTime deadlineAt) {}

    @PostMapping
    public TrainingTask create(@RequestBody CreateTask req, Authentication auth) {
        return taskService.create(req.instrumentId(), req.title(), req.requirement(), req.deadlineAt(), auth.getName());
    }

    @GetMapping
    public List<TrainingTask> list() { return taskService.list(); }

    /** 教师控制台：任务列表 + 每任务完成人数。 */
    @GetMapping("/progress")
    public List<java.util.Map<String, Object>> listWithProgress() { return taskService.listWithProgress(); }
}
