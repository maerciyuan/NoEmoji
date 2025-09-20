import json

import mysql.connector
import redis
from websockets.sync.server import serve, ServerConnection

# MySQL (Users)
db_conn = mysql.connector.connect(
    host="localhost",
    # TODO: Other MySQL settings
)

# Redis (Tokens Invalidation)
r_conn = redis.Redis(
    host="localhost",
    # TODO: Other Redis settings
)


def handler(ws: ServerConnection):
    for message in ws:
        req = json.loads(message)
        match req.op:
            case "user.mod":
                pass
            case "user.query":
                # TODO: Replace with actual implementation
                ws.send(json.dumps({
                    "uid": "13579"
                }))
            case "user.validate":
                # TODO: Replace with actual implementation
                ws.send(json.dumps(False))


def main():
    with serve(handler, "localhost", 8765) as server:
        server.serve_forever()


if __name__ == "__main__":
    main()
