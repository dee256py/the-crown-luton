import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../api";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("Loading event...");

  useEffect(() => {
    fetch(`${API_BASE_URL}/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          return;
        }

        setEvent(data);
        setMessage("");
      })
      .catch((err) => {
        console.error(err);
        setMessage("Event could not be loaded.");
      });
  }, [id]);

  if (message) {
    return (
      <section className="booking-page">
        <p className="form-message">{message}</p>

        <Link className="secondary-btn" to="/events">
          Back to Events
        </Link>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="booking-page">
        <p className="form-message">Event not found.</p>

        <Link className="secondary-btn" to="/events">
          Back to Events
        </Link>
      </section>
    );
  }

  return (
    <section className="event-details-page">
      <Link className="secondary-btn" to="/events">
        ← Back to Events
      </Link>

      <div className="event-details-card">
        {event.isFeatured === 1 && <span className="status-pill">Featured</span>}

        <p className="eyebrow">{event.category || "LIVE EVENT"}</p>

        <h1>{event.name}</h1>

        <div className="event-detail-meta">
          <span>{event.day}</span>
          <span>{event.time}</span>
          {Number(event.capacity) > 0 && <span>{event.capacity} capacity</span>}
        </div>

        <p>{event.description}</p>

        <div className="event-card-actions">
          <Link
            className="primary-btn"
            to={`/book-event?event=${encodeURIComponent(event.name)}`}
          >
            Book This Event
          </Link>

          <Link className="secondary-btn" to="/perform">
            Apply to Perform
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EventDetails;