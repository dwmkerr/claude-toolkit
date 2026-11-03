"""Dev-only server for copy-editing an HTML page in the browser.

Usage: live_edit_server.py <page.html> [port] [queue-dir]

Serves the page's folder with live-edit.js injected into every HTML response,
and queues each edit to <queue-dir>/edits.jsonl for an agent to apply to the
source. The agent appends to applied.jsonl as it goes, so the page can show
how many edits are still waiting. Binds to localhost only, because the queue
drives edits to the working tree.
"""
import json
import os
import sys
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.path.abspath(sys.argv[1])
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8772
QUEUE = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else os.path.join(os.getcwd(), 'scratch', 'live-edit')
EDITS = os.path.join(QUEUE, 'edits.jsonl')
APPLIED = os.path.join(QUEUE, 'applied.jsonl')
API = '/api/dev/live-edit'


def count_lines(path):
    try:
        with open(path) as f:
            return sum(1 for line in f if line.strip())
    except FileNotFoundError:
        return 0


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve the page's folder so its relative assets resolve
        super().__init__(*args, directory=os.path.dirname(PAGE), **kwargs)

    def _send(self, status, body, ctype):
        data = body.encode() if isinstance(body, str) else body
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        path = self.path.split('?')[0]
        if path == '/__live-edit.js':
            with open(os.path.join(HERE, 'live-edit.js')) as f:
                return self._send(200, f.read(), 'text/javascript; charset=utf-8')
        if path == API:
            queued = max(0, count_lines(EDITS) - count_lines(APPLIED))
            return self._send(200, json.dumps({'queued': queued}), 'application/json')
        if path == '/':
            path = '/' + os.path.basename(PAGE)
        file = os.path.join(os.path.dirname(PAGE), path.lstrip('/'))
        if file.endswith('.html') and os.path.isfile(file):
            # Read on every request so applied edits show on reload
            with open(file) as f:
                page = f.read()
            page = page.replace('</body>', '<script src="/__live-edit.js"></script>\n</body>')
            return self._send(200, page, 'text/html; charset=utf-8')
        return super().do_GET()

    def do_POST(self):
        if self.path.split('?')[0] != API:
            return self._send(404, 'not found', 'text/plain')
        length = int(self.headers.get('Content-Length', 0))
        edit = json.loads(self.rfile.read(length) or b'{}')
        edit = {'ts': datetime.now(timezone.utc).isoformat(), **edit}
        os.makedirs(QUEUE, exist_ok=True)
        with open(EDITS, 'a') as f:
            f.write(json.dumps(edit, ensure_ascii=False) + '\n')
        return self._send(200, json.dumps({'ok': True}), 'application/json')

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    os.makedirs(QUEUE, exist_ok=True)
    print(f'live edit: http://127.0.0.1:{PORT}/{os.path.basename(PAGE)}', flush=True)
    print(f'queue: {EDITS}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
