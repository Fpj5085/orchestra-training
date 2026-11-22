package com.orchestra.training.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity @Table(name = "training_tasks")
public class TrainingTask {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "instrument_id", nullable = false) private String instrumentId;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "text") private String requirement;
    @Column(name = "deadline_at") private OffsetDateTime deadlineAt;
    @Column(name = "created_by", nullable = false) private String createdBy;
    @Column(name = "created_at", nullable = false) private OffsetDateTime createdAt;

    public TrainingTask() {}
    public TrainingTask(String instrumentId, String title, String requirement, OffsetDateTime deadlineAt, String createdBy) {
        this.instrumentId = instrumentId; this.title = title; this.requirement = requirement;
        this.deadlineAt = deadlineAt; this.createdBy = createdBy; this.createdAt = OffsetDateTime.now();
    }
    public Long getId() { return id; }
    public String getInstrumentId() { return instrumentId; }
    public String getTitle() { return title; }
    public String getRequirement() { return requirement; }
    public OffsetDateTime getDeadlineAt() { return deadlineAt; }
    public String getCreatedBy() { return createdBy; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
