CREATE TABLE classes (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  join_code VARCHAR(16) NOT NULL UNIQUE,
  teacher_username VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO classes (name, join_code, teacher_username) VALUES ('演示乐团 A 团', 'ORC2026', 'teacher01');

CREATE TABLE daily_stats (
  id BIGSERIAL PRIMARY KEY,
  student_no VARCHAR(32) NOT NULL REFERENCES students(student_no),
  stat_date DATE NOT NULL,
  practice_count INT NOT NULL DEFAULT 0,
  sum_score DOUBLE PRECISION NOT NULL DEFAULT 0,
  best_score DOUBLE PRECISION NOT NULL DEFAULT 0,
  UNIQUE (student_no, stat_date)
);
