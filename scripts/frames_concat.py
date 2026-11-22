#!/usr/bin/env python3
"""C5: merge timestamped frames into c5-loop.mp4 (concat demuxer)."""
import json, subprocess, sys, os

timeline = json.load(open(sys.argv[1], encoding="utf-8"))
demo = r"K:/Fpj Project/C-orchestra-training/docs/demo"
lines = []
for i, fr in enumerate(timeline):
    dur = fr["t"] - timeline[i-1]["t"] if i else 2.0
    dur = min(max(dur, 0.8), 8.0)
    lines.append("file '" + os.path.basename(fr["f"]) + "'")
    lines.append("duration %.2f" % dur)
if timeline:
    lines.append("file '" + os.path.basename(timeline[-1]["f"]) + "'")
lst = os.path.join(demo, "_concat.txt")
open(lst, "w").write("\n".join(lines))
out = os.path.join(demo, "c5-loop.mp4")
subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                "-vf", "scale=1280:-2", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "10", out], check=True)
print("done", out)
