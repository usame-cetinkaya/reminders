import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import path from "path";

// Resolve DB path consistently across dev/prod
const dbPath = path.resolve(
  process.cwd(),
  process.env.SQLITE_PATH || "./data/db.sqlite",
);

// Ensure folder exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Create SQLite instance
const sqlite = new Database(dbPath);

// Enable WAL for concurrency and reliability
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);
