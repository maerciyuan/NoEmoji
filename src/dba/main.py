import json
import time
import uuid
from datetime import datetime, timedelta, timezone

import jwt
import mysql.connector
import redis
import secrets
from mysql.connector import errorcode
from websockets.sync.server import serve, ServerConnection

# ========== 配置 ==========
MYSQL_CFG = dict(
    host="localhost",
    port=3306,
    user="root",
    password="password",
    database="app_db",
    autocommit=True,
)
REDIS_CFG = dict(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True,
)
JWT_SECRET = secrets.token_urlsafe(32)
JWT_TTL = timedelta(days=7)
# ==========================

# ---------- 连接池 ----------
db = mysql.connector.connect(**MYSQL_CFG)
rdb = redis.Redis(**REDIS_CFG)

# ---------- 建表 ----------
def init_schema():
    cur = db.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users(
        uid     VARCHAR(64) PRIMARY KEY,
        pwh     CHAR(64)     NOT NULL,
        name    VARCHAR(64)  NOT NULL,
        tel     VARCHAR(32),
        email   VARCHAR(128),
        super   BOOLEAN      DEFAULT FALSE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS emojis(
        id      BIGINT AUTO_INCREMENT PRIMARY KEY,
        uid     VARCHAR(64) NOT NULL,
        emoji   INT         NOT NULL,
        time    BIGINT      NOT NULL,
        INDEX(uid),
        FOREIGN KEY(uid) REFERENCES users(uid)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)
    cur.close()
init_schema()

# ---------- 工具 ----------
def now_ts() -> int:
    return int(time.time())

def jwt_encode(uid: str) -> str:
    exp = datetime.now(tz=timezone.utc) + JWT_TTL
    jti = str(uuid.uuid4())
    return jwt.encode(
        {"uid": uid, "jti": jti, "exp": exp},
        JWT_SECRET,
        algorithm="HS256",
    )

def jwt_decode(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        # 是否黑名单
        if rdb.exists(f"invalid:{payload['jti']}"):
            return None
        return payload
    except Exception:
        return None

# ---------- 业务 ----------
def do_user_mod(req: dict) -> bool:
    uid = req.get("uid") or str(uuid.uuid4())
    pwh = req.get("pwh")
    name = req.get("name")
    tel = req.get("tel")
    email = req.get("email")
    super_ = req.get("super", False)

    cur = db.cursor(dictionary=True)
    cur.execute("SELECT pwh FROM users WHERE uid=%s", (uid,))
    old = cur.fetchone()

    if old:  # 更新
        new_pwh = pwh if pwh is not None else old["pwh"]
        sql = """
        UPDATE users
        SET pwh=COALESCE(%s,pwh),
            name=COALESCE(%s,name),
            tel=COALESCE(%s,tel),
            email=COALESCE(%s,email),
            super=COALESCE(%s,super)
        WHERE uid=%s
        """
        cur.execute(sql, (pwh, name, tel, email, super_, uid))
        # 密码变了 -> 注销全部 token
        if pwh is not None and pwh != old["pwh"]:
            rdb.delete(f"invalid:{uid}")  # 简单起见，这里不逐个 jti，直接删前缀
    else:  # 插入
        if pwh is None or name is None:
            raise ValueError("pwh and name required for new user")
        cur.execute(
            "INSERT INTO users(uid,pwh,name,tel,email,super) VALUES(%s,%s,%s,%s,%s,%s)",
            (uid, pwh, name, tel, email, super_),
        )
    cur.close()
    return True

def do_user_query(req: dict):
    uid = req.get("uid")
    cur = db.cursor(dictionary=True)
    if uid:
        cur.execute("SELECT uid,name,tel,email,super FROM users WHERE uid=%s", (uid,))
        row = cur.fetchone()
        cur.close()
        return row or None
    else:
        cur.execute("SELECT uid,name,tel,email,super FROM users")
        rows = cur.fetchall()
        cur.close()
        return rows

def do_user_validate(req: dict):
    uid = req.get("uid")
    token = req.get("token")
    if not uid or not token:
        return False
    payload = jwt_decode(token)
    return payload is not None and payload["uid"] == uid

def do_user_rmtoken(req: dict):
    token = req.get("token")
    payload = jwt_decode(token)
    if payload:
        exp_ts = int(payload["exp"])
        ttl = exp_ts - now_ts()
        if ttl > 0:
            rdb.setex(f"invalid:{payload['jti']}", ttl, 1)
    return None

def do_emoji_insert(req: dict):
    uid = req.get("uid")
    emoji = req.get("emoji")
    if uid is None or emoji is None:
        return None
    cur = db.cursor()
    cur.execute("SELECT 1 FROM users WHERE uid=%s", (uid,))
    if cur.fetchone():
        cur.execute(
            "INSERT INTO emojis(uid,emoji,time) VALUES(%s,%s,%s)",
            (uid, emoji, now_ts()),
        )
    cur.close()
    return None

def do_emoji_query(req: dict):
    uid = req.get("uid")
    cur = db.cursor(dictionary=True)
    if uid:
        cur.execute("SELECT emoji,time FROM emojis WHERE uid=%s ORDER BY time", (uid,))
    else:
        cur.execute("SELECT emoji,time,uid FROM emojis ORDER BY time")
    rows = cur.fetchall()
    cur.close()
    return rows or []

# ---------- 路由 ----------
OP_HANDLERS = {
    "user.mod":      do_user_mod,
    "user.query":    do_user_query,
    "user.validate": do_user_validate,
    "user.rmtoken":  do_user_rmtoken,
    "emoji.insert":  do_emoji_insert,
    "emoji.query":   do_emoji_query,
}

def handler(ws: ServerConnection):
    for message in ws:
        try:
            req = json.loads(message)
            op = req.get("op")
            if op not in OP_HANDLERS:
                raise ValueError(f"unknown op: {op}")
            res = OP_HANDLERS[op](req)
            ws.send(json.dumps(res if res is not None else True))
        except Exception as e:
            ws.send(json.dumps({"error": str(e)}))

def main():
    with serve(handler, "localhost", 8765) as server:
        server.serve_forever()

if __name__ == "__main__":
    main()
