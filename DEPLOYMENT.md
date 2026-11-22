# 让任何人都能打开的网址

这个游戏是纯静态网站，只要把整个目录发布到静态托管平台，就会得到一个公网 URL。不要上传单个 `index.html`，要上传整个 `K:\KOUzi` 目录里的交付文件。

## 最快方案：Cloudflare Pages 直接上传

适合你只想马上发一个链接给别人试玩。

1. 打开 Cloudflare Dashboard，进入 Pages。
2. 选择创建项目，使用 Direct Upload 或 Upload assets。
3. 把本项目目录压缩成 zip，或直接上传这些文件：
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
   - `vexflow_engine.js`
   - `rhythm_validator.js`
   - `instrument_models.js`
   - `report_generator.js`
   - `assets/`
4. 部署完成后会得到类似下面的网址：

```text
https://your-project.pages.dev
```

把这个网址发给别人，对方就可以在浏览器里打开玩。

官方说明：[Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) 支持从本地上传预构建静态资源；Cloudflare Pages 也支持直接部署静态 HTML 站点。

## 通用方案：GitHub Pages

适合后续继续迭代、让代码和网址绑定。

1. 新建一个 GitHub 仓库，例如 `rehearsal-bomb-expert`。
2. 上传整个项目目录内容。
3. 进入仓库 Settings -> Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待构建完成。
7. 网址通常是：

```text
https://你的用户名.github.io/rehearsal-bomb-expert/
```

如果仓库名是 `你的用户名.github.io`，网址会是：

```text
https://你的用户名.github.io/
```

官方说明：[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) 可以直接托管仓库里的 HTML、CSS 和 JavaScript 静态文件；发布源可以选择仓库根目录 `/`，见 [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 国内分享优先：Gitee Pages

适合优先考虑国内访问稳定性。

1. 新建 Gitee 仓库。
2. 上传整个项目目录内容。
3. 在仓库服务里开启 Gitee Pages。
4. 部署分支选 `master` 或 `main`，目录选根目录。
5. 启动后会得到 Gitee Pages 提供的网址。

## 发布前检查

- 打开公开 URL 后确认不是 404。
- 确认大厅里的“长号”、“小号”、“次中音号 / 上低音号”、“上低音挑战”、“圆号”、“大号”、“长笛”、“短笛”、“萨克斯”、“高音萨克斯”、“单簧管”、“大管”、“小提琴”、“中提琴”、“大提琴”、“低音提琴 / 倍大提琴”和“架子鼓及其他打击乐”都能打开。
- 确认长号底部 1-7 把位按钮，小号、次中音号 / 上低音号、圆号、大号底部按键组合按钮，长笛、短笛、萨克斯、高音萨克斯、单簧管、大管、小提琴、中提琴、大提琴、低音提琴页内选弦/单弦指位按钮，以及架子鼓鼓件触发垫可以点击。
- 用键盘按 `Enter` 开始，再分别验证长号数字键、铜管 `A-S-D-F-G-H-J`、木管 `QWER/ASDF/ZXCV`、弦乐 `1-4` 选弦与 `A-S-D-F` 指位、打击乐 `A-S-D-F-G`。
- 确认 `assets/bg-rehearsal.jpg` 和指挥图片如果存在，路径大小写完全一致。
- 用手机打开一次，确认没有横向滚动。
- 如果换了图片，仍然不要加入外链 CDN；图片文件直接放进 `assets/`。
