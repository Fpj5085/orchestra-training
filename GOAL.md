# GOAL: 乐团识谱训练大厅

## 当前目标

把原来的长号 MVP 扩展成可持续添加乐器的纯前端 H5 乐团识谱训练项目。当前阶段已完成用户清单中的首批乐团入口和可玩训练室，保持项目可双击 `index.html` 运行、可上传静态托管、可交给扣子 Coding Agent 生成公网网址。

## 当前可玩范围

- 总入口：`index.html` 乐团识谱训练大厅。
- 长号：`trombone.html`，低音谱号，1-7 把位，30 秒生存制。
- 铜管：`trumpet.html`、`euphonium.html`、`horn.html`、`tuba.html`。
- 木管：`flute.html`、`piccolo.html`、`saxophone.html`、`soprano-saxophone.html`、`bassoon.html`。
- 弦乐：`violin.html`、`cello.html`、`double-bass.html`，采用大厅一个入口、页内选弦、训练中单弦指位输入。
- 打击乐：`percussion.html`，打击乐谱表，Kick/Snare/Hi-Hat/Tom/Crash 鼓件触发垫。

## 成功标准

- 纯 HTML/CSS/JavaScript，无后端、无远程 CDN、无在线 API。
- `index.html` 可双击打开，并能进入可玩训练室。
- 大厅保留本地图片资源，不依赖外链。
- 训练室由 `window.REHEARSAL_GAME_CONFIG.instrumentId` 选择乐器，避免每个乐器复制一份主循环。
- `instrument_models.js` 集中维护乐器模型、谱号、输入控件、音高到物理操作映射和训练谱面。
- `vexflow_engine.js` 支持 bass/treble 两种谱号的本地 SVG 渲染。
- Game Loop 继续使用 `requestAnimationFrame`，支持 Perfect/Good/Miss/Wrong 判定、血压槽、Game Over/通关、结算报告。
- 结算 JSON 隐藏在折叠的开发者诊断区，同时继续挂载到 `window.__REHEARSAL_BOMB_REPORT__` 并保留 `generateCozePayload(report)`。
- 给扣子部署时使用完整轻量 zip 包，不能只上传 `index.html`。

## 架构决策

- 保持无构建工具、无模块化打包，确保 `file://` 和静态托管都能运行。
- 每个可玩乐器一个 HTML 壳，例如 `trombone.html`、`trumpet.html`，页面只设置 `window.REHEARSAL_GAME_CONFIG.instrumentId`。
- `main.js` 读取乐器模型后动态渲染页面标题、谱号标签、底部控制按钮和目标提示。
- 乐器差异只放在 `instrument_models.js`：`controls`、`pitchMap`、`sequence`、`clef`、`operationName`。
- 报告结构暂时保留 `worstPositions` 字段名兼容旧长号报告，同时事件里新增 `inputOperation`/`expectedOperations` 语义。
- 协作偏好：Codex 负责总体规划、架构边界、验收标准和最终 review；Codex 已确认可通过终端调用 Claude Code，但默认不主动使用。后续遇到重复、小而独立、容易验收的任务时，Codex 先给出是否使用 Claude 的建议，优先建议 Claude medium 而不是高成本 opus high，再由用户决定是否执行。

## 风险点

- 浏览器自动化在当前 Codex 沙箱中无法启动 Playwright 自带 Chromium，也无法启动本机 Chrome，原因分别是缺少浏览器二进制和 `spawn EPERM`。本轮以语法检查、资源检查、模型检查替代，仍建议用户本机肉眼打开一次确认视觉。
- 本地 SVG 谱面渲染器足够支撑 MVP，但不是完整 VexFlow；复杂节奏、调号、连音线等后续仍建议接入本地化 VexFlow。
- 小号按键映射采用入门 written pitch 训练模型，后续如用于严肃教学，需要老师校准移调说明和音域。
- 扣子若只拿单个 HTML 会再次丢资源，必须使用轻量 zip 或完整文件夹上传。

## 验证方法

- JS 语法：`node --check main.js instrument_models.js vexflow_engine.js rhythm_validator.js report_generator.js`。
- 资源引用：扫描 HTML/CSS 中的本地 `href/src/url()`，确认文件存在。
- 运行时依赖：扫描远程 `http(s)`、CDN、Google Fonts、在线 API。
- 模型验证：在 Node VM 中加载 `instrument_models.js`，确认 `trombone`、`trumpet` 模型存在，序列可生成，小号为 treble clef，控件数量正确。
- 浏览器验证：当前沙箱未能启动浏览器，最终交付前建议在用户机器中双击 `index.html`，依次进入长号和小号，点击 START 和按钮，确认结算弹窗。

## 进度日志

- 2026-06-22: 完成长号训练室 MVP，总入口、静态部署说明、Gemini 素材提示词、Coze 部署提示词。
- 2026-06-23: 生成 Coze 轻量包，确认扣子不能只拿单个 `index.html`。
- 2026-06-23: 新增小号关卡。重构 `main.js` 为配置驱动，新增 `trumpet.html`，`instrument_models.js` 增加 trumpet 模型和 15 音训练序列，`vexflow_engine.js` 增加 treble clef 渲染。大厅中小号改为 PLAYABLE。
- 2026-06-23: 验证 JS 语法通过；未发现远程运行时依赖；资源引用无缺失；模型检查通过。Playwright Chromium 缺失、本机 Chrome 被沙箱 `spawn EPERM` 拦截，未完成截图级浏览器验证。
- 2026-06-23: 更新 `README.md`、`DEPLOYMENT.md`、`COZE_DEPLOY_PROMPT.md`，准备重新打包 Coze 轻量发布包。
- 2026-06-23: 生成新的扣子轻量发布包 `release/orchestra-game-coze-lite-20260623-004523.zip`，约 1.08MB，包含 `trumpet.html` 和 20 个压缩后的本地图片资源。注意同目录下 `004410` 是一次 assets 未复制成功的异常包，不要使用。
- 2026-06-23: 根据反馈暂停每轮生成轻量包，改为全部乐器阶段完成后统一打包给扣子。训练室顶部“返回乐团大厅”改成更醒目的 EXIT 控制台按钮；结算弹窗新增“退出到大厅”主按钮；“复制诊断数据”移入开发者诊断折叠区，避免干扰正常玩家流程。JS 语法、远程依赖扫描和 HTML 结构检查通过。
- 2026-06-23: 增加通用训练室动效层，供后续所有乐器复用：页面控制台入场、面板扫光、倒计时扫描线、谱面扫描高光、按钮 hover 高光、结算弹窗入场、血压变化心率脉冲、指挥状态抖动。新增 `prefers-reduced-motion` 兼容。JS 语法检查通过；远程依赖扫描无新增风险；浏览器截图级验证仍受当前沙箱限制。
- 2026-06-23: 根据体验反馈收敛动效，删除会影响识谱的全局面板扫光、谱面扫光、倒计时扫描线和整屏正确/错误反馈；保留并强化局部动效：指挥头像轻微呼吸、血压条高光流动、血压变化时心率脉冲和指挥抖动。JS 语法检查通过，远程依赖扫描无新增风险。
- 2026-06-23: 试用终端 Claude Code `opus` + `effort high` 执行“新增次中音号 / 上低音号关卡”。第一次 1 美元预算上限被拦截；第二次不设预算完整运行但 5 分钟超时，已落盘核心实现。Codex 接手收尾：统一“次中音号 / 上低音号”命名，补 README/DEPLOYMENT/COZE_DEPLOY_PROMPT，验证 `euphonium` 模型、页面链接、JS 语法和远程依赖扫描。未打包 release。
- 2026-06-23: Codex 直接新增圆号关卡，不调用 Claude。新增 `horn.html` 和 `horn` 模型，使用 F 圆号 MVP：高音谱号、三键按键组合、15 音 30 秒训练序列。大厅圆号卡片改为 PLAYABLE，README/DEPLOYMENT/COZE_DEPLOY_PROMPT 已补充 `horn.html`。验证：JS 语法通过、远程依赖扫描无新增风险、Node VM 模型检查通过、Chrome file:// smoke test 通过；圆号首音 C 可 Perfect，血压爆表结算报告生成，移动端 390px 无横向溢出。
- 2026-06-23: Codex 直接新增大号关卡，不调用 Claude。新增 `tuba.html` 和 `tuba` 模型，使用低音谱号、按键组合、低音区 15 音 30 秒训练序列。大厅大号卡片改为 PLAYABLE，README/DEPLOYMENT/COZE_DEPLOY_PROMPT 已补充 `tuba.html`。验证：JS 语法通过、远程依赖扫描无新增风险、Node VM 模型检查通过、Chrome file:// smoke test 通过；大号首音 Bb 可 Perfect，血压爆表结算报告生成，移动端 390px 无横向溢出。
- 2026-06-23: Codex 直接新增首个木管关卡：长笛。新增 `flute.html` 和 `flute` 模型，使用高音谱号、T/左手/右手键位指法组合、D4-D5 入门 15 音 30 秒训练序列。根据用户提醒复核 Woodwind Fingering Guide 后，将长笛从 7 个过度简化按钮修正为 8 个基础指法按钮：D4 与 D5 分离，E/F/G/A/B/C/D5 标注为 `T123|12-Eb`、`T123|1--Eb`、`T123|---Eb`、`T12-|---Eb`、`B 1--|---Eb`、`1--|---Eb`、`T-23|123`。大厅长笛卡片改为 PLAYABLE，README/DEPLOYMENT/COZE_DEPLOY_PROMPT 已补充 `flute.html`。同步修正 `main.js` 的操作显示格式，让木管指法显示按钮标签而不是逐字符加号，并压缩木管按钮布局。验证：JS 语法通过、远程依赖扫描无新增风险、Chrome file:// 布局复测通过；长笛首音 D 可命中，桌面端 1366x768 一屏内，移动端 390px 无横向溢出。
- 2026-06-23: Codex 直接新增短笛关卡，不调用 Claude。新增 `piccolo.html` 和 `piccolo` 模型，复用 Woodwind Fingering Guide 所述 flute/piccolo 基础指法体系，使用高音谱号、8 个指法组合、15 音 30 秒训练序列。大厅短笛卡片改为 PLAYABLE，README/DEPLOYMENT/COZE_DEPLOY_PROMPT 已补充 `piccolo.html`。验证：JS 语法通过、远程依赖扫描无新增风险、Node VM 模型检查通过、Chrome file:// smoke test 通过；短笛首音 D 可 Perfect，血压爆表结算报告生成，桌面端 1366x768 一屏内，移动端 390px 无横向溢出。
- 2026-06-23: 根据用户要求进行上下文优化，新增 `CONTEXT_SUMMARY.md`，记录项目约束、已完成乐器、验证方法、Claude 使用偏好和后续方向。
- 2026-06-23: Codex 直接新增萨克斯关卡，不调用 Claude。新增 `saxophone.html` 和 `saxophone` 模型，参考 Woodwind Fingering Guide 的 Basic Fingering Chart for Saxophone，使用高音谱号、8 个基础左右手键位/八度键指法组合、15 音 30 秒训练序列。大厅萨克斯卡片改为 PLAYABLE，README/DEPLOYMENT/COZE_DEPLOY_PROMPT 已补充 `saxophone.html`。验证：JS 语法通过、远程依赖扫描无新增风险、Node VM 模型检查通过、Chrome file:// smoke test 通过；萨克斯首音 D 可 Perfect，血压爆表结算报告生成，桌面端 1366x768 一屏内，移动端 390px 无横向溢出。
- 2026-06-23: Codex 直接新增高音萨克斯关卡，不调用 Claude。新增 `soprano-saxophone.html` 和 `sopranoSaxophone` 模型，复用 Woodwind Fingering Guide 所述各尺寸萨克斯通用基础指法，使用高音谱号、8 个基础左右手键位/八度键指法组合、15 音 30 秒训练序列。大厅高音萨克斯卡片改为 PLAYABLE，README/DEPLOYMENT/COZE_DEPLOY_PROMPT 已补充 `soprano-saxophone.html`。验证：JS 语法通过、远程依赖扫描无新增风险、Node VM 模型检查通过、Chrome file:// smoke test 通过；高音萨克斯首音 G 可 Perfect，血压爆表结算报告生成，桌面端 1366x768 一屏内，移动端 390px 无横向溢出。
- 2026-06-23: Codex 直接新增大管关卡，不调用 Claude。新增 `bassoon.html` 和 `bassoon` 模型，作为木管组代表关卡；使用低音谱号、Heckel-system 基础指法组合、C2-F3 保守初学音域、15 音 30 秒训练序列。指法依据前序 Agent Reach/Jina 复核的 Woodwind Fingering Guide 大管基础指法摘要，不扩展到未确认高音区。大厅大管卡片改为 PLAYABLE，README/DEPLOYMENT/COZE_DEPLOY_PROMPT 已补充 `bassoon.html`。验证：JS 语法通过；主运行文件远程依赖扫描无新增风险，仅保留 SVG namespace；Node VM 模型检查通过，11 个指法按钮、15 个音符均有 validOperations；`report_generator.js` 可生成并挂载 `window.__REHEARSAL_BOMB_REPORT__`，Coze hook 正常。浏览器 smoke 通过 localhost 验证大厅入口、大管页面、低音谱号、按钮渲染、桌面无横向溢出、结算弹窗与退出大厅按钮；当前内置浏览器安全策略阻止 file:// 访问，且只读 evaluate 读不到页面扩展属性，故全局 report 挂载以代码路径和 Node VM 验证为准。
- 2026-06-23: Codex 直接进入弦乐部分，新增首个弦乐关卡：小提琴。新增 `violin.html` 和 `violin` 模型，使用高音谱号、一把位 C 大调保守训练范围，按钮为 G/D/A/E 四根弦的开放弦、1 指、低 2 指、3 指弦位指法；避免高把位、变音和未确认复杂指法。复核后修正 G 弦 B 音为普通 `G2`，不误标为低 2 指。大厅小提琴卡片改为 PLAYABLE，README/DEPLOYMENT/COZE_DEPLOY_PROMPT 已补充 `violin.html`。验证：JS 语法通过；主运行文件远程依赖扫描无新增风险，仅保留 SVG namespace；Node VM 模型检查通过，`violin` 为 `string-fingering`、高音谱号、16 个按钮、15 个音符且无缺失 validOperations；浏览器 localhost smoke 通过，大厅小提琴入口存在、总可玩卡片 11 个、小提琴页面 16 个按钮、高音谱号、桌面无横向溢出、START 与 `G0` 按钮可点击进入训练中；补充了 `string-fingering` 的移动端 4 列/2 列 CSS 覆盖以避免小屏溢出。
- 2026-06-23: 根据用户反馈，小提琴控制台改为更适合长期扩展的两段式输入：先选弦 `G/D/A/E`，再选指位 `0/1/低2/2/3`，最终仍组合成 `G0`、`D2L`、`A3` 等内部判定值。这样常驻操作按钮从 16 个成品键降为 9 个选择键，降低移动端压力，也给大提琴、低音提琴复用同一交互模式预留边界。验证：JS 语法通过；远程依赖扫描无新增风险，仅保留 SVG namespace；Node VM 模型检查通过，compound groups 为 4+5，内部 15 音序列仍指向有效操作；浏览器 localhost smoke 通过，小提琴页面显示两个 compound panel、总 9 个按钮、桌面无横向溢出，点击 G 弦后高亮并提示继续选 FINGER，点击 0 后清除选择并进入原节奏/音高判定逻辑。
- 2026-06-23: 根据用户进一步反馈，两段式在倒计时节奏下需要连续点击两次，可能来不及按。新增四个小提琴单弦训练关：`violin-g.html`、`violin-d.html`、`violin-a.html`、`violin-e.html`，分别绑定 `violinG`、`violinD`、`violinA`、`violinE` 模型。每关只显示该弦的一把位指位按钮，玩家只需单次点击 `0/1/低2/2/3` 中的正确指位。大厅小提琴入口拆成 G/D/A/E 四张 PLAYABLE 卡片，保留 `violin.html` 作为两段式实验页但不作为主入口。验证：JS 语法通过；远程依赖扫描无新增风险，仅保留 SVG namespace；Node VM 模型检查通过，四个单弦模型均为高音谱号、4 个指位按钮、15 个音符且无缺失 validOperations；浏览器 localhost smoke 通过，大厅 G/D/A/E 四个入口均存在，总 PLAYABLE 卡片 14 个，G 弦页显示 4 个按钮 `0/1/2/3`、桌面无横向溢出，START 后单击 `0` 可直接进入原节奏/音高判定逻辑。
- 2026-06-23: 根据用户对大厅空间的反馈，进一步收敛为“大厅一个小提琴入口，页面内选弦”。`index.html` 只保留 `violin.html` 一张小提琴卡片；`violin.html` 增加 G/D/A/E 弦模式选择，默认 G 弦，选择后重载对应 `violinG/D/A/E` 模型。正式训练过程中仍只显示单弦 4 个指位按钮，避免倒计时中连续点击两次。验证：JS 语法通过；远程依赖扫描无新增风险，仅保留 SVG namespace；Node VM 模型检查通过，四个内部单弦模型均为 4 个按钮、15 个音符；浏览器 localhost smoke 通过，大厅只有一个 `violin.html` 小提琴入口，无 `violin-g/d/a/e.html` 分裂入口，`violin.html` 默认 G 弦，点击 D 弦后页面标题、deckTitle、指位按钮和当前目标都切到 D 弦，START 后单击 `0` 可进入原判定逻辑。
- 2026-06-23: 新增大提琴关卡。新增 `cello.html`，采用与小提琴一致的“大厅一个入口，页面内选弦”结构；新增 `celloC`、`celloG`、`celloD`、`celloA` 四个内部模型，低音谱号，一把位 C 大调保守训练范围。C/G 弦使用 `0/1/3/4` 指位，D/A 弦使用 `0/1/2/4` 指位，不直接套用小提琴指法。大厅大提琴卡片改为 PLAYABLE，README/DEPLOYMENT/COZE 提示词已补充 `cello.html`。验证：JS 语法通过；远程依赖扫描无新增风险，仅保留 SVG namespace；Node VM 模型检查通过，四个内部单弦模型均为低音谱号、4 个按钮、15 个音符且无缺失 validOperations；浏览器 localhost smoke 通过，大厅只有一个 `cello.html` 大提琴入口，总 PLAYABLE 卡片 12 个，`cello.html` 默认 C 弦，点击 D 弦后页面标题、deckTitle、指位按钮和当前目标都切到 D 弦，START 后单击 `0` 可进入原判定逻辑。
- 2026-06-23: 新增低音提琴 / 倍大提琴关卡。新增 `double-bass.html`，沿用“大厅一个入口，页面内选弦”结构；新增 `doubleBassE`、`doubleBassA`、`doubleBassD`、`doubleBassG` 四个内部模型，低音谱号、低音提琴记谱音高、半把位基础。每根弦均使用 `0/1/2/4` 指位：E 弦 `E-F-F#-G`，A 弦 `A-Bb-B-C`，D 弦 `D-Eb-E-F`，G 弦 `G-Ab-A-Bb`。`vexflow_engine.js` 增加升号 `♯` 显示支持。大厅低音提琴卡片改为 PLAYABLE，README/DEPLOYMENT/COZE 提示词已补充 `double-bass.html`。验证：JS 语法通过；远程依赖扫描无新增风险，仅保留 SVG namespace；Node VM 模型检查通过，四个内部单弦模型均为低音谱号、4 个按钮、15 个音符且无缺失 validOperations；浏览器 localhost smoke 通过，大厅只有一个 `double-bass.html` 入口，总 PLAYABLE 卡片 13 个，`double-bass.html` 默认 E 弦，E 弦谱面升号 `♯` fresh load 验证通过，点击 A 弦后页面标题、deckTitle、指位按钮和当前目标都切到 A 弦且降号显示存在，START 后单击 `0` 可进入原判定逻辑。
- 2026-06-23: 新增最后一个大类：架子鼓及其他打击乐。新增 `percussion.html` 和 `percussion` 模型，使用 `percussion` 谱表、`percussion-pad` 输入、Kick/Snare/Hi-Hat/Tom/Crash 五个触发垫，训练目标从音高识别改为节奏窗口与鼓件目标识别。`vexflow_engine.js` 增加 percussion clef 简化显示。大厅打击乐卡片改为 PLAYABLE，README/DEPLOYMENT/COZE 提示词已补充 `percussion.html`。验证：JS 语法通过；远程依赖扫描无新增风险，仅保留 SVG namespace；Node VM 模型检查通过，5 个鼓件触发垫、20 个节奏事件且无缺失 validOperations；浏览器 localhost smoke 通过，大厅只有一个 `percussion.html` 入口，页面显示打击乐谱表和 5 个鼓垫，START 后点击鼓垫可进入判定路径，30 秒内血压爆表可触发结算弹窗，开发者诊断默认折叠，移动端 390px 无横向溢出；报告模块验证 `window.__REHEARSAL_BOMB_REPORT__` 挂载与 `generateCozePayload(report)` hook 正常。
- 2026-06-23: 完成第一版“视觉系统升级包”。重写 `hub.css`，将大厅升级为乐团训练终端风格：本地背景图更亮、控制台网格、铜管/木管/弦乐打击分区色、训练舱式乐器卡片、PLAYABLE 状态灯和静态构建提示。增强 `style.css` 中训练室面板、倒计时、血压槽、指挥头像、谱面容器、操作按钮、选弦模式、结算报告卡片的统一质感；局部动效保留在按钮、血压和指挥状态，不遮挡谱面。为所有 HTML 的 CSS 引用加 `?v=20260623-visual-system` 静态版本号，避免浏览器或扣子部署缓存旧样式。验证：JS 语法通过；根目录运行文件远程依赖扫描无新增风险，仅保留 SVG namespace；浏览器 localhost 验证新版 CSS 生效，大厅 14 个 PLAYABLE 入口、卡片高度与伪元素正常、长号训练室 7 个按钮和谱面正常、弦乐页内选弦正常、打击乐 5 个鼓垫正常、START 与鼓垫点击进入判定路径、结算弹窗可触发且开发者诊断默认折叠；桌面与 390px 移动端均无横向溢出。内置浏览器安全策略阻止 `file://` 直接访问测试，双击路径需用户本机肉眼复核。
- 2026-06-23: 根据反馈继续打磨视觉系统。移除大厅“素材提示词”入口，将标题副文案从“先从长号开始...”改为全乐团训练终端语气，将铜管区说明从早期占位文案改为“谱面到真实演奏动作”的说明。新增 `nav_transition.js`，所有 HTML 挂载本地页面切换脚本，配合 `hub.css` / `style.css` 的 `page-enter` 和 `page-leaving` 动画做轻量页面承接。血压槽升级为动态心率监测：`pressure-track::before` 增加 ECG 波形滚动，`pressure-fill` 常态呼吸，错误触发时 `pressure-jump` 和加速 ECG。验证：19 个 HTML 全部挂载 `nav_transition.js?v=20260623-transition2`；旧文案和素材入口无残留；JS 语法通过；远程依赖扫描无新增风险；浏览器 localhost 验证大厅新文案、素材入口消失、长号训练页入场动画、血压 ECG 与错误时跳动动画生效，页面无横向溢出。
- 2026-06-23: 调整失败结算表现。所有关卡失败原因（非 `survived30Seconds`）都会在结算弹窗中插入并显示本地资源 `assets/pig.gif`，放大到桌面约 430px 宽、移动端自适应，随弹窗保持显示直到玩家退出到大厅或重新开始。胜利结算不显示该失败动图。验证：`assets/pig.gif` 存在；JS 语法通过；远程依赖扫描无新增风险；浏览器 localhost 在打击乐关卡中触发血压爆表后，弹窗显示 `pig.gif`，`result-failed` class 生效，开发者诊断仍默认折叠，重新开始后弹窗隐藏。
- 2026-06-24: 新增本地音频系统。使用联网调研和下载素材：Soundimage 的 Eric Matyas 循环音乐作为大厅/游戏 BGM，Kenney Interface Sounds 的 CC0 UI 音效作为 hover/click/error/confirmation 基础音；同时用本地合成生成 `hit-brass.mp3`、`wrong-gliss.mp3`、`clear-fanfare.mp3`，增强管乐训练特色。新增 `assets/audio/`、`audio_manager.js`、`AUDIO_CREDITS.md`；所有 HTML 挂载 `audio_manager.js?v=20260624-audio1`。`AudioManager` 支持预加载、浏览器手势解锁、BGM 循环、SFX 播放、全局静音按钮和音量控制；`main.js` 接入正确命中、Good、连击、错误、失败、通关等音效触发。`README.md` 增加音频系统和 Soundimage 署名说明。验证：音频文件全部本地存在，JS 语法通过，远程依赖扫描无新增风险；浏览器 localhost 冒烟通过，大厅和长号页均显示 `SOUND ON/OFF`，脚本无 console error，START 与按钮点击路径不阻塞原判定。
- 2026-06-24: 修复音频第一次点击后 BGM 不启动、必须切换一次声音开关才播放的问题。根因是初始化时已创建同曲目 BGM，首次用户手势解锁后 `playBgm()` 命中“同曲目已存在”分支直接返回，没有再次调用 `play()`。修复：同曲目分支也调用 `requestBgmPlayback()`；首次解锁监听改为捕获阶段，并在手势中先请求播放当前 BGM、再补预加载，减少浏览器自动播放策略干扰；新增只读 `AudioManager.getState()` 和 `<html data-audio-*>` 状态，便于后续排查。所有 HTML 的音频脚本版本号更新为 `audio2`，避免缓存旧脚本。验证：`node --check audio_manager.js` 通过；19 个 HTML 均引用 `audio_manager.js?v=20260624-audio2`；根目录运行文件远程依赖扫描无新增风险，仅保留 `hub.css` 文案里的 NO CDN 和 SVG namespace；浏览器 localhost smoke 验证长号页首次点击 START 后音频状态变为 unlocked，页面无 console error。当前自动化浏览器音频设备仍把 `paused` 读为 true，实际听感需在用户本机浏览器中复核。
- 2026-06-24: 根据用户复测继续修复 BGM 仍需手动切换声音开关的问题。二次根因：首次手势中 `playBgm()` 后紧跟 `preload()`，而 `preload()` 会对缓存里的当前 BGM 调用 `load()`，导致刚启动的 BGM 被重新加载并停止；另外如果 UI 音效能在点击中播放，BGM 也应在同一点击链路补播。修复：`preload()` 跳过当前 `bgm` 音频对象；`unlock()` 即使已解锁也会再次请求当前 BGM；增加 `click` 解锁事件；`play()` 播放 UI/SFX 前会同步确保 BGM 请求。所有 HTML 音频脚本版本号更新为 `audio4`。验证：`node --check audio_manager.js` 通过；19 个 HTML 均引用 `audio_manager.js?v=20260624-audio4`；根目录运行文件远程依赖扫描无新增风险，仅保留静态文案和 SVG namespace。
- 2026-06-24: 新增两个可玩关卡：单簧管和中提琴。新增 `clarinet.html`、`viola.html`、`assets/clarinet.svg`、`assets/viola.svg`；大厅木管区新增“单簧管”，弦乐与打击区新增“中提琴”。`instrument_models.js` 新增 `clarinet` 模型：高音谱号、Boehm-system 基础指法组合、12 个指法按钮、15 音 30 秒训练序列；新增 `violaC/G/D/A` 四个内部模型：中音谱号、页内选 C/G/D/A 弦、训练中单弦 4 个指位按钮。`vexflow_engine.js` 新增 alto clef 显示；`main.js` 新增 Alto Clef 元信息。为 `instrument_models.js`、`vexflow_engine.js`、`main.js` 增加 `?v=20260624-instruments2` 版本号，避免浏览器缓存旧模型后 fallback 到长号。README、DEPLOYMENT、扣子部署提示词已更新。验证：JS 语法通过；模型检查通过，无缺失 pitchMap/operation；HTML/CSS 资源引用无缺失；根目录运行文件远程依赖扫描无新增风险；浏览器 localhost smoke 通过，大厅显示 16 个 PLAYABLE，单簧管页显示 12 个指法按钮与高音谱号，中提琴页显示 C/G/D/A 选弦与中音谱号，切换 D 弦后仍为 4 个单弦指位按钮；页面无 console error。已生成新扣子三包 `release/coze-zip-upload-20260624-214235`，三包均小于 20MB。
- 2026-06-24: 新增上低音挑战关卡。新增 `euphonium-challenge.html`，大厅里给“次中音号 / 上低音号”旁边增加独立“上低音挑战”卡。`instrument_models.js` 新增 `euphoniumChallenge`：复用上低音号按键映射，但采用 84 BPM、2600ms lead-in、0.5 beat 密度、更多半音/大跳和更密集的挑战谱面；`main.js` 改为支持页面级 `tempoBpm`、`leadInMs`、`gameDurationMs` 配置。将 `instrument_models.js`、`vexflow_engine.js`、`main.js` 版本号提升到 `?v=20260624-instruments3`。README、DEPLOYMENT、COZE_DEPLOY_PROMPT 已同步。验证：JS 语法通过；模型检查通过，挑战模型 sequence 和 pitchMap 完整；资源引用无缺失；浏览器 localhost smoke 通过，大厅显示 17 个 PLAYABLE/CHALLENGE 入口，`euphonium-challenge.html` 标题、低音谱号、控制台和挑战文案正常；移动端无横向溢出；新扣子三包已重新生成并包含挑战页。
- 2026-07-14: 完成全乐器通用键盘输入系统。`main.js` 新增按 `inputType` 分配的键位 profile：长号 `1-7`（含小键盘）、铜管 `A-S-D-F-G-H-J`、木管 `QWER/ASDF/ZXCV`、单弦弦乐 `A-S-D-F`、打击乐 `A-S-D-F-G`；弦乐待命时用 `1-4` 选弦，`Enter` 开始。使用 `KeyboardEvent.code`，忽略 repeat、IME composing、修饰键和可编辑区域；结算弹窗出现后停止玩法快捷键。所有按钮动态显示 `<kbd class="keyboard-hint">` 并设置 `aria-keyshortcuts`，键盘反馈只作用于对应按钮。输入判定改为在操作瞬间用 `performance.now() - game.startClock` 更新时间，减少上一帧造成的 0-16ms 误差。事件报告新增 `inputMethod`，`report_generator.js` schema 升为 `1.1.0` 并增加 `inputMethodDistribution`。21 个训练页的 `main.js`、`style.css`、`report_generator.js` 缓存版本统一为 `20260714-keyboard1`；README、DEPLOYMENT、COZE 提示词和 CONTEXT_SUMMARY 已更新。验证：30 个模型键位容量检查通过；JS 语法、253 个本地资源引用、远程运行时依赖扫描通过；真实浏览器中长号数字键、上低音挑战 A、单簧管 Q、中提琴数字选弦+A、打击乐 D 均命中首音 Perfect；Enter 解锁音频，结算后按键不改变状态；报告正确统计 keyboard/pointer/system；桌面和 390px 移动端无键帽越界或横向滚动；pointer 回归报告统计正确，页面无 console error。发布包 `release/coze-zip-upload-20260714-010957` 包含 77/77 源文件，无缺失/重复，三个 zip 分别为 12.98MB、13.06MB、3.15MB；旧 release 已清理。
