#!/usr/bin/env python3
import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'medicare.db')
conn = sqlite3.connect(DB_PATH)

conn.execute("""
CREATE TABLE IF NOT EXISTS procedure_comparisons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    proc_a_slug TEXT NOT NULL,
    proc_b_slug TEXT NOT NULL
)
""")

procs = conn.execute("SELECT slug FROM procedures ORDER BY national_avg_cost DESC").fetchall()
slugs = [r[0] for r in procs]

batch = []
for i in range(len(slugs)):
    for j in range(i+1, len(slugs)):
        a, b = sorted([slugs[i], slugs[j]])
        slug = f"{a}-vs-{b}"
        batch.append((slug, a, b))

conn.executemany(
    "INSERT OR IGNORE INTO procedure_comparisons (slug, proc_a_slug, proc_b_slug) VALUES (?,?,?)",
    batch
)
conn.commit()
count = conn.execute("SELECT COUNT(*) FROM procedure_comparisons").fetchone()[0]
print(f"✅ procedure_comparisons: {count:,} rows")
conn.close()
