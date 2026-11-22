#!/usr/bin/env python3
"""C-GH1: append GitHub release handoff chapter to staging HANDOFF.md + write SHA256SUMS.txt."""
import hashlib, os

root = r"K:/Fpj Project/C-orchestra-release"
lines = [
"\n## GitHub 发布（C-GH1）",
"",
"- 白名单核对：源开发仓 3229 文件 / 653.7MB -> 暂存仓 340 文件 / 77.3MB；已排除 project/（189MB 内部项目）、.agents/（25MB 素材工作区）、c2-verify.log；保留 H5 全部页面与资源、backend/、合格 docs（CODE_GUIDE + demo 证据）、backend/docker-compose.yml。",
"- LICENSE：MIT（仅代码）；素材三类署名（Soundimage BGM 署名必备、Kenney CC0、AI 生成图）见 README 与 AUDIO_CREDITS.md。",
"- JWT：APP_JWT_SECRET 环境变量化（compose 透传 ORC_JWT_SECRET，默认值仅本地演示）；演示账号 teacher01/student01 仅本地演示用。",
"- CI：.github/workflows/ci.yml —— GitHub Actions 零密钥方案（services postgres:17-alpine @55434 + temurin 21 + mvn test），推送后生效。",
"- Topics 建议：spring-boot / jwt / jsonb / postgresql / h5-game / flyway / sight-reading / education-game。",
"- SHA256 清单：SHA256SUMS.txt（本仓全部跟踪文件，构建产物 target/ 与 .git 除外）。",
""]
with open(os.path.join(root, "HANDOFF.md"), "a", encoding="utf-8") as f:
    f.write("\n".join(lines))

import subprocess
files = subprocess.run(["git", "ls-files"], cwd=root, capture_output=True, text=True).stdout.split()
hashes = []
for p in files:
    fp = os.path.join(root, p.replace("/", os.sep))
    if os.path.isfile(fp):
        h = hashlib.sha256(open(fp, "rb").read()).hexdigest()
        hashes.append(h + "  " + p)
with open(os.path.join(root, "SHA256SUMS.txt"), "w", newline="\n") as f:
    f.write("\n".join(hashes) + "\n")
print("tracked files:", len(files), "hashed:", len(hashes))
