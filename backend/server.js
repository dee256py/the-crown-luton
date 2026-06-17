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
  res.send("Welcome to The Crown Luton API");
});

/*
|--------------------------------------------------------------------------
| EVENTS ROUTE
|--------------------------------------------------------------------------
*/
app.get("/events", (req, res) => {
  const events = [
    {
      id: 1,
      name: "Open Mic Night",
      day: "Friday",
      time: "7:00 PM",
      description:
        "A welcoming night for local singers, poets and performers."
    },
    {
      id: 2,
      name: "Live DJ Set",
      day: "Saturday",
      time: "9:00 PM",
      description:
        "Late-night DJ sets featuring local talent and guest performers."
    },
    {
      id: 3,
      name: "Karaoke Night",
      day: "Sunday",
      time: "8:00 PM",
      description:
        "Grab the mic and sing your favourite songs with friends."
    }
  ];

  res.json(events);
});

/*
|--------------------------------------------------------------------------
| CREATE BOOKING
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

/*
|--------------------------------------------------------------------------
| GET ALL BOOKINGS
|--------------------------------------------------------------------------
*/
app.get("/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: "Bookings could not be loaded"
      });
    }

    res.json(rows);
  });
});

/*
|--------------------------------------------------------------------------
| UPDATE BOOKING
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| DELETE BOOKING
|--------------------------------------------------------------------------
*/
app.delete("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;

  const sql = "DELETE FROM bookings WHERE id = ?";

  db.run(sql, [bookingId], function (err) {
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

/*
|--------------------------------------------------------------------------
| UPDATE PERFORMER STATUS
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| UPDATE PERFORMER STATUS
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});