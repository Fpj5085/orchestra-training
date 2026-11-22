package com.orchestra.training.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity @Table(name = "daily_stats")
public class DailyStats {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "student_no", nullable = false) private String studentNo;
    @Column(name = "stat_date", nullable = false) private LocalDate statDate;
    @Column(name = "practice_count", nullable = false) private int practiceCount;
    @Column(name = "sum_score", nullable = false) private double sumScore;
    @Column(name = "best_score", nullable = false) private double bestScore;

    public DailyStats() {}
    public DailyStats(String studentNo, LocalDate statDate) {
        this.studentNo = studentNo; this.statDate = statDate;
    }
    public Long getId() { return id; }
    public String getStudentNo() { return studentNo; }
    public LocalDate getStatDate() { return statDate; }
    public int getPracticeCount() { return practiceCount; }
    public double getSumScore() { return sumScore; }
    public double getBestScore() { return bestScore; }
    public void setPracticeCount(int c) { this.practiceCount = c; }
    public void setSumScore(double s) { this.sumScore = s; }
    public void setBestScore(double b) { this.bestScore = b; }
}
