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
      <section className="lux-event-details-page">
        <div className="lux-empty-public">
          <p className="eyebrow">EVENT DETAILS</p>
          <h2>{message}</h2>

          <Link className="secondary-btn" to="/events">
            Back to Events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="lux-event-details-page">
      <div className="lux-event-details-hero">
        <div className="lux-event-details-copy">
          {event.isFeatured === 1 && (
            <span className="status-pill">Featured Event</span>
          )}

          <p className="eyebrow">{event.category || "LIVE EVENT"}</p>

          <h1>{event.name}</h1>

          <p>{event.description}</p>

          <div className="lux-detail-actions">
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

        <div className="lux-detail-panel">
          <p className="eyebrow">EVENT SUMMARY</p>

          <div className="preview-row">
            <span>Category</span>
            <strong>{event.category || "Live Music"}</strong>
          </div>

          <div className="preview-row">
            <span>Day</span>
            <strong>{event.day}</strong>
          </div>

          <div className="preview-row">
            <span>Time</span>
            <strong>{event.time}</strong>
          </div>

          <div className="preview-row">
            <span>Status</span>
            <strong>{event.isFeatured === 1 ? "Featured" : "Published"}</strong>
          </div>

          {Number(event.capacity) > 0 && (
            <div className="preview-row">
              <span>Capacity</span>
              <strong>{event.capacity} guests</strong>
            </div>
          )}
        </div>
      </div>

      <div className="lux-bottom-nav">
        <Link className="secondary-btn" to="/events">
          ← Back to Events
        </Link>
      </div>
    </section>
  );
}

export default EventDetails;