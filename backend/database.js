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

// Export database so server.js can use it
module.exports = db;