#!/usr/bin/env python3

import http.server
import socketserver
import webbrowser
import threading

PORT = 8000
URL = f"http://localhost:{PORT}"

def open_browser():
	webbrowser.open(URL)

if __name__ == "__main__":
	Handler = http.server.SimpleHTTPRequestHandler

	threading.Timer(1, open_browser).start()

	with socketserver.TCPServer(("", PORT), Handler) as httpd:
		print(f"Rodando o servidor na Porta {PORT}")

		try:
			httpd.serve_forever()
		except KeyboardInterrupt:
			print("\nServidor encerrado.")
			httpd.serve_close()