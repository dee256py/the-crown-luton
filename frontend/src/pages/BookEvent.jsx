import { useState } from "react";

function BookEvent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    notes: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetch("http://localhost:5050/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        guestCount: Number(formData.guestCount)
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage("Booking request sent successfully!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: "",
          eventDate: "",
          guestCount: "",
          notes: ""
        });

        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Something went wrong. Please try again.");
      });
  }

  return (
    <section className="booking-page">
      <p className="eyebrow">BOOK THE CROWN</p>

      <h1>Book An Event</h1>

      <p className="booking-intro">
        Planning a birthday, celebration, community night or private event?
        Send us your details and we’ll get back to you.
      </p>

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
          placeholder="Event type e.g. Birthday Party"
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
          placeholder="Number of guests"
          value={formData.guestCount}
          onChange={handleChange}
          required
        />

        <textarea
          name="notes"
          placeholder="Tell us anything else we should know"
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