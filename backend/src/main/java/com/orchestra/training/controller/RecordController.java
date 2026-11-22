package com.orchestra.training.controller;

import com.orchestra.training.domain.TrainingRecord;
import com.orchestra.training.service.RecordService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
public class RecordController {
    private final RecordService recordService;
    private final ObjectMapper objectMapper;

    public RecordController(RecordService recordService, ObjectMapper objectMapper) {
        this.recordService = recordService; this.objectMapper = objectMapper;
    }

    public record SubmitRecord(String instrumentId, Long taskId, Double score, Double accuracy,
                               Long durationMs, Object report) {}

    /** 学生端成绩提交（report_sync.js 调用）。学生身份取自 JWT，防伪造他人学号。 */
    @PostMapping("/api/records")
    public TrainingRecord submit(@RequestBody SubmitRecord req, Authentication auth) {
        String reportJson;
        try {
            reportJson = req.report() == null ? null : objectMapper.writeValueAsString(req.report());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "report is not JSON serializable");
        }
        return recordService.submit(auth.getName(), req.instrumentId(), req.taskId(),
                req.score(), req.accuracy(), req.durationMs(), reportJson);
    }

    /** 教师端查询：/api/records?studentNo=&instrumentId=&taskId= */
    @GetMapping("/api/records")
    public List<TrainingRecord> query(@RequestParam(required = false) String studentNo,
                                      @RequestParam(required = false) String instrumentId,
                                      @RequestParam(required = false) Long taskId) {
        return recordService.search(studentNo, instrumentId, taskId);
    }

    /** 学生端查看自己的历史成绩。 */
    @GetMapping("/api/records/me")
    public List<TrainingRecord> mine(Authentication auth) {
        return recordService.historyOf(auth.getName());
    }
}
