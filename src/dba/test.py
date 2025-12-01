import json
from websockets.sync.client import connect

with connect("ws://localhost:8765") as ws:
    for req in [
        {"op":"user.mod","uid":"u3","pwh":"789","name":"bob"},
        {"op":"user.query","uid":"u3"},
        {"op":"emoji.insert","uid":"u3","emoji":"1"},
        {"op":"emoji.query","uid":"u3"},
    ]:
        ws.send(json.dumps(req))
        print(json.loads(ws.recv()))
