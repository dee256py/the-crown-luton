// Import packages
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

// Create/connect to database file
const db = new sqlite3.Database("./crown.db");

db.serialize(() => {
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

  /*
  |--------------------------------------------------------------------------
  | ADMIN USERS TABLE
  |--------------------------------------------------------------------------
  */
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create one default admin account if none exists
  db.get("SELECT COUNT(*) AS count FROM admin_users", [], (err, row) => {
    if (err) {
      console.error("Could not check admin users:", err.message);
      return;
    }

    if (row.count === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@castle.local";
      const adminPassword = process.env.ADMIN_PASSWORD || "CastleAdmin123!";
      const passwordHash = bcrypt.hashSync(adminPassword, 10);

      db.run(
        "INSERT INTO admin_users (email, passwordHash) VALUES (?, ?)",
        [adminEmail, passwordHash],
        (insertErr) => {
          if (insertErr) {
            console.error("Could not create admin user:", insertErr.message);
          } else {
            console.log("Default admin user created.");
          }
        }
      );
    }
  });
});

module.exports = db;