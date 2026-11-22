package com.orchestra.training.service;

import com.orchestra.training.domain.TrainingRecord;
import com.orchestra.training.repository.StudentRepository;
import com.orchestra.training.repository.DailyStatsRepository;
import com.orchestra.training.repository.TrainingRecordRepository;
import com.orchestra.training.repository.TrainingTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class RecordServiceTest {
    private TrainingRecordRepository recordRepo;
    private TrainingTaskRepository taskRepo;
    private StudentRepository studentRepo;
    private DailyStatsRepository dailyStatsRepo;
    private RecordService service;

    @BeforeEach
    void setup() {
        recordRepo = Mockito.mock(TrainingRecordRepository.class);
        taskRepo = Mockito.mock(TrainingTaskRepository.class);
        studentRepo = Mockito.mock(StudentRepository.class);
        dailyStatsRepo = Mockito.mock(DailyStatsRepository.class);
        Mockito.when(dailyStatsRepo.findByStudentNoAndStatDate(Mockito.anyString(), Mockito.any()))
                .thenReturn(Optional.empty());
        Mockito.when(dailyStatsRepo.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));
        service = new RecordService(recordRepo, taskRepo, studentRepo, dailyStatsRepo);
    }

    @Test
    void submitWithUnknownTaskFails() {
        when(taskRepo.existsById(99L)).thenReturn(false);
        assertThrows(ResponseStatusException.class,
                () -> service.submit("student01", "trombone", 99L, 1.0, 1.0, 100L, "{}"));
    }

    @Test
    void submitWithUnknownStudentFails() {
        when(taskRepo.existsById(Mockito.anyLong())).thenReturn(true);
        when(studentRepo.findByStudentNo("ghost")).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class,
                () -> service.submit("ghost", "trombone", 1L, 1.0, 1.0, 100L, "{}"));
    }

    @Test
    void submitFreePracticeSavesRecord() {
        when(studentRepo.findByStudentNo("student01")).thenReturn(Optional.of(new com.orchestra.training.domain.Student()));
        when(recordRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        TrainingRecord saved = service.submit("student01", "trombone", null, 85.0, 0.9, 30000L, "{\"schema\":\"1.1.0\"}");
        assertEquals("student01", saved.getStudentNo());
        assertNull(saved.getTaskId());
    }
}
