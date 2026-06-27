import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  const [bookingReference, setBookingReference] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setBookingReference(null);

    fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);

        if (data.error) {
          setMessage(data.error);
          return;
        }

        setBookingReference(data.bookingId);
        setMessage("Your booking request has been sent.");

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
        setIsSubmitting(false);
        setMessage("Booking could not be sent right now.");
      });
  }

  return (
    <section className="lux-booking-page">
      <div className="lux-booking-hero">
        <p className="eyebrow">BOOK THE CASTLE</p>

        <h1>
          Plan the night.
          <br />
          We’ll handle the request.
        </h1>

        <p>
          Send your event details directly to the venue team. Whether it’s a
          private hire, birthday, DJ night, live performance or community event,
          your request lands straight inside the manager dashboard.
        </p>
      </div>

      <div className="lux-booking-layout">
        <div className="lux-booking-panel">
          <p className="eyebrow">REQUEST DETAILS</p>

          {selectedEvent && (
            <div className="selected-event-note">
              You are booking for: <strong>{selectedEvent}</strong>
            </div>
          )}

          <form className="booking-form lux-booking-form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full name"
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
              placeholder="Event type e.g. Birthday, Private Hire, Open Mic"
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
              min="1"
              placeholder="Estimated guest count"
              value={formData.guestCount}
              onChange={handleChange}
              required
            />

            <textarea
              name="notes"
              placeholder="Tell us the vibe, timing, setup, music, food, decorations or anything the team should know..."
              value={formData.notes}
              onChange={handleChange}
            />

            <button className="primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending Request..." : "Send Booking Request"}
            </button>
          </form>

          {message && (
            <div className="lux-success-card">
              <p className="eyebrow">REQUEST UPDATE</p>
              <h2>{message}</h2>

              {bookingReference && (
                <p>
                  Booking reference: <strong>#{bookingReference}</strong>
                </p>
              )}

              <div className="lux-detail-actions">
                <Link className="secondary-btn" to="/events">
                  View Events
                </Link>

                <Link className="secondary-btn" to="/contact">
                  Contact Team
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="lux-booking-sidebar">
          <div className="lux-booking-info-card">
            <span>01</span>
            <h3>Submit your request</h3>
            <p>
              Share the date, guest count, event type and any extra details the
              venue team needs.
            </p>
          </div>

          <div className="lux-booking-info-card">
            <span>02</span>
            <h3>Manager review</h3>
            <p>
              Your request appears inside the admin dashboard where the team can
              search, filter, update and export bookings.
            </p>
          </div>

          <div className="lux-booking-info-card">
            <span>03</span>
            <h3>Next steps</h3>
            <p>
              The Castle team can contact you with availability, confirmation or
              any follow-up questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookEvent;