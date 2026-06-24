import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api";

function Events() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState("Loading events...");

  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setMessage("");
      })
      .catch((err) => {
        console.error(err);
        setMessage("Events could not be loaded right now.");
      });
  }, []);

  const categories = [
    "All",
    ...new Set(events.map((event) => event.category || "Live Music"))
  ];

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  const featuredEvents = events.filter((event) => event.isFeatured === 1);

  return (
    <section className="events-page">
      <div className="events-hero">
        <p className="eyebrow">WHAT'S ON</p>
        <h1>Events at The Castle</h1>
        <p>
          Discover live music, open mic nights, DJ sets, community events and
          special nights happening at the venue.
        </p>
      </div>

      {featuredEvents.length > 0 && (
        <div className="featured-strip">
          <p className="eyebrow">FEATURED</p>
          <h2>{featuredEvents[0].name}</h2>
          <p>{featuredEvents[0].description}</p>

          <div className="event-card-actions">
            <Link className="primary-btn" to={`/events/${featuredEvents[0].id}`}>
              View Featured Event
            </Link>

            <Link
              className="secondary-btn"
              to={`/book-event?event=${encodeURIComponent(
                featuredEvents[0].name
              )}`}
            >
              Book This Event
            </Link>
          </div>
        </div>
      )}

      <div className="category-filter-row">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "category-pill active-category"
                : "category-pill"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {message && <p className="form-message">{message}</p>}

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <article className="event-card pro-event-card" key={event.id}>
            {event.isFeatured === 1 && <span className="status-pill">Featured</span>}

            <p className="event-category">{event.category || "Live Music"}</p>

            <h2>{event.name}</h2>

            <p>
              <strong>{event.day}</strong> · {event.time}
            </p>

            <p>{event.description}</p>

            {Number(event.capacity) > 0 && (
              <p className="capacity-note">Capacity: {event.capacity} guests</p>
            )}

            <div className="event-card-actions">
              <Link className="primary-btn" to={`/events/${event.id}`}>
                View Details
              </Link>

              <Link
                className="secondary-btn"
                to={`/book-event?event=${encodeURIComponent(event.name)}`}
              >
                Book
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredEvents.length === 0 && !message && (
        <p className="form-message">No events match this category yet.</p>
      )}
    </section>
  );
}

export default Events;