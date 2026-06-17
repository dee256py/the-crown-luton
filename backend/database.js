// Import SQLite
const sqlite3 = require("sqlite3").verbose();

// Create/connect to database file
const db = new sqlite3.Database("./crown.db");

// Create bookings table if it does not exist
db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    eventType TEXT NOT NULL,
    eventDate TEXT NOT NULL,
    guestCount INTEGER NOT NULL,
    notes TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS performer_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stageName TEXT NOT NULL,
    realName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    genre TEXT NOT NULL,
    socialLink TEXT,
    preferredDate TEXT,
    equipmentNeeds TEXT,
    bio TEXT,
    status TEXT DEFAULT 'Pending',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  ALTER TABLE performer_applications
  ADD COLUMN status TEXT DEFAULT 'Pending'
`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message);
  }
});

// Export database so server.js can use it
module.exports = db;