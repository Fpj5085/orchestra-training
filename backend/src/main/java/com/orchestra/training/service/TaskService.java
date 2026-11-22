package com.orchestra.training.service;

import com.orchestra.training.domain.TrainingTask;
import com.orchestra.training.repository.TrainingTaskRepository;
import com.orchestra.training.repository.TrainingRecordRepository;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class TaskService {
    private final TrainingTaskRepository repo;
    private final TrainingRecordRepository recordRepo;

    public TaskService(TrainingTaskRepository repo, TrainingRecordRepository recordRepo) {
        this.repo = repo; this.recordRepo = recordRepo;
    }

    public TrainingTask create(String instrumentId, String title, String requirement, OffsetDateTime deadlineAt, String createdBy) {
        return repo.save(new TrainingTask(instrumentId, title, requirement, deadlineAt, createdBy));
    }

    public List<TrainingTask> list() { return repo.findAll(); }

    /** 任务列表 + 每任务完成人数（去重学生数）。 */
    public List<java.util.Map<String, Object>> listWithProgress() {
        java.util.Map<Long, Long> done = new java.util.HashMap<>();
        recordRepo.countDoneStudentsPerTask().forEach(v -> done.put(v.getTaskId(), v.getDoneStudents()));
        return repo.findAll().stream().map(t -> {
            java.util.Map<String, Object> m = new java.util.LinkedHashMap<>();
            m.put("id", t.getId()); m.put("instrumentId", t.getInstrumentId()); m.put("title", t.getTitle());
            m.put("requirement", t.getRequirement()); m.put("deadlineAt", t.getDeadlineAt());
            m.put("doneStudents", done.getOrDefault(t.getId(), 0L));
            return m;
        }).toList();
    }
}
