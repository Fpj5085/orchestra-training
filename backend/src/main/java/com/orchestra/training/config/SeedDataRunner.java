package com.orchestra.training.config;

import com.orchestra.training.domain.Student;
import com.orchestra.training.domain.Teacher;
import com.orchestra.training.repository.StudentRepository;
import com.orchestra.training.repository.TeacherRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** P1 演示账号（虚构数据）：teacher01/teacher123 与 student01/student123。 */
@Configuration
public class SeedDataRunner {
    @Bean
    ApplicationRunner seed(StudentRepository students, TeacherRepository teachers, PasswordEncoder encoder) {
        return args -> {
            if (students.findByStudentNo("student01").isEmpty()) {
                students.save(new Student("student01", "演示学生", encoder.encode("student123")));
            }
            if (teachers.findByUsername("teacher01").isEmpty()) {
                teachers.save(new Teacher("teacher01", "演示教师", encoder.encode("teacher123")));
            }
        };
    }
}
