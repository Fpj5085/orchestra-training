package com.orchestra.training.service;

import com.orchestra.training.domain.TrainingRecord;
import com.orchestra.training.domain.DailyStats;
import com.orchestra.training.repository.DailyStatsRepository;
import com.orchestra.training.repository.TrainingRecordRepository;
import com.orchestra.training.repository.TrainingTaskRepository;
import com.orchestra.training.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class RecordService {
    private final TrainingRecordRepository recordRepo;
    private final TrainingTaskRepository taskRepo;
    private final StudentRepository studentRepo;
    private final DailyStatsRepository dailyStatsRepo;

    public RecordService(TrainingRecordRepository recordRepo, TrainingTaskRepository taskRepo,
                         StudentRepository studentRepo, DailyStatsRepository dailyStatsRepo) {
        this.recordRepo = recordRepo; this.taskRepo = taskRepo; this.studentRepo = studentRepo;
        this.dailyStatsRepo = dailyStatsRepo;
    }

    @org.springframework.transaction.annotation.Transactional

    public TrainingRecord submit(String studentNo, String instrumentId, Long taskId, Double score,
                                 Double accuracy, Long durationMs, String reportJson) {
        if (taskId != null && !taskRepo.existsById(taskId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "task not found: " + taskId);
        }
        if (studentRepo.findByStudentNo(studentNo).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "unknown student: " + studentNo);
        }
        TrainingRecord saved = recordRepo.save(new TrainingRecord(studentNo, instrumentId, taskId, score, accuracy, durationMs, reportJson));
        updateDailyStats(studentNo, score);
        return saved;
    }

    /** daily_stats 汇总策略：每次提交后对（学生, 当日）行做增量 upsert，avg 由 sum/count 派生，避免重算全表。 */
    private void updateDailyStats(String studentNo, Double score) {
        java.time.LocalDate today = java.time.LocalDate.now();
        DailyStats row = dailyStatsRepo.findByStudentNoAndStatDate(studentNo, today).orElseGet(() -> new DailyStats(studentNo, today));
        double s = score == null ? 0 : score;
        row.setPracticeCount(row.getPracticeCount() + 1);
        row.setSumScore(row.getSumScore() + s);
        row.setBestScore(Math.max(row.getBestScore(), s));
        dailyStatsRepo.save(row);
    }

    public List<TrainingRecord> search(String studentNo, String instrumentId, Long taskId) {
        // P1 数据量小，内存过滤；Backlog：数据量增长后改为 Specification/动态 SQL
        return recordRepo.findAll().stream()
                .filter(r -> studentNo == null || studentNo.isBlank() || studentNo.equals(r.getStudentNo()))
                .filter(r -> instrumentId == null || instrumentId.isBlank() || instrumentId.equals(r.getInstrumentId()))
                .filter(r -> taskId == null || taskId.equals(r.getTaskId()))
                .toList();
    }

    public List<TrainingRecord> historyOf(String studentNo) {
        return recordRepo.findByStudentNoOrderBySubmittedAtDesc(studentNo);
    }

    public java.util.Map<String, Object> statsOf(String studentNo) {
        List<TrainingRecord> records = historyOf(studentNo);
        double avg = records.stream().mapToDouble(r -> r.getScore() == null ? 0 : r.getScore()).average().orElse(0);
        double best = records.stream().mapToDouble(r -> r.getScore() == null ? 0 : r.getScore()).max().orElse(0);
        List<java.util.Map<String, Object>> daily = dailyStatsRepo.findByStudentNoOrderByStatDateDesc(studentNo).stream()
                .map(d -> java.util.Map.<String, Object>of(
                        "statDate", d.getStatDate().toString(),
                        "practiceCount", d.getPracticeCount(),
                        "avgScore", d.getPracticeCount() == 0 ? 0 : d.getSumScore() / d.getPracticeCount(),
                        "bestScore", d.getBestScore()))
                .toList();
        return java.util.Map.of("studentNo", studentNo, "count", records.size(),
                "avgScore", avg, "bestScore", best, "daily", daily);
    }

    private String emptyToNull(String s) { return (s == null || s.isBlank()) ? null : s; }
}
