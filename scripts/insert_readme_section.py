#!/usr/bin/env python3
"""C3: 在 README.md 首标题后插入一键部署章节（幂等）。"""
import os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(root, "README.md")
section = """
## 2.0 一键部署（C3，已实测）

前置：Docker Desktop 运行中；已构建 backend（见下）。数据库容器 orc-postgres 使用 55434，后端 orc-backend 使用 8083，不占用通用端口。

```powershell
# 1) 构建后端 jar（首次或代码变更后；在 backend/ 目录）
cd backend
docker run --rm -v "%cd%:/app" -v orc-m2:/root/.m2 -w /app docker.m.daocloud.io/library/maven:3.9-eclipse-temurin-21 mvn -s .mvn-settings.xml -DskipTests package

# 2) 一键启动 数据库 + 后端
docker compose up -d

# 3) 打开 2.0 控制台
#    http://localhost:8083/  （教师 teacher01/teacher123，学生 student01/student123）
#
# 4) 打开 1.x 训练页：双击 index.html（或任意静态服务器）。
#    在控制台先用学生账号登录同一浏览器，report_sync.js 会把训练结算自动 POST 到 8083。
#
# 5) 停止/重启（数据保留在 orc-pgdata 卷）
docker compose down
docker compose up -d
```

可选环境变量：ORC_JWT_SECRET（JWT 密钥，未设置时使用内置演示默认值；生产必须设置）。
"""
with open(path, "r", encoding="utf-8-sig") as f:
    text = f.read()
if "2.0 一键部署" in text:
    print("already present")
else:
    lines = text.splitlines(keepends=True)
    lines.insert(1, "\n" + section)
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write("".join(lines))
    print("inserted")
