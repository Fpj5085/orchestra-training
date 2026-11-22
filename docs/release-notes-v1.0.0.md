# v1.0.0 — Orchestra Sight-Reading Training

## 概要

自研 H5 乐团识谱训练游戏（1.x，17 个乐器训练页）+ 新增 Spring Boot 3 后端（2.0）正式开源：

- **JWT 双角色鉴权**：教师 / 学生，权限边界由 18/18 集成测试断言锁死
- **班级与邀请码、训练任务下发、任务完成人数**
- **成绩 JSONB 持久化**（兼容 1.x 结算报告 schema 1.1.0）+ daily_stats 每日统计
- **前端零侵入接入**：report_sync.js 增量挂载，1.x 引擎一行未改
- **零密钥 CI**：GitHub Actions services postgres:17 + temurin 21 + mvn test（18/18 全绿）

## 质量证据

- Docker Maven mvn test 18/18（真实 PostgreSQL 17）
- 独立 clone 部署验证：compose up + 页面 200 + API 闭环
- SHA256SUMS.txt 全量清单

## 素材许可

- 代码：MIT（仅代码）
- 音频：Soundimage（署名必备）/ Kenney（CC0）/ 本地合成（CC0）
- 图片：AI 生成素材（提示词存档）

## 演示账号

教师 teacher01/teacher123、学生 student01/student123 —— 仅本地演示用，生产必须修改。
