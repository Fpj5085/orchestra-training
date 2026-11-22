# 发给扣子 Coding Agent 的部署提示词

请不要只下载或部署 `index.html`。这是一个完整的纯静态 H5 项目，必须保留所有文件和目录结构。

我已经上传的是一个轻量 zip 压缩包，文件名类似：

```text
orchestra-game-coze-lite-*.zip
```

这个包已经把图片压缩到适合网页发布的大小，单文件远小于 20MB。请按下面步骤部署：

1. 下载我上传的 zip 文件。
2. 解压 zip。
3. 把解压后的所有文件复制到 `${COZE_WORKSPACE_PATH}` 或 `/workspace/projects` 的静态项目根目录。
4. 不要重写 `index.html`，不要把 CSS 内联，不要删除训练室页面，不要删除 `assets/`。
5. 确认项目根目录至少包含：
   - `index.html`
   - `trombone.html`
   - `trumpet.html`
   - `euphonium.html`
   - `euphonium-challenge.html`
   - `horn.html`
   - `tuba.html`
   - `flute.html`
   - `piccolo.html`
   - `saxophone.html`
   - `soprano-saxophone.html`
   - `clarinet.html`
   - `bassoon.html`
   - `violin.html`
   - `viola.html`
   - `cello.html`
   - `double-bass.html`
   - `percussion.html`
   - `violin-g.html`
   - `violin-d.html`
   - `violin-a.html`
   - `violin-e.html`
   - `hub.css`
   - `style.css`
   - `main.js`
   - `audio_manager.js`
   - `vexflow_engine.js`
   - `rhythm_validator.js`
   - `instrument_models.js`
   - `report_generator.js`
   - `assets/`
   - `AUDIO_CREDITS.md`
6. 使用 `coze init ${COZE_WORKSPACE_PATH} --template native-static` 初始化静态项目。
7. 如果模板生成了默认文件，请用解压后的项目文件覆盖默认文件。
8. 启动静态服务，入口必须是项目根目录的 `index.html`。
9. 部署后验证：
   - 打开公网 URL 后标题应为“乐团识谱训练大厅”。
   - 首页应显示乐器卡片，并且每张卡片有图片背景。
   - 点击“长号”卡片应进入 `trombone.html`。
   - 点击“小号”卡片应进入 `trumpet.html`。
   - 点击“次中音号 / 上低音号”卡片应进入 `euphonium.html`。
   - 点击“上低音挑战”卡片应进入 `euphonium-challenge.html`。
   - 点击“圆号”卡片应进入 `horn.html`。
   - 点击“大号”卡片应进入 `tuba.html`。
   - 点击“长笛”卡片应进入 `flute.html`。
   - 点击“短笛”卡片应进入 `piccolo.html`。
   - 点击“萨克斯”卡片应进入 `saxophone.html`。
   - 点击“高音萨克斯”卡片应进入 `soprano-saxophone.html`。
   - 点击“单簧管”卡片应进入 `clarinet.html`。
   - 点击“大管”卡片应进入 `bassoon.html`。
   - 点击“小提琴”卡片应进入 `violin.html`。
   - 点击“中提琴”卡片应进入 `viola.html`。
   - 点击“大提琴”卡片应进入 `cello.html`。
   - 点击“低音提琴 / 倍大提琴”卡片应进入 `double-bass.html`。
   - 点击“架子鼓及其他打击乐”卡片应进入 `percussion.html`。
   - 长号页面应显示 1-7 把位按钮和低音谱号。
   - 小号页面应显示开放/1/2/1+2 等按键组合和高音谱号。
   - 次中音号 / 上低音号页面应显示开放/1/2/1+2 等按键组合和低音谱号。
   - 上低音挑战页面应显示开放/1/2/1+2 等按键组合、低音谱号和更密集的挑战谱面。
   - 圆号页面应显示开放/1/2/1+2 等按键组合和高音谱号。
   - 大号页面应显示开放/1/2/1+2 等按键组合和低音谱号。
   - 长笛页面应显示 T/左手/右手键位指法组合和高音谱号。
   - 短笛页面应显示 T/左手/右手键位指法组合和高音谱号。
   - 萨克斯页面应显示左右手键位和八度键指法组合以及高音谱号。
   - 高音萨克斯页面应显示左右手键位和八度键指法组合以及高音谱号。
   - 单簧管页面应显示 Boehm-system 基础指法组合和高音谱号。
   - 大管页面应显示 Heckel-system 基础指法组合和低音谱号。
   - 小提琴页面应显示 G/D/A/E 弦选择按钮；选择某一根弦后，应显示该弦的一把位指位按钮和高音谱号。
   - 中提琴页面应显示 C/G/D/A 弦选择按钮；选择某一根弦后，应显示该弦的一把位指位按钮和中音谱号。
   - 大提琴页面应显示 C/G/D/A 弦选择按钮；选择某一根弦后，应显示该弦的一把位指位按钮和低音谱号。
   - 低音提琴页面应显示 E/A/D/G 弦选择按钮；选择某一根弦后，应显示该弦的半把位指位按钮和低音谱号。
   - 架子鼓页面应显示 Kick/Snare/Hi-Hat/Tom/Crash 鼓件触发垫和打击乐谱表。
   - 不应把可玩卡片改成普通展示卡片。
- 不应删除图片资源。
- 不应删除 `assets/audio/`，否则背景音乐与交互音效会缺失。
- 右下角 `SOUND ON/OFF` 按钮应可见；第一次用户点击后音频会解锁并播放当前页面 BGM。
- 所有训练按钮右上角应显示键盘快捷键；`Enter` 应能开始训练，键盘输入与点击应共用同一判定逻辑。

如果部署后图片、音频或训练室打不开，请检查是否漏传 `assets/`、`assets/audio/`、`trombone.html`、`trumpet.html`、`euphonium.html`、`euphonium-challenge.html`、`horn.html`、`tuba.html`、`flute.html`、`piccolo.html`、`saxophone.html`、`soprano-saxophone.html`、`clarinet.html`、`bassoon.html`、`violin.html`、`viola.html`、`cello.html`、`double-bass.html`、`percussion.html`、`violin-g.html`、`violin-d.html`、`violin-a.html`、`violin-e.html`、`hub.css`、`style.css` 或 JS 文件。

如果你的环境无法解压 zip，请让我重新上传解压后的 `orchestra-game-coze-lite-*` 文件夹内容，并确保所有文件都上传，不要只拿 `index.html`。
