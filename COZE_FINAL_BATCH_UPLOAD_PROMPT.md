# 扣子部署提示词：乐团识谱训练大厅最新完整版本

请把我分批上传的多个 zip 压缩包解压并合并成一个完整的纯静态 H5 项目，并记录为最新版本。不要只部署 `index.html`，不要重写页面，不要内联 CSS，不要删除任何训练室、图片、GIF 或音频资源。

## 文件来源

我会上传多个压缩包，每个 zip 小于 20MB，文件名类似：

```text
coze-static-part01.zip
coze-static-part02.zip
coze-static-part03.zip
```

每个 zip 内部已经保留相对路径，例如：

```text
assets/pig.gif
assets/audio/bgm-hub.mp3
```

请把所有 zip 都解压到同一个项目根目录，并合并同名目录。最终项目根目录应该直接包含：

```text
index.html
trombone.html
...
hub.css
style.css
main.js
audio_manager.js
assets/
```

不要让最终网站路径变成 `coze-static-part01/index.html` 或 `part01/index.html`。这些 zip 只是上传批次，不是网站目录结构。

## 必须保留的核心文件

- 所有 `.html` 训练室页面
- `hub.css`
- `style.css`
- `main.js`
- `audio_manager.js`
- `nav_transition.js`
- `vexflow_engine.js`
- `rhythm_validator.js`
- `instrument_models.js`
- `report_generator.js`
- `assets/`
- `assets/audio/`
- `AUDIO_CREDITS.md`
- `.nojekyll`

## 运行方式

这是纯静态项目，无需 Node.js 后端、无需 npm install、无需代理、无需外部 CDN。

入口文件是：

```text
index.html
```

如果需要在扣子工作区启动预览服务，可以使用静态服务，例如：

```bash
python3 -m http.server "${DEPLOY_RUN_PORT:-5000}" --bind 0.0.0.0
```

如果扣子平台提供 native-static / static site 模板，请优先使用静态托管模板，让平台直接托管项目根目录。

## 部署后必须验证

1. 打开公网 URL，标题应为“乐团识谱训练大厅”。
2. 首页应显示所有乐器卡片，图片背景能加载，包括“单簧管”、“中提琴”和“上低音挑战”等新增卡片。
3. 点击“长号”进入 `trombone.html`，能看到 1-7 把位按钮。
4. 点击“单簧管”进入 `clarinet.html`，能看到 Boehm-system 基础指法按钮；点击“中提琴”进入 `viola.html`，能看到 C/G/D/A 弦选择与中音谱号。
5. 点击“上低音挑战”进入 `euphonium-challenge.html`，能看到更密集的低音谱号挑战谱面和上低音按键组合。
6. 点击“架子鼓及其他打击乐”进入 `percussion.html`，能看到 Kick/Snare/Hi-Hat/Tom/Crash 鼓垫。
7. 右下角应显示 `SOUND ON/OFF` 音频按钮。
8. 第一次点击页面后，BGM 和按钮音效会被浏览器解锁。
9. 所有训练按钮右上角应显示键盘快捷键；按 `Enter` 能开始，长号数字键、铜管/木管/弦乐/打击乐快捷键能触发对应按钮。
10. 失败结算时应显示放大的 `assets/pig.gif`。
11. 结算 JSON 应默认折叠在开发者诊断区，不要直接铺满页面，并包含 `inputMethodDistribution`。
12. 移动端宽度下不能有横向滚动。

## 音频授权提醒

项目包含 `assets/audio/` 本地音频资源。请不要删除。

`AUDIO_CREDITS.md` 中记录了来源和授权。Soundimage 音乐需要保留署名：

```text
Music by Eric Matyas, www.soundimage.org
```

## 如果出现问题

如果页面没样式、按钮不可用、图片/GIF/音频缺失，优先检查是否漏合并：

```text
assets/
assets/audio/
hub.css
style.css
main.js
audio_manager.js
instrument_models.js
vexflow_engine.js
rhythm_validator.js
report_generator.js
```

不要用新生成的单文件 HTML 替代原项目。这个项目必须按多文件静态站点部署。
