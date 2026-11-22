package com.orchestra.training.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;

@Entity @Table(name = "training_records")
public class TrainingRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "student_no", nullable = false) private String studentNo;
    @Column(name = "instrument_id", nullable = false) private String instrumentId;
    @Column(name = "task_id") private Long taskId;
    private Double score;
    private Double accuracy;
    @Column(name = "duration_ms") private Long durationMs;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "report_json", columnDefinition = "jsonb") private String reportJson;
    @Column(name = "submitted_at", nullable = false) private OffsetDateTime submittedAt;

    public TrainingRecord() {}
    public TrainingRecord(String studentNo, String instrumentId, Long taskId, Double score, Double accuracy,
                          Long durationMs, String reportJson) {
        this.studentNo = studentNo; this.instrumentId = instrumentId; this.taskId = taskId;
        this.score = score; this.accuracy = accuracy; this.durationMs = durationMs;
        this.reportJson = reportJson; this.submittedAt = OffsetDateTime.now();
    }
    public Long getId() { return id; }
    public String getStudentNo() { return studentNo; }
    public String getInstrumentId() { return instrumentId; }
    public Long getTaskId() { return taskId; }
    public Double getScore() { return score; }
    public Double getAccuracy() { return accuracy; }
    public Long getDurationMs() { return durationMs; }
    public String getReportJson() { return reportJson; }
    public OffsetDateTime getSubmittedAt() { return submittedAt; }
}
