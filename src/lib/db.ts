import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "education.db");

let db: Database.Database;

export function getDb() {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initDb();
  }
  return db;
}

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      plan TEXT DEFAULT 'free',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      plan TEXT NOT NULL CHECK(plan IN ('free', 'premium', 'enterprise')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'expired', 'past_due')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function createSubscription(
  email: string,
  plan: string
): Database.RunResult {
  const database = getDb();
  const stmt = database.prepare(
    "INSERT INTO subscriptions (email, plan) VALUES (?, ?)"
  );
  return stmt.run(email, plan);
}

export function getSubscriptionByEmail(email: string) {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT * FROM subscriptions WHERE email = ? ORDER BY created_at DESC LIMIT 1"
  );
  return stmt.get(email);
}

export function updateSubscriptionStatus(
  id: number,
  status: string
): Database.RunResult {
  const database = getDb();
  const stmt = database.prepare(
    "UPDATE subscriptions SET status = ?, updated_at = datetime('now') WHERE id = ?"
  );
  return stmt.run(status, id);
}
