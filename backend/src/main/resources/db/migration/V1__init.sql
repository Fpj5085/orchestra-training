CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  student_no VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(64) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE teachers (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(64) NOT NULL,
  password_hash VARCHAR(100) NOT NULL
);
CREATE TABLE training_tasks (
  id BIGSERIAL PRIMARY KEY,
  instrument_id VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  requirement TEXT,
  deadline_at TIMESTAMPTZ,
  created_by VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE training_records (
  id BIGSERIAL PRIMARY KEY,
  student_no VARCHAR(32) NOT NULL REFERENCES students(student_no),
  instrument_id VARCHAR(32) NOT NULL,
  task_id BIGINT REFERENCES training_tasks(id),
  score DOUBLE PRECISION,
  accuracy DOUBLE PRECISION,
  duration_ms BIGINT,
  report_json JSONB,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_records_student ON training_records(student_no);
CREATE INDEX idx_records_task ON training_records(task_id);
