# 发给扣子用于记录最新项目文件的提示词

请接收并保存我上传的最新项目文件，用这些文件覆盖你当前工作区里的旧版本。

这是一个纯静态多文件 H5 项目，我会在扣子 App 内手动点击部署到公网。你的任务是同步并记录最新文件，不要重写、重构、内联、删减或生成替代版本。

执行要求：

1. 保留我上传的完整目录结构。
2. 用我上传的新文件覆盖同名旧文件。
3. 不要只保留 `index.html`。
4. 不要把 CSS 或 JavaScript 内联进 HTML。
5. 不要删除 `assets/`。
6. 不要把 PLAYABLE 乐器卡片改成普通展示卡片。
7. 不需要 `npm install`，不需要构建，不需要后端服务。
8. 如果发现缺文件，只列出缺失文件名，不要自行补写替代代码。

请确认项目根目录至少包含：

- `index.html`
- `hub.css`
- `style.css`
- `main.js`
- `instrument_models.js`
- `vexflow_engine.js`
- `rhythm_validator.js`
- `report_generator.js`
- `trombone.html`
- `trumpet.html`
- `euphonium.html`
- `horn.html`
- `tuba.html`
- `flute.html`
- `piccolo.html`
- `saxophone.html`
- `soprano-saxophone.html`
- `bassoon.html`
- `violin.html`
- `cello.html`
- `double-bass.html`
- `percussion.html`
- `violin-g.html`
- `violin-d.html`
- `violin-a.html`
- `violin-e.html`
- `assets/`

当前版本关键点：

- 大厅标题是“乐团识谱训练大厅”。
- 大厅里“小提琴”只保留一个入口，链接到 `violin.html`。
- `violin.html` 页面内有 `G弦 / D弦 / A弦 / E弦` 选择按钮。
- 选择某根弦后，正式训练区只显示该弦的 4 个一把位指位按钮。
- 大厅里“大提琴”只保留一个入口，链接到 `cello.html`。
- `cello.html` 页面内有 `C弦 / G弦 / D弦 / A弦` 选择按钮。
- 大厅里“低音提琴 / 倍大提琴”只保留一个入口，链接到 `double-bass.html`。
- `double-bass.html` 页面内有 `E弦 / A弦 / D弦 / G弦` 选择按钮。
- 大厅里“架子鼓及其他打击乐”只保留一个入口，链接到 `percussion.html`。
- `percussion.html` 页面有 Kick/Snare/Hi-Hat/Tom/Crash 鼓件触发垫。
- 不要把小提琴重新拆成大厅里的 4 张卡片。

完成后只回复：

```text
已保存最新静态项目文件，可以在扣子 App 内手动部署公网。
```
