package com.orchestra.training.config;

import com.orchestra.training.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/", "/index.html", "/console.js", "/error", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/tasks").hasRole("TEACHER")
                .requestMatchers("/api/tasks").hasAnyRole("TEACHER", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/records").hasRole("STUDENT")
                .requestMatchers("/api/records/me").hasRole("STUDENT")
                .requestMatchers("/api/records/**", "/api/students/**").hasRole("TEACHER")
                .requestMatchers("/api/tasks/progress", "/api/classes/**").hasRole("TEACHER")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
