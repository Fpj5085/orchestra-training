package com.orchestra.training.repository;

import com.orchestra.training.domain.TrainingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TrainingRecordRepository extends JpaRepository<TrainingRecord, Long> {
    List<TrainingRecord> findByStudentNoOrderBySubmittedAtDesc(String studentNo);

    @Query("SELECT r.taskId AS taskId, COUNT(DISTINCT r.studentNo) AS doneStudents " +
           "FROM TrainingRecord r WHERE r.taskId IS NOT NULL GROUP BY r.taskId")
    List<TaskProgressView> countDoneStudentsPerTask();
}
