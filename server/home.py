import sys
from gevent.pywsgi import WSGIServer
from app import app

if __name__ == "__main__":
    print("服务器启动!!!!!")
    server = WSGIServer(("localhost",5050),app)
    server.serve_forever()