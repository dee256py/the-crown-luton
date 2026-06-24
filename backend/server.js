require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./database");
const authenticateAdmin = require("./authMiddleware");

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

function csvEscape(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return `"${String(value).replace(/"/g, '""')}"`;
}

function sendCSV(res, filename, rows, fields) {
  const header = fields.join(",");

  const body = rows
    .map((row) => fields.map((field) => csvEscape(row[field])).join(","))
    .join("\n");

  const csv = `${header}\n${body}`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
}

/*
|--------------------------------------------------------------------------
| HOME ROUTE
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.send("Welcome to The Castle Live API");
});

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required."
    });
  }

  db.get("SELECT * FROM admin_users WHERE email = ?", [email], (err, admin) => {
    if (err) {
      return res.status(500).json({
        error: "Login failed."
      });
    }

    if (!admin) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    const passwordMatches = bcrypt.compareSync(password, admin.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin"
      },
      process.env.JWT_SECRET || "development-secret",
      {
        expiresIn: "8h"
      }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        email: admin.email
      }
    });
  });
});

app.get("/auth/me", authenticateAdmin, (req, res) => {
  res.json({
    admin: req.admin
  });
});

/*
|--------------------------------------------------------------------------
| PUBLIC EVENT ROUTES
|--------------------------------------------------------------------------
*/
app.get("/events", (req, res) => {
  const sql = `
    SELECT *
    FROM events
    WHERE isPublished = 1
    ORDER BY isFeatured DESC, id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Events could not be loaded"
      });
    }

    res.json(rows);
  });
});

app.get("/events/:id", (req, res) => {
  const eventId = req.params.id;

  const sql = `
    SELECT *
    FROM events
    WHERE id = ? AND isPublished = 1
  `;

  db.get(sql, [eventId], (err, event) => {
    if (err) {
      return res.status(500).json({
        error: "Event could not be loaded"
      });
    }

    if (!event) {
      return res.status(404).json({
        error: "Event not found"
      });
    }

    res.json(event);
  });
});

/*
|--------------------------------------------------------------------------
| ADMIN EVENT ROUTES
|--------------------------------------------------------------------------
*/
app.get("/admin/events", authenticateAdmin, (req, res) => {
  db.all("SELECT * FROM events ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Admin events could not be loaded"
      });
    }

    res.json(rows);
  });
});

app.post("/events", authenticateAdmin, (req, res) => {
  const {
    name,
    day,
    time,
    description,
    category,
    capacity,
    isFeatured,
    isPublished
  } = req.body;

  const sql = `
    INSERT INTO events
    (name, day, time, description, category, capacity, isFeatured, isPublished)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      name,
      day,
      time,
      description,
      category || "Live Music",
      Number(capacity) || 0,
      isFeatured ? 1 : 0,
      isPublished ? 1 : 0
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Event could not be created"
        });
      }

      res.status(201).json({
        message: "Event created successfully",
        eventId: this.lastID
      });
    }
  );
});

app.put("/events/:id", authenticateAdmin, (req, res) => {
  const eventId = req.params.id;

  const {
    name,
    day,
    time,
    description,
    category,
    capacity,
    isFeatured,
    isPublished
  } = req.body;

  const sql = `
    UPDATE events
    SET name = ?,
        day = ?,
        time = ?,
        description = ?,
        category = ?,
        capacity = ?,
        isFeatured = ?,
        isPublished = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      name,
      day,
      time,
      description,
      category || "Live Music",
      Number(capacity) || 0,
      isFeatured ? 1 : 0,
      isPublished ? 1 : 0,
      eventId
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Event could not be updated"
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Event not found"
        });
      }

      res.json({
        message: "Event updated successfully",
        updatedEventId: eventId
      });
    }
  );
});

app.delete("/events/:id", authenticateAdmin, (req, res) => {
  const eventId = req.params.id;

  db.run("DELETE FROM events WHERE id = ?", [eventId], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Event could not be deleted"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Event not found"
      });
    }

    res.json({
      message: "Event deleted successfully",
      deletedEventId: eventId
    });
  });
});

/*
|--------------------------------------------------------------------------
| BOOKING ROUTES
|--------------------------------------------------------------------------
*/
app.post("/bookings", (req, res) => {
  const { name, email, phone, eventType, eventDate, guestCount, notes } =
    req.body;

  const sql = `
    INSERT INTO bookings
    (name, email, phone, eventType, eventDate, guestCount, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.run(
    sql,
    [name, email, phone, eventType, eventDate, guestCount, notes],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Booking could not be saved"
        });
      }

      res.status(201).json({
        message: "Booking saved successfully",
        bookingId: this.lastID
      });
    }
  );
});

app.get("/bookings", authenticateAdmin, (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Bookings could not be loaded"
      });
    }

    res.json(rows);
  });
});

app.put("/bookings/:id", authenticateAdmin, (req, res) => {
  const bookingId = req.params.id;

  const {
    name,
    email,
    phone,
    eventType,
    eventDate,
    guestCount,
    notes,
    status,
    adminNotes
  } = req.body;

  const sql = `
    UPDATE bookings
    SET name = ?,
        email = ?,
        phone = ?,
        eventType = ?,
        eventDate = ?,
        guestCount = ?,
        notes = ?,
        status = ?,
        adminNotes = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      name,
      email,
      phone,
      eventType,
      eventDate,
      guestCount,
      notes,
      status || "Pending",
      adminNotes,
      bookingId
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Booking could not be updated"
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Booking not found"
        });
      }

      res.json({
        message: "Booking updated successfully",
        updatedBookingId: bookingId
      });
    }
  );
});

app.put("/bookings/:id/status", authenticateAdmin, (req, res) => {
  const bookingId = req.params.id;
  const { status, adminNotes } = req.body;

  const sql = `
    UPDATE bookings
    SET status = ?,
        adminNotes = ?
    WHERE id = ?
  `;

  db.run(sql, [status, adminNotes, bookingId], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Booking status could not be updated"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    res.json({
      message: "Booking status updated successfully",
      bookingId,
      status
    });
  });
});

app.delete("/bookings/:id", authenticateAdmin, (req, res) => {
  const bookingId = req.params.id;

  db.run("DELETE FROM bookings WHERE id = ?", [bookingId], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Booking could not be deleted"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    res.json({
      message: "Booking deleted successfully",
      deletedBookingId: bookingId
    });
  });
});

/*
|--------------------------------------------------------------------------
| PERFORMER ROUTES
|--------------------------------------------------------------------------
*/
app.post("/performers", (req, res) => {
  const {
    stageName,
    realName,
    email,
    phone,
    genre,
    socialLink,
    preferredDate,
    equipmentNeeds,
    bio
  } = req.body;

  const sql = `
    INSERT INTO performer_applications
    (stageName, realName, email, phone, genre, socialLink, preferredDate, equipmentNeeds, bio, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.run(
    sql,
    [
      stageName,
      realName,
      email,
      phone,
      genre,
      socialLink,
      preferredDate,
      equipmentNeeds,
      bio
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Performer application could not be saved"
        });
      }

      res.status(201).json({
        message: "Performer application saved successfully",
        performerId: this.lastID
      });
    }
  );
});

app.get("/performers", authenticateAdmin, (req, res) => {
  db.all(
    "SELECT * FROM performer_applications ORDER BY createdAt DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Performer applications could not be loaded"
        });
      }

      res.json(rows);
    }
  );
});

app.put("/performers/:id/status", authenticateAdmin, (req, res) => {
  const performerId = req.params.id;
  const { status } = req.body;

  const sql = `
    UPDATE performer_applications
    SET status = ?
    WHERE id = ?
  `;

  db.run(sql, [status, performerId], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Performer status could not be updated"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Performer application not found"
      });
    }

    res.json({
      message: "Performer status updated successfully",
      performerId,
      status
    });
  });
});

app.delete("/performers/:id", authenticateAdmin, (req, res) => {
  const performerId = req.params.id;

  db.run(
    "DELETE FROM performer_applications WHERE id = ?",
    [performerId],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Performer application could not be deleted"
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Performer application not found"
        });
      }

      res.json({
        message: "Performer application deleted successfully",
        deletedPerformerId: performerId
      });
    }
  );
});

/*
|--------------------------------------------------------------------------
| CONTACT ROUTES
|--------------------------------------------------------------------------
*/
app.post("/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const sql = `
    INSERT INTO contact_messages
    (name, email, phone, subject, message, status)
    VALUES (?, ?, ?, ?, ?, 'New')
  `;

  db.run(sql, [name, email, phone, subject, message], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Contact message could not be saved"
      });
    }

    res.status(201).json({
      message: "Contact message saved successfully",
      contactId: this.lastID
    });
  });
});

app.get("/contact", authenticateAdmin, (req, res) => {
  db.all(
    "SELECT * FROM contact_messages ORDER BY createdAt DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Contact messages could not be loaded"
        });
      }

      res.json(rows);
    }
  );
});

app.put("/contact/:id/status", authenticateAdmin, (req, res) => {
  const contactId = req.params.id;
  const { status } = req.body;

  const sql = `
    UPDATE contact_messages
    SET status = ?
    WHERE id = ?
  `;

  db.run(sql, [status, contactId], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Contact status could not be updated"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Contact message not found"
      });
    }

    res.json({
      message: "Contact status updated successfully",
      contactId,
      status
    });
  });
});

app.delete("/contact/:id", authenticateAdmin, (req, res) => {
  const contactId = req.params.id;

  db.run("DELETE FROM contact_messages WHERE id = ?", [contactId], function (err) {
    if (err) {
      return res.status(500).json({
        error: "Contact message could not be deleted"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Contact message not found"
      });
    }

    res.json({
      message: "Contact message deleted successfully",
      deletedContactId: contactId
    });
  });
});

/*
|--------------------------------------------------------------------------
| EXPORT ROUTES
|--------------------------------------------------------------------------
*/
app.get("/admin/export/bookings", authenticateAdmin, (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Bookings export failed"
      });
    }

    sendCSV(res, "castle-bookings.csv", rows, [
      "id",
      "name",
      "email",
      "phone",
      "eventType",
      "eventDate",
      "guestCount",
      "notes",
      "status",
      "adminNotes",
      "createdAt"
    ]);
  });
});

app.get("/admin/export/performers", authenticateAdmin, (req, res) => {
  db.all(
    "SELECT * FROM performer_applications ORDER BY createdAt DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Performers export failed"
        });
      }

      sendCSV(res, "castle-performers.csv", rows, [
        "id",
        "stageName",
        "realName",
        "email",
        "phone",
        "genre",
        "socialLink",
        "preferredDate",
        "equipmentNeeds",
        "bio",
        "status",
        "createdAt"
      ]);
    }
  );
});

app.get("/admin/export/events", authenticateAdmin, (req, res) => {
  db.all("SELECT * FROM events ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Events export failed"
      });
    }

    sendCSV(res, "castle-events.csv", rows, [
      "id",
      "name",
      "day",
      "time",
      "description",
      "category",
      "capacity",
      "isFeatured",
      "isPublished",
      "createdAt"
    ]);
  });
});

app.get("/admin/export/contacts", authenticateAdmin, (req, res) => {
  db.all(
    "SELECT * FROM contact_messages ORDER BY createdAt DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Contacts export failed"
        });
      }

      sendCSV(res, "castle-contact-messages.csv", rows, [
        "id",
        "name",
        "email",
        "phone",
        "subject",
        "message",
        "status",
        "createdAt"
      ]);
    }
  );
});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});