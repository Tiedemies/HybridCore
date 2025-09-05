import sqlite3
from pathlib import Path
import yaml

# Load config
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

DB_PATH = Path(config["database"]["sqlite_path"])
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS entry (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        timestamp TEXT,
        region TEXT,
        country TEXT,
        subregion TEXT,
        domain TEXT,
        space TEXT,
        layer TEXT,
        cascading_effect TEXT
    )
    """)
    conn.commit()
    conn.close()


def insert_entry(entry):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO entry (id, title, description, timestamp, region, country, subregion, domain, space, layer, cascading_effect)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        entry["id"],
        entry["title"],
        entry["description"],
        entry["timestamp"],
        entry.get("region"),
        entry.get("country"),
        entry.get("subregion"),
        entry.get("domain"),
        entry.get("space"),
        entry.get("layer"),
        str(entry.get("cascading_effect")),
    ))
    conn.commit()
    conn.close()


def get_entry(entry_id: str):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT * FROM entry WHERE id=?", (entry_id,))
    row = cur.fetchone()
    conn.close()
    return row
