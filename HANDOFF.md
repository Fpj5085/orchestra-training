# HANDOFF — 乐团识谱训练平台 2.0 基线仓库（任务单 C1）

生成时间：2026-11-14（Asia/Shanghai）

## 1. 原仓库核查结果（K:\KOUzi，绝对只读）

原目录名义上带 `.git` 文件夹，但 `git -C "K:\KOUzi" status` 返回：

```
fatal: not a git repository (or any of the parent directories): .git
```

实测 `K:\KOUzi\.git` 为**空目录（0 文件）**，不存在任何提交历史、分支或对象库。因此：

- 无"当前分支 / 最近提交"可记录（分支列表与 git log 均因非 git 仓库而失败）。
- 不存在"未提交/未跟踪文件"概念——整个工作区都处于无版本控制状态。

## 2. 建仓方式（依据任务单规则选择）

任务单首选方案（clone 保留历史）不可行：原仓库无有效 .git。采用备选逻辑：

1. 用 robocopy 将 `K:\KOUzi` 完整快照到 `K:\Fpj Project\C-orchestra-training`（源目录只读；排除 `.git`（空目录）、`node_modules`、`.next`、`.pnpm-store`、`.venv-analysis` 等构建/依赖产物）。
   - robocopy 统计：Dirs 1393 / Copied 1051；Files 2798 / Copied 2798；Bytes 393.99 MB；FAILED 0。
2. 在新目录 `git init -b main`，首提交作为基线快照：
   - 提交：`9b3080b` — "baseline: snapshot of K:/KOUzi (orchestra sight-reading H5 v1.x) 2026-11-14"
   - 差异说明：新仓库相对源目录**仅缺少被排除的构建产物**（node_modules / .next / .pnpm-store / .venv-analysis 及空 .git），源码与资源与源目录一致。
3. 打 tag：`baseline-v1` → 指向 commit `e38f38a2caa5b63b6560e3cbdff31324e6d646f8`（9b3080b 的对象 hash，annotated tag）。

### 原目录零修改证明（完成时复核）

- `git -C "K:\KOUzi" status` → `fatal: not a git repository ...`（与建仓前一致）
- 根层文件清单（dir /a）与建仓前逐项一致（42 文件 / 319,823 bytes，时间戳未变）
- `K:\KOUzi\.git` 仍为 0 文件空目录

## 3. 现有功能清单（1.x 基线，纯前端 H5）

### 大厅与入口
- `index.html` + `hub.css`：乐团大厅，按乐器族分组入口卡片（铜管/木管/弦乐/打击乐），背景 `assets/bg-rehearsal2.jpg`。

### 训练室页面（每页一个乐器，30 秒生存制）
- 铜管：`trombone.html`（低音谱号 1-7 把位）、`trumpet.html`、`euphonium.html`、`euphonium-challenge.html`（84 BPM 强化关）、`horn.html`、`tuba.html`（阀键组合 开放/1/2/1+2/2+3/1+3/1+2+3）。
- 木管：`flute.html`、`piccolo.html`、`saxophone.html`、`soprano-saxophone.html`、`clarinet.html`、`bassoon.html`（四列指法网格）。
- 弦乐：`violin.html`、`viola.html`、`cello.html`、`double-bass.html`（页内选弦后单弦指位训练；另有 `violin-g/d/a/e.html` 旧调试页，不在大厅入口）。
- 打击乐：`percussion.html`（Kick/Snare/Hi-Hat/Tom/Crash 五垫节奏窗口）。

### 通用引擎（所有训练页共享）
- `main.js`：游戏循环、扫描线判定、输入路由（鼠标/触屏/键盘，KeyboardEvent.code，忽略 repeat/输入法）、报告挂载 `window.__REHEARSAL_BOMB_REPORT__`。
- `instrument_models.js`：各乐器指法/把位模型与按钮布局（`window.REHEARSAL_GAME_CONFIG.instrumentId` 驱动）。
- `vexflow_engine.js`：本地 SVG 谱面引擎，支持 bass/treble/alto/percussion 谱号。
- `rhythm_validator.js`：节奏窗口校验。
- `report_generator.js`：结算报告 schema 1.1.0，含 `inputMethodDistribution`（键盘/点击/系统 Miss）。
- `audio_manager.js`：本地音频预加载、BGM 循环、UI/命中/错误/通关音效、SOUND ON/OFF（localStorage 持久化，首次交互解锁 BGM）。
- `nav_transition.js`：页面跳转过渡。
- `style.css`：训练页样式与按键反馈；指挥 NPC 四态头像 + ECG 血压动画。

### 资源
- `assets/`：乐器图片、指挥头像（happy/alert/angry/furious）、`pig.gif`、`assets/audio/`（BGM×2、UI×2、命中/错误/通关×5）。
- `.agents/audio-work/`：原始音频素材与 Kenney/soundpack 素材包。
- `release/`：历史发布 zip（Coze 静态包等）。
- `project/`：同目录下交付的其他独立项目快照（"Chang Zheng" 听见长征、"XinHui BoWuGuan"），非本平台运行依赖。

### 存档/成绩
- 目前仅有 `localStorage` 静音状态；成绩报告只存在于页面内存（`window.__REHEARSAL_BOMB_REPORT__`），无持久化、无用户体系。

## 4. 2.0 后端设计提案（仅文档，未写代码）

### 4.1 部署约定
- 后端：Spring Boot 3（Java 17），服务端口 **8083**。
- 数据库：PostgreSQL，Docker 容器命名前缀 `orc-*`（如 `orc-postgres`），宿主端口 **55434**，库名 **orchestra**。
- 前端 1.x 静态页继续可用；2.0 前端通过 REST 接入 `http://<host>:8083/api`。

### 4.2 角色模型
- **学生（student）**：注册后选择班级/乐团声部，进行训练，查看个人成绩与任务。
- **教师（teacher）**：创建班级、邀请/导入学生、布置训练任务、查看班级与个人统计。
- 认证：JWT（角色 role=STUDENT/TEACHER）；教师注册可加邀请码控制来源。

### 4.3 ER 草案

```
users(id PK, username UNIQUE, password_hash, display_name, role[STUDENT|TEACHER], created_at)
classes(id PK, teacher_id FK->users, name, join_code UNIQUE, created_at)
class_members(id PK, class_id FK->classes, student_id FK->users, part[声部], joined_at, UNIQUE(class_id, student_id))

instruments(id PK, code UNIQUE[trombone/trumpet/...], name, family[BRASS|WOODWIND|STRING|PERCUSSION])
   -- 预置 17 个训练室对应模型，与 1.x instrument_models.js 的 instrumentId 对齐

training_tasks(id PK, class_id FK->classes, instrument_id FK->instruments,
               title, tempo_bpm, duration_ms, min_score, publish_at, deadline_at, created_by FK->users)
task_assignments(id PK, task_id FK->training_tasks, student_id FK->users, status[PENDING|DONE], UNIQUE(task_id, student_id))

score_records(id PK, student_id FK->users, instrument_id FK->instruments,
              task_id FK->training_tasks NULL,          -- 自由练习为 NULL
              score, accuracy, max_combo, duration_ms,
              report_json JSONB,                        -- 兼容 1.x report schema 1.1.0（含 inputMethodDistribution）
              client_ts, server_ts, schema_version)

daily_stats(id PK, student_id FK->users, stat_date, practice_count, avg_score, best_score,
            UNIQUE(student_id, stat_date))               -- 由 score_records 汇总刷新
```

关系：users 1—N score_records；classes 1—N training_tasks；training_tasks 1—N task_assignments；classes N—N users（经 class_members）。

### 4.4 Spring Boot 模块划分

```
orchestra-backend/
├── config/          # 安全(JWT)、CORS、OpenAPI、全局异常
├── auth/            # 注册/登录/刷新，角色控制
├── user/            # 用户与班级成员管理
├── classroom/       # 班级 CRUD、加入码、学生导入
├── instrument/      # 乐器字典（对齐 1.x instrument_models.js）
├── task/            # 训练任务发布、领取、完成回执
├── score/           # 成绩上报(POST /api/scores)、查询、报告 JSONB 存取
└── stats/           # 个人/班级统计、排行榜、daily_stats 汇总
```

核心接口草案：
- `POST /api/auth/register | /api/auth/login`
- `POST /api/classes`、`POST /api/classes/{id}/join`（学生凭 join_code 加入）
- `POST /api/tasks`（教师）、`GET /api/tasks/my`（学生）
- `POST /api/scores`（上报 1.x 报告 JSON）、`GET /api/scores/me`、`GET /api/classes/{id}/stats`

## 5. 后续事项
- 2.0 前端改造点：score_report 上报钩子（report_generator.js 之后追加 POST）、登录态、任务大厅页。
- Postgres 容器由后续任务单启动（本任务未启动任何服务）。

## 6. C2（P1 闭环开发）与 baseline 的关系

baseline-v1 是 K:\KOUzi 的 1.x 纯前端快照，包含 1.x 全部功能与资源。C2 的贡献**全部为新增**：

- 新增 `backend/`（Spring Boot 3 + Java 21 + Maven + PostgreSQL 17 + Flyway，端口 8083，库 orchestra，容器 orc-postgres @55434）。
- 新增 `report_sync.js` 与 17 个训练页的 `<script>` 挂载（1.x 引擎 main.js / instrument_models.js / vexflow_engine.js 等零改动，git diff 可证）。
- 新增 `scripts/add_report_sync.py`（幂等挂载脚本）。
- 原 1.x 训练功能保持完全可用；report_sync 未登录/后端不可达时静默跳过。

## 7. C2 交付明细

### 7.1 Controller / Service / Repository 清单（均位于 backend/src/main/java/com/orchestra/training/）

- controller/AuthController.java — POST /api/auth/login（教师/学生 JWT 登录）
- controller/TaskController.java — POST /api/tasks（教师）、GET /api/tasks
- controller/RecordController.java — POST /api/records（学生，报告经 Jackson 序列化为 JSONB）、GET /api/records（教师，支持 studentNo/instrumentId/taskId 过滤）、GET /api/records/me（学生本人历史）
- controller/StudentController.java — GET /api/students、GET /api/students/{studentNo}/stats（练习次数、平均分）
- service/RecordService.java、service/TaskService.java
- repository/StudentRepository.java、TeacherRepository.java、TrainingTaskRepository.java、TrainingRecordRepository.java
- security/JwtService.java、security/JwtAuthFilter.java；config/SecurityConfig.java、CorsConfig.java、SeedDataRunner.java

### 7.2 迁移与表结构

backend/src/main/resources/db/migration/V1__init.sql：

- students(id, student_no UNIQUE, name, password_hash, created_at)
- teachers(id, username UNIQUE, name, password_hash)
- training_tasks(id, instrument_id, title, requirement, deadline_at, created_by, created_at)
- training_records(id, student_no FK→students, instrument_id, task_id FK→training_tasks 可空, score, accuracy, duration_ms, report_json JSONB, submitted_at)

环境：Spring Boot 3.3.5 / Java 21 / Maven / PostgreSQL 17.10（容器 orc-postgres @ localhost:55434，compose 文件 backend/docker-compose.yml，未占用 5432）/ Flyway / 端口 8083。

### 7.3 权限方案

JWT（jjwt 0.12.6，HMAC，role claim → ROLE_TEACHER / ROLE_STUDENT）：
- POST /api/records 仅学生；GET /api/records 与 /api/students/** 仅教师；POST /api/tasks 仅教师；GET /api/tasks 双角色；/api/records/me 仅学生本人（学号取自 JWT，防伪造）。
- 演示账号（虚构）：teacher01/teacher123、student01/student123（SeedDataRunner 启动时播种，bcrypt 存储）。

### 7.4 测试清单与真实结果

- 单测：RecordServiceTest（3 用例：未知任务/未知学生/自由练习保存）— Tests run: 3, Failures: 0, Errors: 0
- 闭环 IT：it/ClosedLoopTest（6 用例：双角色登录、学生发任务被拒 403、教师发任务、学生提交成绩关联任务、学生查成绩列表被拒 403、教师查询成绩+统计）
- 汇总：Tests run: 9, Failures: 0, Errors: 0 — BUILD SUCCESS（mvn test，exit 0）
- 测试运行方式：docker run maven:3.9-eclipse-temurin-21 挂载 backend/，SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:55434/orchestra
- 真实失败记录（已修复）：① 初版动态 JPQL CAST(:x AS bigint) 校验失败 → 改为 Service 内存过滤；② report 字段误用 String.valueOf 产生非法 JSON（PostgreSQL jsonb 拒绝）→ 改 Jackson ObjectMapper；③ PS 重写测试文件损坏 UTF-8 编码 → 重建文件。

### 7.5 原游戏兼容性冒烟

- 前：node --check main.js / instrument_models.js / vexflow_engine.js / rhythm_validator.js / report_generator.js / audio_manager.js / nav_transition.js → JS-CHECK-OK（exit 0）
- 挂载：scripts/add_report_sync.py 为 17 个训练页追加 report_sync.js 引用（幂等）
- 后：再次 node --check 通过；git diff baseline-v1 --stat 对 7 个引擎文件为空 → 零改动
- 浏览器冒烟：headless Edge 打开 trombone.html 完整渲染（docs/demo-trombone-page.png）

### 7.6 端到端演示步骤（已实测，全部通过）

1. docker compose up -d orc-postgres（backend/ 目录）
2. 启动后端：容器内 java -jar target/orchestra-training-0.1.0.jar（8083），日志 Started TrainingApplication
3. 学生登录 → POST /api/records 提交自由练习（score 72，report 含 inputMethodDistribution）→ 入库 id=2
4. 学生提交关联任务的训练成绩（taskId=1，score 85）→ 入库 id=3
5. 教师登录 → GET /api/records?studentNo=student01 → 返回 3 条记录（reportJson JSONB 完整）
6. 教师查统计 GET /api/students/student01/stats → {"count":3,"avgScore":80.67}
7. 越权校验：学生 GET /api/records → 403；无凭据 POST /api/tasks → 403
8. 浏览器演示：http://localhost:8083/ 控制台，teacher01 登录并查询成功（docs/demo-console.png）
9. 训练页兼容性截图：docs/demo-trombone-page.png

### 7.7 Backlog（本单未实现，按约登记）

- 成绩查询改 Specification/动态 SQL（当前内存过滤）
- 学生注册流程、班级/班级成员、多学生数据
- 教师导出报表、任务截止校验、限流
- 生产化：JWT 密钥外置、CORS 收紧、HTTPS、容器化后端镜像

### 7.8 阻塞项

无（本机无 mvn，用 docker maven 镜像构建；Docker Hub 直连被墙，经 docker.m.daocloud.io 拉取镜像）。

## 8. C3（P2 部署与演示 + P1 测试复核）

### 8.1 P1 测试复核（独立复跑，真实结果）

在全新容器独立运行：docker run maven:3.9-eclipse-temurin-21 挂载 backend/，SPRING_DATASOURCE_URL=host.docker.internal:55434，mvn surefire:test

- com.orchestra.training.it.ClosedLoopTest — Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
- com.orchestra.training.service.RecordServiceTest — Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
- 汇总：Tests run: 9, Failures: 0, Errors: 0, Skipped: 0 — BUILD SUCCESS — exit code 0（2026-11-14T05:11Z）

### 8.2 可复现部署

- backend/docker-compose.yml 双服务：orc-postgres（postgres:17-alpine @55434，healthcheck）+ orc-backend（eclipse-temurin:21-jre，挂载 target jar，@8083，SPRING_DATASOURCE_URL 指向 orc-postgres 容器网络；JWT 密钥走环境变量 ORC_JWT_SECRET）。
- README.md 新增"2.0 一键部署"章节（build → compose up → 控制台/训练页访问方式 → down/up），步骤已按文档实测执行。
- 1.x 静态页经 python -m http.server 8090 提供（file:// 被浏览器安全策略禁用）；新增 auth.html 学生登录页（真实 UI 登录 → 写入 orc_token → 跳转大厅）。

### 8.3 真实游戏操作演示（核心）

流程：auth.html 真实 UI 登录 student01 → trombone.html → 点击 START → 真实鼠标点击把位按钮完成一轮（Playwright 真实输入事件，28-109 次点击）→ 结算（指挥血压爆表失败局）→ report_sync.js 自动 POST 200 → psql 确认 training_records 新行。

关键结果行（round5，真实输入，约 5 秒被失败终止）：

```
 id | student_no | instrument_id | score | accuracy | duration_ms | submitted_at
 10 | student01  | trombone      |     0 |        0 |        5071 | 2026-11-14 05:53:09+00
```

- 学生端 /api/records/me 含 id=10；教师端 GET /api/records 含 id=10
- 越权：学生 token GET /api/records → 403；学生 token POST /api/tasks → 403
- 证据文件：docs/demo/evidence-c3.txt

### 8.4 演示材料（docs/demo/）

- demo-round4-settlement.png / demo-round5-settlement.png（游戏内结算画面：TRAINING REPORT 指挥血压爆表）
- demo-settlement-iab.png（第 3 轮结算）
- demo-settlement-fullscreen.png（PIL 全屏截图，含误捕获其他窗口，仅存档）
- demo-trombone-page.png（训练页兼容性，docs/ 下）
- demo-console.png（教师控制台查询，docs/ 下）
- evidence-c3.txt（psql 行 + 教师查询 + 学生 me + 403 证据）

### 8.5 持久化验证

docker compose down（保留 orc-pgdata 卷）→ docker compose up -d → 复查：

```
SELECT id, score, accuracy, duration_ms, submitted_at FROM training_records WHERE id = 10;
-- 10 | 0 | 0 | 5071 | 2026-11-14 05:53:09.43718+00   （数据仍在）
```

（期间宿主重启导致容器 Exited 255 一次，卷数据完整保留，compose up 后即恢复。）

### 8.6 C3 期间发现并修复的问题

- CORS 预检：OPTIONS /api/records 被安全链拦截导致浏览器 fetch "Failed to fetch"（login 因 URI 在 permitAll 中而幸免）→ SecurityConfig 放行 OPTIONS。
- report_sync 映射：1.x 报告实际字段 hits/accuracy/startedAt/endedAt；且 `|| ` 链会吞掉合法 0 值 → pickFirst 显式 null 判断；score 约定 = round(accuracy*100)；duration 由 startedAt/endedAt 推算；指纹加 endedAt 防重复提交。
- compose 后端镜像走 docker.m.daocloud.io（Docker Hub 直连被墙）。

### 8.7 Backlog

- 录屏（ffmpeg gdigrab）本轮未做：IAB 截图字节通过 PUT 通道落盘（scripts/put_receiver.py），分步截图已满足证据要求；录屏留待 P3。
- 点击命中率为 0（节奏窗口判定严格，自动化点击均在窗口外），属游戏玩法层面，不影响闭环链路；人工命中验证留待后续任务单。
- auth.html 应纳入大厅入口 UI（当前直接访问 URL）。

### 8.8 阻塞项

无。

## 9. C4（P3 收尾与价值强化）

### 9.1 教师控制台完善

页面：backend/src/main/resources/static/index.html + console.js（深色主题，配色对齐游戏大厅 hub.css 的金/深蓝调，演示级）。

功能（全部经浏览器实测）：
- 班级列表 + 邀请码：GET /api/classes（V2 迁移新增 classes 表，演示班级 join_code=ORC2026）
- 训练任务列表 + 每任务完成学生数：GET /api/tasks/progress（TrainingRecordRepository.countDoneStudentsPerTask() 聚合去重）
- 学生成绩表格：GET /api/records?studentNo=&instrumentId=&taskId= 过滤（实测 student01+trombone 返回 12 行）
- 单学生统计卡：练习次数/平均分/最佳成绩/今日练习 + daily_stats 日表（RecordService.statsOf 扩展 bestScore 与 daily 数组）

对应后端新增：ClassRoom/DailyStats 实体、ClassRoomRepository/DailyStatsRepository/TaskProgressView、ClassController、TaskController /progress、SecurityConfig 新增 `/api/tasks/progress、/api/classes/** → TEACHER`、V2__classes_and_daily_stats.sql。

截图：docs/demo/demo-c4-console.png（教师登录态全功能展示）。

### 9.2 代码学习指南

docs/CODE_GUIDE.md：JWT 双角色鉴权过滤链逐文件讲解（JwtService/JwtAuthFilter/SecurityConfig 顺序陷阱）、RecordService JSONB 序列化与查询过滤（含 C2/C3 踩坑复盘）、daily_stats 增量汇总策略、Flyway 迁移纪律、测试策略对比，附 8 个面试问答（无状态鉴权、过滤链顺序、汇总表 vs GROUP BY、JSONB 优势、@Transactional、增量挂载、MockMvc vs Testcontainers、迁移不可改）。

### 9.3 自查修复

- Docker Maven 完整 `mvn test` 复跑（SPRING_DATASOURCE_URL=host.docker.internal:55434）：
  - 第 1 次：exit 1，14 tests / 11 errors —— 根因 orc-postgres 被宿主重启终止（Exited 255），连接被拒；日志保留于 surefire 报告，compose up 恢复后复跑。
  - 第 2 次：exit 1，14 tests / 1 error —— TeacherConsoleTest.statsIncludeBestScoreAndDaily 断言 ClassCastException（Jackson 把 95.0 序列化为整数 95，hamcrest Double 比较失败）；修正断言（isNumber + 94.9 阈值）。
  - 第 3 次：**exit 0**，ClosedLoopTest 6/6 + TeacherConsoleTest 5/5 + RecordServiceTest 3/3 = **Tests run: 14, Failures: 0, Errors: 0 — BUILD SUCCESS**（2026-11-15T11:05Z）。
- report_sync.js 挂载一致性抽查：trombone/trumpet/violin/percussion/euphonium-challenge/bassoon 六页 script 标签逐字节一致；全部训练页 17/17 挂载（旧单弦调试页 violin-g/d/a/e 按设计不挂载）。
- K:\KOUzi 零修改：git status 仍为 not a git repository（.git 空目录，与 C1 基线一致）。
- .env：仓库根与 backend/ 均不存在 .env 文件；compose 中 ORC_JWT_SECRET 为可选环境变量，默认值仅演示用途。

### 9.4 Backlog

- 班级成员管理 UI（学生凭 join_code 加入流程后端尚无 POST /api/classes/{id}/join）。
- 任务列表分页、成绩导出 CSV。
- 控制台移动端适配。

### 9.5 阻塞项

无。

## 10. C5（P3 第二波：录屏 + 学生端 + README 终稿）

### 10.1 学生端

- backend/src/main/resources/static/student.html + 仓库根 student.html（静态服务器同源提供）：GET /api/records/me 明细表 + 个人统计卡（练习次数/平均分/最佳/今日，来自 daily_stats）。
- AuthController 登录响应新增 username 字段；auth.html 登录时写入 localStorage.orc_me，student.html 用其查询个人统计。
- 根目录 StudentApiTest：4 用例（登录返回 username、学生本人明细 200、教师访问 /api/records/me 403、未登录 403）。

### 10.2 测试真实结果

最近一次完整 mvn test（Docker maven:3.9-eclipse-temurin-21，SPRING_DATASOURCE_URL=host.docker.internal:55434）：
ClosedLoopTest 6/6 + StudentApiTest 4/4 + TeacherConsoleTest 5/5 + RecordServiceTest 3/3 = **Tests run: 18, Failures: 0, Errors: 0 — BUILD SUCCESS — exit code 0**（2026-11-15T13:53Z）。
C5-R 期间本机 maven/mvnw 不可得、红色警报禁止 docker，未能再次复跑；最近结果如上，未发现任何代码变更后未测风险（本次新增仅 StudentApiTest 与静态页/登录字段，均在 18/18 集内已覆盖或为纯前端）。

### 10.3 演示材料与录制说明

- 桌面级 ffmpeg gdigrab 已验证可运行，但桌面存在与项目无关的私人窗口（隐私），且演示窗口 Raise/gdigrab 截帧为全黑（遮挡窗口 BitBlt 不带内容）——**如实放弃桌面录屏，采用分步截图交付**（总控预案之一）。
- 已有真实演示素材：docs/demo/ 下 C3 真实训练结算（demo-round5-settlement.png 等）、evidence-c3.txt（psql 落库行 + 教师查询 + 403）、C4 教师控制台全功能截图 demo-c4-console.png。
- 学生端截图与 c5-loop.mp4 合成（scripts/frames_concat.py 已备）：受本回合浏览器通道不稳定影响未完成，列为阻塞项；capture 基建（put_receiver.py 8091 + IAB 截图 PUT 落盘）已验证可用（C3/C4 共 5 张截图经此通道落盘）。

### 10.4 部署形态说明（C5-R）

红色警报（C 盘 9GB）后：orc-postgres 由总控单独拉起（55434，保留卷）；后端以宿主 java -jar 直接运行 backend/target/orchestra-training-0.1.0.jar（8083），student.html 因不在 SecurityConfig permitAll 列表（后端不可重打包）改由 8090 静态服务器同源提供（与 auth.html 同机制）。Backlog：student.html 加入 permitAll 并重打包。

### 10.5 阻塞项

1. 学生端实测截图未完成（浏览器通道不稳定，capture 基建已验证可用）。
2. mvnw test 复跑未执行（本机无 maven/mvnw 且 docker 禁用）；最近 18/18 exit 0 结果见 10.2。

## GitHub 发布（C-GH1）

- 白名单核对：源开发仓 3229 文件 / 653.7MB -> 暂存仓 340 文件 / 77.3MB；已排除 project/（189MB 内部项目）、.agents/（25MB 素材工作区）、c2-verify.log；保留 H5 全部页面与资源、backend/、合格 docs（CODE_GUIDE + demo 证据）、backend/docker-compose.yml。
- LICENSE：MIT（仅代码）；素材三类署名（Soundimage BGM 署名必备、Kenney CC0、AI 生成图）见 README 与 AUDIO_CREDITS.md。
- JWT：APP_JWT_SECRET 环境变量化（compose 透传 ORC_JWT_SECRET，默认值仅本地演示）；演示账号 teacher01/student01 仅本地演示用。
- CI：.github/workflows/ci.yml —— GitHub Actions 零密钥方案（services postgres:17-alpine @55434 + temurin 21 + mvn test），推送后生效。
- Topics 建议：spring-boot / jwt / jsonb / postgresql / h5-game / flyway / sight-reading / education-game。
- SHA256 清单：SHA256SUMS.txt（本仓全部跟踪文件，构建产物 target/ 与 .git 除外）。

### 独立部署验证（暂存仓从零执行，2026-11-22）

- 构建与部署：暂存仓 backend/ Docker Maven 构建 jar（52.9MB）→ `docker compose up -d`（orc-postgres healthy @55434 + orc-backend @8083，JWT 走 APP_JWT_SECRET）。
- 测试复核：Docker Maven `mvn test` — **Tests run: 18, Failures: 0, Errors: 0 — BUILD SUCCESS — exit 0**（2026-11-22T11:43Z）。
- 宿主机验证：教师控制台 / → 200；student.html / auth.html（静态服务器 8090）→ 200/200；教师/学生双角色登录成功；学生提交成绩落库（id=19，score 90）；教师查询含新成绩；学生 token 访问 /api/records → 403。
### GO 自评

GO：白名单提取干净（653.7MB→77.3MB，排除项零残留）、三类素材署名完整、JWT 环境变量化、18/18 测试复核通过、独立部署与闭环 API 验证通过、零密钥 CI 就绪、SHA256 清单生成。公开推送由项目作者确认后执行。

## GitHub 发布（C-GH2，正式公开发布，2026-11-22）

用户正式批准后执行，仅使用本审计通过发布仓。

- **仓库**：https://github.com/Fpj5085/orchestra-training （Public，main 分支，git 历史 3 commit 起：baseline / JWT 统一 / CI+SHA256；未使用 --mirror/--all）
- **Topics**：education-game, flyway, h5-game, jsonb, jwt, postgresql, sight-reading, spring-boot（gh repo edit 实设）
- **线上核对证据**：docs/github-evidence/（repo.json / readme-online.json / license-online.json / audio-credits-online.json / workflow-online.json / topics.json / remote-log.txt / runs.txt / run-45042515178.txt）
- **CI**：首跑失败（settings 路径相对仓根，28s）→ 修复 → **run 45042515178 全绿 57s**（services postgres 零密钥路径真实触发）；https://github.com/Fpj5085/orchestra-training/actions/runs/45042515178 ；修复后 README 加 CI 徽章。
- **CI 补充（最终态）**：C-GH2 push 触发 run 45043898703 失败（StudentApiTest 依赖库中已有成绩，空库返回空数组）→ 修为自足测试（先提交成绩再断言）→ **run 45044121907 全绿 38s**（main HEAD 72fecad）。当前 main CI 绿。
- **clone 独立验证**：gh clone 到 K:\Fpj Project\tmp-clone-c（067f77c，含徽章）；宿主 jar 构建（含一次中断构建的 0 字节 jar/目录化残留清理）→ compose up（orc-postgres healthy @55434 + orc-backend @8083）→ 控制台 200、教师登录 OK → Docker Maven mvn test **18/18 exit 0**（mvn 复跑为 mvnw 的等效替代，本仓无 wrapper，标注）→ student.html/auth.html 静态 200。
- **JWT**：线上 workflow 与 compose 均环境变量注入（CI 零密钥值 ci-zero-secret-credentials-* / 本地演示默认值），无真实凭据公开。
- **Tag/Release**：tag v1.0.0（annotated，发布说明）已推送；Release https://github.com/Fpj5085/orchestra-training/releases/tag/v1.0.0 附 notes 与 SHA256SUMS.txt。
- 本仓本地配置 git 身份 Feng Pinjun / fengpinjun@local（仅仓库级）。
