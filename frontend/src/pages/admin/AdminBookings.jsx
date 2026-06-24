import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [editingBookingId, setEditingBookingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    notes: ""
  });

  function loadBookings() {
    apiFetch("/bookings")
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function resetForm() {
    setEditingBookingId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      guestCount: "",
      notes: ""
    });
  }

  function editBooking(booking) {
    setEditingBookingId(booking.id);

    setFormData({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      guestCount: booking.guestCount,
      notes: booking.notes || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    apiFetch(`/bookings/${editingBookingId}`, {
      method: "PUT",
      body: JSON.stringify(formData)
    })
      .then(() => {
        setMessage("Booking updated successfully!");
        resetForm();
        loadBookings();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Booking could not be updated.");
      });
  }

  function deleteBooking(id) {
    const confirmed = window.confirm("Are you sure you want to delete this booking?");

    if (!confirmed) {
      return;
    }

    apiFetch(`/bookings/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setMessage("Booking deleted successfully!");
        loadBookings();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Booking could not be deleted.");
      });
  }

  return (
    <section className="admin-page">
      <p className="eyebrow">MANAGER DASHBOARD</p>
      <h1>Booking Requests</h1>

      {message && <p className="form-message">{message}</p>}

      {editingBookingId && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Customer name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            name="eventType"
            placeholder="Event type"
            value={formData.eventType}
            onChange={handleChange}
            required
          />

          <input
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />

          <input
            name="guestCount"
            type="number"
            placeholder="Guest count"
            value={formData.guestCount}
            onChange={handleChange}
            required
          />

          <textarea
            name="notes"
            placeholder="Extra notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <button className="primary-btn" type="submit">
            Update Booking
          </button>

          <button className="secondary-btn" type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        </form>
      )}

      <div className="admin-bookings-grid admin-list-spacing">
        {bookings.map((booking) => (
          <div className="admin-booking-card" key={booking.id}>
            <h2>{booking.name}</h2>

            <p>
              <strong>Email:</strong> {booking.email}
            </p>

            <p>
              <strong>Phone:</strong> {booking.phone}
            </p>

            <p>
              <strong>Event Type:</strong> {booking.eventType}
            </p>

            <p>
              <strong>Date:</strong> {booking.eventDate}
            </p>

            <p>
              <strong>Guests:</strong> {booking.guestCount}
            </p>

            <p>
              <strong>Notes:</strong> {booking.notes || "No notes provided"}
            </p>

            <p>
              <strong>Submitted:</strong> {booking.createdAt}
            </p>

            <div className="admin-actions">
              <button className="accept-btn" onClick={() => editBooking(booking)}>
                Edit
              </button>

              <button
                className="reject-btn"
                onClick={() => deleteBooking(booking.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminBookings;