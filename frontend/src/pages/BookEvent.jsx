import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../api";

function BookEvent() {
  const [searchParams] = useSearchParams();
  const selectedEvent = searchParams.get("event") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: selectedEvent,
    eventDate: "",
    guestCount: "",
    notes: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then(() => {
        setMessage("Booking request sent successfully!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: selectedEvent,
          eventDate: "",
          guestCount: "",
          notes: ""
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Something went wrong. Please try again.");
      });
  }

  return (
    <section className="booking-page">
      <p className="eyebrow">BOOK THE VENUE</p>

      <h1>Book an Event</h1>

      <p className="booking-intro">
        Planning a party, private event, celebration or community night? Send a
        booking request and the manager can review it from the dashboard.
      </p>

      {selectedEvent && (
        <p className="selected-event-note">
          You are booking for: <strong>{selectedEvent}</strong>
        </p>
      )}

      <form className="booking-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Your name"
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
          placeholder="Event type or event name"
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
          placeholder="Tell us anything important about your booking"
          value={formData.notes}
          onChange={handleChange}
        />

        <button className="primary-btn" type="submit">
          Send Booking Request
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

export default BookEvent;