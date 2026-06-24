import { useEffect, useState } from "react";

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">
          LUTON'S COMMUNITY PUB & LIVE MUSIC SPACE
        </p>

        <h1>
          Live Music.
          <br />
          Great Events.
          <br />
          A Place For Everyone.
        </h1>

        <p className="hero-text">
          A modern British pub, live music venue,
          event space and proud community hub
          in the heart of Luton.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            View Events
          </button>

          <button className="secondary-btn">
            Book An Event
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="feature-grid">
        <Feature
          icon="🎤"
          title="Live Music"
          text="Open mic nights, DJs and local performers."
        />

        <Feature
          icon="🎉"
          title="Private Events"
          text="Birthdays, celebrations and community nights."
        />

        <Feature
          icon="🏳️‍🌈"
          title="Inclusive Space"
          text="A welcoming atmosphere for everyone."
        />

        <Feature
          icon="🍻"
          title="Great Drinks"
          text="Classic pub energy with modern nightlife vibes."
        />
      </section>

      {/* Events Preview */}
      <section className="events-section">
        <p className="eyebrow">WHAT'S ON</p>

        <h2>Upcoming Events</h2>

        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <h3>{event.name}</h3>

              <p className="event-time">
                {event.day} • {event.time}
              </p>

              <p className="event-description">
                {event.description}
              </p>

              <button className="event-button">
                View Details →
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">
      <span>{icon}</span>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

export default Home;