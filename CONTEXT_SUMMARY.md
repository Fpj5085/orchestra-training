# Compact Handoff - 乐团识谱训练大厅

## Session Intent

维护 `K:\KOUzi` 的纯静态 H5 乐团识谱训练游戏。项目必须可双击 `index.html` 运行，也可部署到扣子、Gitee Pages、Cloudflare Pages、GitHub Pages；禁止后端、npm 运行时、远程 CDN、在线 API 和外部字体。

## Current Architecture

- 大厅：`index.html`、`hub.css`。
- 通用训练引擎：`main.js`、`instrument_models.js`、`vexflow_engine.js`、`rhythm_validator.js`、`report_generator.js`、`audio_manager.js`、`style.css`。
- 每个训练页通过 `window.REHEARSAL_GAME_CONFIG.instrumentId` 选择模型；上低音挑战还配置 `tempoBpm`、`leadInMs`、`gameDurationMs`。
- `vexflow_engine.js` 是本地 SVG 谱面引擎，支持 bass、treble、alto、percussion。
- 结算报告挂载到 `window.__REHEARSAL_BOMB_REPORT__`；完整 JSON 默认折叠。

## Playable Pages

- 铜管：`trombone.html`、`trumpet.html`、`euphonium.html`、`euphonium-challenge.html`、`horn.html`、`tuba.html`。
- 木管：`flute.html`、`piccolo.html`、`saxophone.html`、`soprano-saxophone.html`、`clarinet.html`、`bassoon.html`。
- 弦乐：`violin.html`、`viola.html`、`cello.html`、`double-bass.html`；页面内选弦，训练时单次指位输入。
- 打击乐：`percussion.html`。
- `violin-g.html`、`violin-d.html`、`violin-a.html`、`violin-e.html` 是保留的旧单弦调试页，不是大厅入口。

## Keyboard System

- `main.js` 统一把键盘和 pointer 输入路由到 `handleOperationInput()`。
- 使用 `KeyboardEvent.code`；忽略 `repeat`、输入法 composing、修饰键和可编辑区域。
- `Enter` 开始；长号 `1-7`；铜管 `A-S-D-F-G-H-J`；木管 `QWER/ASDF/ZXCV`；单弦弦乐 `A-S-D-F`；打击乐 `A-S-D-F-G`；弦乐待命时 `1-4` 选弦。
- 按钮右上角显示 `<kbd class="keyboard-hint">`，并设置 `aria-keyshortcuts`。
- 输入瞬间用 `performance.now() - game.startClock` 更新时间，避免上一帧时间误差。
- 报告 schema 为 `1.1.0`，事件包含 `inputMethod`，汇总包含 `inputMethodDistribution`。

## Audio and Visual State

- 本地音频位于 `assets/audio/`。`audio_manager.js` 已修复首次点击/按键后 BGM 不启动的问题；不要恢复会对当前 BGM 调用 `load()` 的旧逻辑。
- 右下角 `SOUND ON/OFF` 使用 `localStorage` 保存静音状态。
- 指挥头像和血压 ECG 为局部动画；不要增加遮挡谱面的全屏闪烁。
- 失败结算循环显示 `assets/pig.gif`，胜利不显示。

## Files Modified for Keyboard Work

- `main.js`：键位布局、键盘事件、键帽绑定、输入时间戳、输入来源。
- `style.css`：键帽和局部按键反馈。
- `report_generator.js`：`inputMethodDistribution`，schema `1.1.0`。
- 所有训练 HTML：`main.js`、`style.css`、`report_generator.js` 缓存版本更新为 `20260714-keyboard1`。
- `README.md`、`CONTEXT_SUMMARY.md`、`GOAL.md`：文档和进度。

## Verification Contract

1. `node --check main.js instrument_models.js vexflow_engine.js rhythm_validator.js report_generator.js audio_manager.js nav_transition.js`。
2. 检查所有模型按钮数量不超过键盘 profile 容量，且快捷键无重复。
3. 浏览器分别验证长号、上低音挑战、单簧管、中提琴、架子鼓的键盘输入。
4. 验证 `Enter` 解锁 BGM 并开始；`event.repeat` 不重复判定；结算后快捷键停止响应。
5. 验证 `inputMethodDistribution.keyboard` 和事件 `inputMethod`。
6. 检查本地资源无缺失、无新增远程运行时依赖、移动端无横向溢出。

## Release Rule

只在功能与浏览器验收完成后生成新的 `release/coze-zip-upload-*` 三包；每包必须小于 20MB。新包成功后删除旧 release 目录，避免误传和占空间。
