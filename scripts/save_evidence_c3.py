#!/usr/bin/env python3
"""C3: 收集演示证据（psql 行、教师查询、学生 me、越权 403）到 docs/demo/evidence-c3.txt。"""
import json, subprocess, urllib.request

BASE = "http://localhost:8083"

def http(method, path, token=None, body=None):
    req = urllib.request.Request(BASE + path, method=method)
    if token:
        req.add_header("Authorization", "Bearer " + token)
    data = None
    if body is not None:
        req.add_header("Content-Type", "application/json")
        data = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(req, data) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()

def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, shell=True).stdout

_, t_res = http("POST", "/api/auth/login", body={"username": "teacher01", "password": "teacher123", "role": "TEACHER"})
ttok = json.loads(t_res)["token"]
_, s_res = http("POST", "/api/auth/login", body={"username": "student01", "password": "student123", "role": "STUDENT"})
stok = json.loads(s_res)["token"]

db = sh('docker exec orc-postgres psql -U orchestra -d orchestra -c "SELECT id, student_no, instrument_id, score, accuracy, duration_ms, submitted_at FROM training_records ORDER BY id DESC LIMIT 3"')
_, teach = http("GET", "/api/records?studentNo=student01", token=ttok)
_, me = http("GET", "/api/records/me", token=stok)
code_query, _ = http("GET", "/api/records", token=stok)
code_task, _ = http("POST", "/api/tasks", token=stok, body={"instrumentId": "flute", "title": "forbidden"})

ev = f"""C3 真实训练演示证据 2026-11-14

== psql: 训练结束后 training_records 最新行 ==
{db}
== 教师端 GET /api/records?studentNo=student01 ==
{teach}
== 学生 GET /api/records/me（本人历史） ==
{me}
== 越权校验 ==
学生 token GET /api/records -> HTTP {code_query}
学生 token POST /api/tasks -> HTTP {code_task}
"""
with open("K:/Fpj Project/C-orchestra-training/docs/demo/evidence-c3.txt", "w", encoding="utf-8") as f:
    f.write(ev)
print("saved; forbidden codes:", code_query, code_task)
