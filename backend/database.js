// Import SQLite
const sqlite3 = require("sqlite3").verbose();

// Create/connect to database file
const db = new sqlite3.Database("./crown.db");

/*
|--------------------------------------------------------------------------
| BOOKINGS TABLE
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| PERFORMER APPLICATIONS TABLE
|--------------------------------------------------------------------------
*/
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

// Adds status column to older performer tables if missing
db.run(
  `
  ALTER TABLE performer_applications
  ADD COLUMN status TEXT DEFAULT 'Pending'
`,
  (err) => {
    if (err && !err.message.includes("duplicate column name")) {
      console.error(err.message);
    }
  }
);

/*
|--------------------------------------------------------------------------
| EVENTS TABLE
|--------------------------------------------------------------------------
*/
db.run(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    description TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

/*
|--------------------------------------------------------------------------
| CONTACT MESSAGES TABLE
|--------------------------------------------------------------------------
*/
db.run(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;