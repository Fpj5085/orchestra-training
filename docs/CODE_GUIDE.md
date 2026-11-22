# CODE_GUIDE — 乐团识谱训练平台 2.0 代码学习指南

写给项目所有者本人学习/面试用。逐文件讲解核心机制，末尾附面试问答。代码位于 `backend/src/main/java/com/orchestra/training/`。

## 1. JWT 双角色鉴权（security/ 与 config/SecurityConfig）

### JwtService.java
- 构造时用 `app.jwt.secret`（≥32 字节）生成 HMAC `SecretKey`；`issue()` 用 jjwt 0.12 的 `Jwts.builder()` 写入 subject=用户名、claim role=TEACHER/STUDENT、iat/exp，签名后输出三段式 token。
- `parse()` 用 `Jwts.parser().verifyWith(key).parseSignedClaims(token)`：**验签+过期校验一步完成**，非法/过期 token 抛异常。

### JwtAuthFilter.java（OncePerRequestFilter）
- 每个请求执行一次：取 `Authorization: Bearer xxx` → `parse` → 用 subject 当 principal、`ROLE_`+role 当 authority 构造 `UsernamePasswordAuthenticationToken` 放入 SecurityContextHolder。
- 解析失败**静默跳过**（不抛 401），请求继续走过滤链，最终由授权规则决定 401/403——未登录访问公开页不会产生噪音。

### SecurityConfig.java（过滤链与授权规则）
- `csrf.disable()` + `STATELESS`：无 session，每个请求凭 token 自证身份（前后端分离标准配置）。
- 授权规则**自上而下短路匹配**，顺序敏感：
  1. `OPTIONS /** permitAll`——CORS 预检不带 Authorization，若不放行浏览器跨域 POST 会先死在预检（C3 实际踩过的坑）。
  2. 静态页与 /api/auth/login permitAll。
  3. `POST /api/tasks → TEACHER` 必须放在 `/api/tasks → 双角色` **之前**，否则学生会通过后面的宽规则发任务。
  4. `POST /api/records → STUDENT`；`/api/records/me → STUDENT`；`/api/records/**、/api/students/** → TEACHER`；`/api/tasks/progress、/api/classes → TEACHER`。
- JwtAuthFilter 在 `UsernamePasswordAuthenticationFilter` 之前注册，保证进入授权判断时上下文已就绪。

## 2. RecordService（JSONB 序列化与查询过滤）

### JSONB 写入链路
`report`（前端对象）→ `RecordController.submit()` 用 `ObjectMapper.writeValueAsString` 序列化（不能用 `String.valueOf`，会生成 `{schema=1.1.0}` 这种非 JSON 串，PostgreSQL jsonb 直接拒绝——C2 踩过的坑）→ `TrainingRecord.reportJson` 标注 `@JdbcTypeCode(SqlTypes.JSON) + columnDefinition="jsonb"` → Hibernate 6 产生 jsonb 绑定 → `ddl-auto: validate` 保证实体与迁移一致。

### 查询过滤
`search()` 目前是 `findAll().stream().filter(...)` 内存过滤（P1 数据量小，简单可靠）。升级路径：JPA `Specification` 动态拼 where，或 PostgreSQL 原生查询利用 jsonb 索引。

### report_sync.js（前端挂载）
- 不改 1.x 引擎：轮询 `window.__REHEARSAL_BOMB_REPORT__`，指纹（instrumentId+score+accuracy+duration+endedAt）去重。
- **0 值陷阱**：`pickNumber() || pickNumber()` 会把合法的 0 吞成 null（accuracy=0 是真实成绩），封装 `pickFirst()` 显式判 null。
- 未登录/后端不可达时静默跳过，1.x 行为零影响。

## 3. daily_stats 汇总策略（C4）

- `training_records` 是明细流水；`daily_stats`（student_no+stat_date 唯一）存 practice_count / sum_score / best_score。
- 写入时机：`RecordService.submit()` 同一事务内对"学生+当日"行做增量 upsert（存在则累加，否则新建）。平均分 = sum_score/practice_count 派生，**不落库**，避免存两个可能不一致的事实。
- 查询端点 `GET /api/students/{no}/stats` 返回 count/avgScore/bestScore + daily 数组，控制台统计卡直接消费。
- 为什么不查询时 group by 现算：见问答 Q3。

## 4. 迁移纪律（db/migration）

Flyway `V1__init.sql`（四张核心表）→ `V2__classes_and_daily_stats.sql`（班级+汇总表，含演示班级种子）。**已发布的迁移文件永不修改**，变更一律新增 V(n+1)——防止已有环境 checksum 漂移。

## 5. 测试策略

- `RecordServiceTest`：纯 Mockito 单测，验证业务校验（未知任务/学生拒绝、自由练习 taskId=null）。
- `ClosedLoopTest` / `TeacherConsoleTest`：`@SpringBootTest + MockMvc`，连真实 orc-postgres（55434），覆盖"提交→查询→统计→越权"闭环与教师端新端点权限。选 MockMvc+受控真库而非 Testcontainers：单机开发下更简单可重复（理由见 Q7）。

## 6. 面试问答（8 题）

**Q1: JWT 无状态鉴权如何实现？和 session 有什么区别？**
答：登录成功后服务端用密钥签发含用户名+角色+过期时间的 token，之后每个请求自带 token，服务端只需验签（JwtAuthFilter 里 parse 即完成认证），不存任何会话状态。区别：session 需要服务端存储（内存/Redis）且依赖 Cookie，水平扩展要粘性会话或共享存储；JWT 无状态、天然跨服务，代价是无法主动作废（只能靠短 TTL+refresh token 或黑名单）。本项目 role claim 放进 token，授权判断零查库。

**Q2: Spring Security 过滤链的匹配顺序为什么重要？举个本项目例子。**
答：authorizeHttpRequests 自上而下短路。本项目 `POST /api/tasks → TEACHER` 必须写在 `/api/tasks → TEACHER|STUDENT` 之前，否则学生发任务请求先命中宽规则，造成越权。同理 `OPTIONS /** permitAll` 必须最前，否则 CORS 预检被 401，浏览器报 "Failed to fetch"。

**Q3: 为什么建 daily_stats 汇总表而不是查询时 GROUP BY 现算？**
答：明细表只增不改，GROUP BY 每次都要扫描聚合，数据涨到几十万行后查询变慢且给库持续施压。汇总表把计算摊到写入时（每笔成绩一次 upsert），读统计变成点查。代价是写入多一次操作和衍生数据一致性责任——所以放同一事务保证原子性，平均分只存 sum/count 不存结果，杜绝双份事实。

**Q4: PostgreSQL JSONB 相比存 TEXT 或拆成关系表有什么优势？**
答：1.x 报告 schema 一直在演进（1.1.0 含 inputMethodDistribution、noteEvents 数组），拆表要为每个新字段改迁移；TEXT 则完全不可查询。JSONB 存解析后的二进制树：支持 ->>/@> 查询和 GIN 索引，还能保留完整原始报告审计。本项目 reportJson 原样入库，统计字段（score/accuracy）另建列——查询字段独立成列、长尾结构进 JSONB 是典型混合方案。

**Q5: @Transactional 在 submit() 里保证什么？不加会怎样？**
答：保证"插成绩+更新 daily_stats"两步原子。不加时第二步失败会出现成绩入库但汇总丢失，统计卡数字变小；回滚后学生重试即可，不产生半脏数据。注意 @Transactional 默认只回滚 RuntimeException——本项目抛的 ResponseStatusException 属于 RuntimeException，OK。

**Q6: 前端如何做到不改 1.x 一行引擎代码接入后端？**
答：增量挂载。report_sync.js 轮询 main.js 挂到 window 的 __REHEARSAL_BOMB_REPORT__，指纹去重后 POST；未登录或失败静默降级；HTML 只加一个 script 标签。1.x 离线可玩与 2.0 联网同步互不拖累，git diff baseline-v1 对引擎文件恒为空可证明。

**Q7: MockMvc 和 Testcontainers 各适合什么场景？你为什么选前者？**
答：MockMvc 走服务端模拟，不占端口、快，配受控真实数据库即可覆盖 Controller→Service→SQL 全链。Testcontainers 临时起隔离容器，适合 CI 无公共库或多版本矩阵；代价是依赖 docker 套接字，Windows 容器网络下繁琐。单机开发且已有受控库时 MockMvc+真库更简单可重复。

**Q8: Flyway 迁移文件为什么发布后不能改？**
答：Flyway 用 checksum 记录每个已执行版本，改文件导致 validate 失败，已有环境的库拒绝启动。正确做法是永远新增 V(n+1)，撤销就写反向迁移。本项目 V1 建表、V2 加班级和 daily_stats 按此纪律执行。
