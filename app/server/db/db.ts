import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_PATH = join(dirname(fileURLToPath(import.meta.url)), "schema.sql");
export const SCHEMA_VERSION = "2";

/** Opens (or creates) the study database, applies schema.sql idempotently and migrates older DBs. ':memory:' allowed. */
export function openDb(path: string): Database.Database {
  const inMemory = path === ":memory:" || path === "";
  if (!inMemory) mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  if (!inMemory) db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.exec(readFileSync(SCHEMA_PATH, "utf8"));
  migrate(db);
  return db;
}

/** v1 -> v2: sessions.participant_hash + sessions.last_activity_at and the unique partial index. Idempotent. */
function migrate(db: Database.Database): void {
  db.transaction(() => {
    const cols = new Set((db.prepare("PRAGMA table_info(sessions)").all() as { name: string }[]).map((c) => c.name));
    if (!cols.has("participant_hash")) db.exec("ALTER TABLE sessions ADD COLUMN participant_hash TEXT");
    if (!cols.has("last_activity_at")) {
      db.exec("ALTER TABLE sessions ADD COLUMN last_activity_at TEXT");
      // Best guess for pre-existing rows: last saved trial, else completion, consent or start time.
      db.exec(`UPDATE sessions SET last_activity_at = COALESCE(
        (SELECT MAX(t.saved_at) FROM trials t WHERE t.session_id = sessions.session_id),
        completed_at, consent_at, started_at)`);
    }
    db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_participant_hash
      ON sessions(participant_hash) WHERE participant_hash IS NOT NULL`);
    db.prepare("INSERT INTO meta (key, value) VALUES ('schema_version', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
      .run(SCHEMA_VERSION);
  })();
}
