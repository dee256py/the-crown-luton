// Import Express
const express = require("express");

// Create Express app
const app = express();

// Backend port
const PORT = 5050;
// Temporary booking storage
const bookings = [];

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

  const booking = req.body;

  bookings.push(booking);

  console.log("Booking received:");
  console.log(booking);

  res.status(201).json({
    message: "Booking received successfully",
    booking: booking
  });

});

/*
|--------------------------------------------------------------------------
| GET ALL BOOKINGS
|--------------------------------------------------------------------------
*/

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});