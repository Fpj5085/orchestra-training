#!/usr/bin/env python3
"""C2: 向训练室 HTML 页面追加 report_sync.js 引用（幂等）。"""
import glob, os

pages = ["trombone", "trumpet", "euphonium", "euphonium-challenge", "horn", "tuba",
         "flute", "piccolo", "saxophone", "soprano-saxophone", "clarinet", "bassoon",
         "violin", "viola", "cello", "double-bass", "percussion"]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for name in pages:
    path = os.path.join(root, name + ".html")
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    if "report_sync.js" in html:
        print("skip", name)
        continue
    tag = '  <script src="report_sync.js"></script>\n'
    idx = html.rfind("</body>")
    html = html[:idx] + tag + html[idx:]
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(html)
    print("patched", name)
