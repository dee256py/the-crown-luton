import { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <section className="events-page">
      <p className="eyebrow">THE CROWN LUTON</p>

      <h1>Upcoming Events</h1>

      <p className="events-page-intro">
        Discover live music, community events,
        open mic nights and unforgettable evenings
        at The Crown.
      </p>

      <div className="events-page-grid">
        {events.map((event) => (
          <div className="large-event-card" key={event.id}>
            <div className="event-image-placeholder">
              🎤
            </div>

            <div className="event-content">
              <h2>{event.name}</h2>

              <p className="event-time">
                {event.day} • {event.time}
              </p>

              <p>{event.description}</p>

              <button className="primary-btn">
                Book This Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Events;