// Import packages
const express = require("express");
const cors = require("cors");
const db = require("./database");

// Create Express app
const app = express();

// Backend port
const PORT = 5050;

// Middleware
app.use(cors());
app.use(express.json());

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
| EVENTS ROUTES
|--------------------------------------------------------------------------
*/
app.get("/events", (req, res) => {
  db.all("SELECT * FROM events ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Events could not be loaded" });
    }

    res.json(rows);
  });
});

app.post("/events", (req, res) => {
  const { name, day, time, description } = req.body;

  const sql = `
    INSERT INTO events (name, day, time, description)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [name, day, time, description], function (err) {
    if (err) {
      return res.status(500).json({ error: "Event could not be created" });
    }

    res.status(201).json({
      message: "Event created successfully",
      eventId: this.lastID
    });
  });
});

app.put("/events/:id", (req, res) => {
  const eventId = req.params.id;
  const { name, day, time, description } = req.body;

  const sql = `
    UPDATE events
    SET name = ?, day = ?, time = ?, description = ?
    WHERE id = ?
  `;

  db.run(sql, [name, day, time, description, eventId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Event could not be updated" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      updatedEventId: eventId
    });
  });
});

app.delete("/events/:id", (req, res) => {
  const eventId = req.params.id;

  db.run("DELETE FROM events WHERE id = ?", [eventId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Event could not be deleted" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Event not found" });
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
    INSERT INTO bookings (name, email, phone, eventType, eventDate, guestCount, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, email, phone, eventType, eventDate, guestCount, notes],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Booking could not be saved" });
      }

      res.status(201).json({
        message: "Booking saved successfully",
        bookingId: this.lastID
      });
    }
  );
});

app.get("/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Bookings could not be loaded" });
    }

    res.json(rows);
  });
});

app.put("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const { name, email, phone, eventType, eventDate, guestCount, notes } =
    req.body;

  const sql = `
    UPDATE bookings
    SET name = ?, email = ?, phone = ?, eventType = ?, eventDate = ?, guestCount = ?, notes = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [name, email, phone, eventType, eventDate, guestCount, notes, bookingId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Booking could not be updated" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json({
        message: "Booking updated successfully",
        updatedBookingId: bookingId
      });
    }
  );
});

app.delete("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;

  db.run("DELETE FROM bookings WHERE id = ?", [bookingId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Booking could not be deleted" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Booking not found" });
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
    (stageName, realName, email, phone, genre, socialLink, preferredDate, equipmentNeeds, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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

app.get("/performers", (req, res) => {
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

app.put("/performers/:id/status", (req, res) => {
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

app.delete("/performers/:id", (req, res) => {
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
    INSERT INTO contact_messages (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
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

app.get("/contact", (req, res) => {
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

app.delete("/contact/:id", (req, res) => {
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
| START SERVER
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});