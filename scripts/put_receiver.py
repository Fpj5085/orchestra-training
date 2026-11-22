#!/usr/bin/env python3
"""C3 demo helper: PUT /<name> -> save file into docs/demo/ (demo evidence channel only)."""
import http.server, os

DEST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "demo")
os.makedirs(DEST, exist_ok=True)

class H(http.server.BaseHTTPRequestHandler):
    def do_PUT(self):
        name = os.path.basename(self.path)
        length = int(self.headers.get("Content-Length", 0))
        data = self.rfile.read(length)
        with open(os.path.join(DEST, name), "wb") as f:
            f.write(data)
        self.send_response(201)
        self.send_header("Content-Length", "2")
        self.end_headers()
        self.wfile.write(b"ok")
    def log_message(self, *a):
        pass

http.server.HTTPServer(("127.0.0.1", 8091), H).serve_forever()
