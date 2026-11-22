package com.orchestra.training.it;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** C5: student-facing endpoints (login payload, /api/records/me permission). */
@SpringBootTest
@AutoConfigureMockMvc
class StudentApiTest {
    @Autowired MockMvc mvc;

    private String login(String role, String username, String password) throws Exception {
        return mvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("{\"username\":\"" + username + "\",\"password\":\"" + password + "\",\"role\":\"" + role + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
    }

    @Test
    void loginReturnsUsernameForStudentPage() throws Exception {
        mvc.perform(post("/api/auth/login").contentType("application/json")
                        .content("{\"username\":\"student01\",\"password\":\"student123\",\"role\":\"STUDENT\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("student01"));
    }

    @Test
    void studentSeesOwnRecordsOnly() throws Exception {
        String res = login("STUDENT", "student01", "student123");
        String token = res.split("\"token\":\"")[1].split("\"")[0];
        // CI 数据库是全新空库：测试自足，先提交一条成绩再断言归属
        mvc.perform(post("/api/records").header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"instrumentId\":\"trombone\",\"score\":88,\"accuracy\":0.9,\"durationMs\":30000,\"report\":{\"schema\":\"1.1.0\"}}"))
                .andExpect(status().isOk());
        mvc.perform(get("/api/records/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentNo").value("student01"));
    }

    @Test
    void teacherCannotAccessStudentMe() throws Exception {
        String res = login("TEACHER", "teacher01", "teacher123");
        String token = res.split("\"token\":\"")[1].split("\"")[0];
        mvc.perform(get("/api/records/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void meRequiresAuthentication() throws Exception {
        mvc.perform(get("/api/records/me"))
                .andExpect(status().isForbidden());
    }
}
