package com.orchestra.training.it;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Closed-loop integration test: submit record -> teacher query -> stats + permissions.
 * Requires orc-postgres running on localhost:55434 (docker compose up -d orc-postgres).
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ClosedLoopTest {
    @Autowired MockMvc mvc;
    static String teacherToken;
    static String studentToken;
    static Long taskId;

    private String login(String role, String username, String password) throws Exception {
        return mvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("{\"username\":\"" + username + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString()
                .split("\"token\":\"")[1].split("\"")[0];
    }

    @Test @Order(1)
    void teacherAndStudentLogin() throws Exception {
        teacherToken = login("TEACHER", "teacher01", "teacher123");
        studentToken = login("STUDENT", "student01", "student123");
        org.junit.jupiter.api.Assertions.assertFalse(teacherToken.isBlank());
        org.junit.jupiter.api.Assertions.assertFalse(studentToken.isBlank());
    }

    @Test @Order(2)
    void studentCannotCreateTask() throws Exception {
        mvc.perform(post("/api/tasks").header("Authorization", "Bearer " + studentToken)
                        .contentType("application/json")
                        .content("{\"instrumentId\":\"trombone\",\"title\":\"forbidden-task\"}"))
                .andExpect(status().isForbidden());
    }

    @Test @Order(3)
    void teacherCreatesTask() throws Exception {
        String body = mvc.perform(post("/api/tasks").header("Authorization", "Bearer " + teacherToken)
                        .contentType("application/json")
                        .content("{\"instrumentId\":\"trombone\",\"title\":\"P1 closed-loop demo task\",\"requirement\":\"bass clef positions 1-7\",\"deadlineAt\":\"2026-12-31T23:59:59+08:00\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn().getResponse().getContentAsString();
        taskId = Long.parseLong(body.split("\"id\":")[1].split(",")[0]);
    }

    @Test @Order(4)
    void studentSubmitsRecordWithTask() throws Exception {
        mvc.perform(post("/api/records").header("Authorization", "Bearer " + studentToken)
                        .contentType("application/json")
                        .content("{\"instrumentId\":\"trombone\",\"taskId\":" + taskId +
                                ",\"score\":85,\"accuracy\":0.9,\"durationMs\":30000,\"report\":{\"schema\":\"1.1.0\"}}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskId").value(taskId));
    }

    @Test @Order(5)
    void studentCannotQueryRecordsList() throws Exception {
        mvc.perform(get("/api/records").header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test @Order(6)
    void teacherQueriesRecordsAndStats() throws Exception {
        mvc.perform(get("/api/records?studentNo=student01&taskId=" + taskId)
                        .header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].score").value(85));
        mvc.perform(get("/api/students/student01/stats").header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
    }
}
