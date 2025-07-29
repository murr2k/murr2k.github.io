#!/usr/bin/env python3
"""
Preview the GitHub Pages site locally
"""

import http.server
import socketserver
import webbrowser
import os
import socket

def find_available_port(start_port=8000, max_attempts=20):
    """Find an available port starting from start_port"""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('', port))
                return port
            except OSError:
                continue
    raise RuntimeError(f"No available ports found in range {start_port}-{start_port + max_attempts}")

PORT = find_available_port(8000)

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"🌐 Server running at http://localhost:{PORT}/")
    print(f"✅ Selected port: {PORT}")
    print("Press Ctrl+C to stop the server")
    
    # Try to open browser
    try:
        webbrowser.open(f'http://localhost:{PORT}/')
    except:
        pass
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")