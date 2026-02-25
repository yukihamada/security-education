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
      password_hash TEXT NOT NULL DEFAULT '',
      plan TEXT DEFAULT 'free',
      stripe_customer_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      plan TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      stripe_subscription_id TEXT,
      current_period_end TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS course_purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      course_slug TEXT NOT NULL,
      stripe_session_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, course_slug)
    );
  `);

  // Migrate: add missing columns to existing tables
  migrateDb();
}

function migrateDb() {
  // Check if users table has password_hash column
  const userColumns = db
    .prepare("PRAGMA table_info(users)")
    .all() as Array<{ name: string }>;
  const userColumnNames = userColumns.map((c) => c.name);

  if (!userColumnNames.includes("password_hash")) {
    db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''");
  }
  if (!userColumnNames.includes("stripe_customer_id")) {
    db.exec("ALTER TABLE users ADD COLUMN stripe_customer_id TEXT");
  }

  // Check if subscriptions table has user_id column
  const subColumns = db
    .prepare("PRAGMA table_info(subscriptions)")
    .all() as Array<{ name: string }>;
  const subColumnNames = subColumns.map((c) => c.name);

  if (!subColumnNames.includes("user_id")) {
    db.exec("ALTER TABLE subscriptions ADD COLUMN user_id TEXT NOT NULL DEFAULT ''");
  }
  if (!subColumnNames.includes("stripe_subscription_id")) {
    db.exec("ALTER TABLE subscriptions ADD COLUMN stripe_subscription_id TEXT");
  }
  if (!subColumnNames.includes("current_period_end")) {
    db.exec("ALTER TABLE subscriptions ADD COLUMN current_period_end TEXT");
  }
}

// --- User CRUD ---

export function createUser(
  id: string,
  email: string,
  passwordHash: string,
  name?: string
): Database.RunResult {
  const database = getDb();
  const stmt = database.prepare(
    "INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)"
  );
  return stmt.run(id, email, passwordHash, name || null);
}

export function getUserByEmail(email: string) {
  const database = getDb();
  const stmt = database.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email) as
    | {
        id: string;
        email: string;
        name: string | null;
        password_hash: string;
        plan: string;
        stripe_customer_id: string | null;
        created_at: string;
      }
    | undefined;
}

export function getUserById(id: string) {
  const database = getDb();
  const stmt = database.prepare("SELECT * FROM users WHERE id = ?");
  return stmt.get(id) as
    | {
        id: string;
        email: string;
        name: string | null;
        password_hash: string;
        plan: string;
        stripe_customer_id: string | null;
        created_at: string;
      }
    | undefined;
}

export function updateUserPlan(userId: string, plan: string) {
  const database = getDb();
  const stmt = database.prepare("UPDATE users SET plan = ? WHERE id = ?");
  return stmt.run(plan, userId);
}

export function updateUserStripeCustomer(
  userId: string,
  stripeCustomerId: string
) {
  const database = getDb();
  const stmt = database.prepare(
    "UPDATE users SET stripe_customer_id = ? WHERE id = ?"
  );
  return stmt.run(stripeCustomerId, userId);
}

// --- Subscription CRUD ---

export function createSubscription(
  userId: string,
  email: string,
  plan: string,
  stripeSubscriptionId?: string
): Database.RunResult {
  const database = getDb();
  const stmt = database.prepare(
    "INSERT INTO subscriptions (user_id, email, plan, stripe_subscription_id) VALUES (?, ?, ?, ?)"
  );
  return stmt.run(userId, email, plan, stripeSubscriptionId || null);
}

export function getSubscriptionByEmail(email: string) {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT * FROM subscriptions WHERE email = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
  );
  return stmt.get(email) as
    | {
        id: number;
        user_id: string;
        email: string;
        plan: string;
        status: string;
        stripe_subscription_id: string | null;
        created_at: string;
        updated_at: string;
      }
    | undefined;
}

export function getSubscriptionByUserId(userId: string) {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
  );
  return stmt.get(userId) as
    | {
        id: number;
        user_id: string;
        email: string;
        plan: string;
        status: string;
        stripe_subscription_id: string | null;
        created_at: string;
        updated_at: string;
      }
    | undefined;
}

export function upsertSubscription(
  userId: string,
  email: string,
  plan: string,
  stripeSubscriptionId?: string
) {
  const database = getDb();
  // Cancel any existing active subscriptions for this user
  database
    .prepare(
      "UPDATE subscriptions SET status = 'cancelled', updated_at = datetime('now') WHERE user_id = ? AND status = 'active'"
    )
    .run(userId);
  // Insert new active subscription
  const stmt = database.prepare(
    "INSERT INTO subscriptions (user_id, email, plan, stripe_subscription_id) VALUES (?, ?, ?, ?)"
  );
  return stmt.run(userId, email, plan, stripeSubscriptionId || null);
}

export function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT * FROM subscriptions WHERE stripe_subscription_id = ? ORDER BY created_at DESC LIMIT 1"
  );
  return stmt.get(stripeSubscriptionId) as
    | {
        id: number;
        user_id: string;
        email: string;
        plan: string;
        status: string;
        stripe_subscription_id: string | null;
        current_period_end: string | null;
        created_at: string;
        updated_at: string;
      }
    | undefined;
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

export function updateSubscriptionPeriodEnd(
  id: number,
  currentPeriodEnd: string
): Database.RunResult {
  const database = getDb();
  const stmt = database.prepare(
    "UPDATE subscriptions SET current_period_end = ?, updated_at = datetime('now') WHERE id = ?"
  );
  return stmt.run(currentPeriodEnd, id);
}

// --- Course Purchase CRUD ---

export function createCoursePurchase(
  userId: string,
  email: string,
  courseSlug: string,
  stripeSessionId?: string
) {
  const database = getDb();
  const stmt = database.prepare(
    "INSERT OR IGNORE INTO course_purchases (user_id, email, course_slug, stripe_session_id) VALUES (?, ?, ?, ?)"
  );
  return stmt.run(userId, email, courseSlug, stripeSessionId || null);
}

export function hasCoursePurchase(userId: string, courseSlug: string): boolean {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT 1 FROM course_purchases WHERE user_id = ? AND course_slug = ?"
  );
  return !!stmt.get(userId, courseSlug);
}

export function getCoursePurchasesByUser(userId: string) {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT * FROM course_purchases WHERE user_id = ?"
  );
  return stmt.all(userId) as Array<{
    id: number;
    user_id: string;
    email: string;
    course_slug: string;
    stripe_session_id: string | null;
    created_at: string;
  }>;
}
