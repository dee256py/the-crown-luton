import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api";

function Events() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Events could not be loaded right now.");
        setIsLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...new Set(events.map((event) => event.category || "Live Music"))
  ];

  const featuredEvent =
    events.find((event) => event.isFeatured === 1) || events[0];

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <section className="lux-events-page">
      <div className="lux-events-hero">
        <p className="eyebrow">WHAT'S ON</p>

        <h1>
          Nights worth
          <br />
          showing up for.
        </h1>

        <p>
          Discover live music, open mic nights, DJ sets, community events and
          private hire opportunities at The Castle.
        </p>
      </div>

      {isLoading && (
        <div className="lux-skeleton-grid">
          <div className="lux-skeleton-card"></div>
          <div className="lux-skeleton-card"></div>
          <div className="lux-skeleton-card"></div>
        </div>
      )}

      {!isLoading && message && <p className="form-message">{message}</p>}

      {!isLoading && events.length > 0 && featuredEvent && (
        <div className="lux-featured-event">
          <div>
            <p className="eyebrow">FEATURED EVENT</p>

            <h2>{featuredEvent.name}</h2>

            <p>{featuredEvent.description}</p>

            <div className="lux-event-meta">
              <span>{featuredEvent.category || "Live Music"}</span>
              <span>{featuredEvent.day}</span>
              <span>{featuredEvent.time}</span>
            </div>

            <div className="lux-hero-actions">
              <Link className="primary-btn" to={`/events/${featuredEvent.id}`}>
                View Details
              </Link>

              <Link
                className="secondary-btn"
                to={`/book-event?event=${encodeURIComponent(
                  featuredEvent.name
                )}`}
              >
                Book This Event
              </Link>
            </div>
          </div>

          <div className="lux-featured-orb">
            <span>LIVE</span>
          </div>
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <>
          <div className="lux-events-toolbar">
            <div>
              <p className="eyebrow">BROWSE EVENTS</p>
              <h2>{filteredEvents.length} event listings</h2>
            </div>

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
          </div>

          <div className="lux-events-grid">
            {filteredEvents.map((event) => (
              <article className="lux-event-card" key={event.id}>
                <div className="lux-event-card-top">
                  <span>{event.category || "Live Music"}</span>

                  {event.isFeatured === 1 && (
                    <strong className="status-pill">Featured</strong>
                  )}
                </div>

                <h2>{event.name}</h2>

                <p className="lux-event-date">
                  {event.day} · {event.time}
                </p>

                <p>{event.description}</p>

                {Number(event.capacity) > 0 && (
                  <p className="capacity-note">
                    Capacity: {event.capacity} guests
                  </p>
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
        </>
      )}

      {!isLoading && events.length === 0 && (
        <div className="lux-empty-public">
          <p className="eyebrow">COMING SOON</p>
          <h2>No events are published yet.</h2>
          <p>
            Check back soon for live music, open mic nights, DJ sets and special
            events.
          </p>
        </div>
      )}
    </section>
  );
}

export default Events;