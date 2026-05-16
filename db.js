const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Use /tmp for Vercel, or project directory for local development
let dbPath;
if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  const tmpDir = process.env.VERCEL_TMP || "/tmp";
  dbPath = path.join(tmpDir, "discoverhealth.db");
} else {
  dbPath = path.resolve(__dirname, "discoverhealth.db");
}

const db = new Database(dbPath);

// Create tables if they do not exist
const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS healthcare_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      country TEXT,
      region TEXT,
      lat FLOAT,
      lon FLOAT,
      description TEXT,
      recommendations INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      isAdmin INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER,
      review TEXT,
      user_id INTEGER,
      FOREIGN KEY(resource_id) REFERENCES healthcare_resources(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
};

createTables();

module.exports = db;
