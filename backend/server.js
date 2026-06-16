// Import Express
const express = require("express");
const db = require("./database");

// Create Express app
const app = express();

// Backend port
const PORT = 5050;

// Allows Express to read JSON data
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
      day: "Friday"
    },
    {
      id: 2,
      name: "Live DJ Set",
      day: "Saturday"
    },
    {
      id: 3,
      name: "Karaoke Night",
      day: "Sunday"
    }
  ];

  res.json(events);
});

/*
|--------------------------------------------------------------------------
| BOOKINGS ROUTE
|--------------------------------------------------------------------------
| Receives booking information from a form
|--------------------------------------------------------------------------
*/
app.post("/bookings", (req, res) => {
  const { name, email, phone, eventType, eventDate, guestCount, notes } = req.body;

  const sql = `
    INSERT INTO bookings (name, email, phone, eventType, eventDate, guestCount, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, phone, eventType, eventDate, guestCount, notes], function (err) {
    if (err) {
      return res.status(500).json({ error: "Booking could not be saved" });
    }

    res.status(201).json({
      message: "Booking saved successfully",
      bookingId: this.lastID
    });
  });
});

/*
|--------------------------------------------------------------------------
| GET ALL BOOKINGS
|--------------------------------------------------------------------------
*/

app.get("/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Bookings could not be loaded" });
    }

    res.json(rows);
  });
});

/*
|--------------------------------------------------------------------------
| DELETE BOOKING
|--------------------------------------------------------------------------
| Deletes one booking using its ID
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

/*
|--------------------------------------------------------------------------
| UPDATE BOOKING
|--------------------------------------------------------------------------
| Updates one booking using its ID
|--------------------------------------------------------------------------
*/
app.put("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;

  const { name, email, phone, eventType, eventDate, guestCount, notes } = req.body;

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
| START SERVER
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});