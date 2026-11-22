package com.orchestra.training.repository;

import com.orchestra.training.domain.TrainingTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingTaskRepository extends JpaRepository<TrainingTask, Long> {}
