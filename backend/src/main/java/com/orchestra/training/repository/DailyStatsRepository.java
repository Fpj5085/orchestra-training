package com.orchestra.training.repository;

import com.orchestra.training.domain.DailyStats;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyStatsRepository extends JpaRepository<DailyStats, Long> {
    Optional<DailyStats> findByStudentNoAndStatDate(String studentNo, LocalDate statDate);
    List<DailyStats> findByStudentNoOrderByStatDateDesc(String studentNo);
}
