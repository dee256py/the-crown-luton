import { useEffect, useState } from "react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/bookings")
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <section className="admin-page">
      <p className="eyebrow">MANAGER DASHBOARD</p>
      <h1>Event Bookings</h1>

      <div className="admin-bookings-grid">
        {bookings.map((booking) => (
          <div className="admin-booking-card" key={booking.id}>
            <h2>{booking.name}</h2>
            <p><strong>Event:</strong> {booking.eventType}</p>
            <p><strong>Date:</strong> {booking.eventDate}</p>
            <p><strong>Guests:</strong> {booking.guestCount}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>Notes:</strong> {booking.notes}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminBookings;