package com.orchestra.training.it;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * C4: teacher console endpoints (classes, task progress, per-student stats).
 * Requires orc-postgres on localhost:55434.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class TeacherConsoleTest {
    @Autowired MockMvc mvc;
    static String teacherToken;
    static String studentToken;

    private String login(String role, String username, String password) throws Exception {
        return mvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("{\"username\":\"" + username + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString()
                .split("\"token\":\"")[1].split("\"")[0];
    }

    @Test @Order(1)
    void loginBothRoles() throws Exception {
        teacherToken = login("TEACHER", "teacher01", "teacher123");
        studentToken = login("STUDENT", "student01", "student123");
    }

    @Test @Order(2)
    void teacherListsClassesWithJoinCode() throws Exception {
        mvc.perform(get("/api/classes").header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].joinCode").value("ORC2026"));
    }

    @Test @Order(3)
    void studentCannotListClasses() throws Exception {
        mvc.perform(get("/api/classes").header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test @Order(4)
    void taskProgressVisibleToTeacherOnly() throws Exception {
        mvc.perform(get("/api/tasks/progress").header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].doneStudents").value(org.hamcrest.Matchers.greaterThanOrEqualTo(0)));
        mvc.perform(get("/api/tasks/progress").header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test @Order(5)
    void statsIncludeBestScoreAndDaily() throws Exception {
        mvc.perform(post("/api/records").header("Authorization", "Bearer " + studentToken)
                        .contentType("application/json")
                        .content("{\"instrumentId\":\"flute\",\"score\":95,\"accuracy\":0.95,\"durationMs\":30000,\"report\":{\"schema\":\"1.1.0\"}}"))
                .andExpect(status().isOk());
        mvc.perform(get("/api/students/student01/stats").header("Authorization", "Bearer " + teacherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bestScore").isNumber())
                .andExpect(jsonPath("$.bestScore").value(org.hamcrest.Matchers.greaterThanOrEqualTo(94.9)))
                .andExpect(jsonPath("$.daily[0].statDate").exists())
                .andExpect(jsonPath("$.daily[0].practiceCount").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
    }
}
