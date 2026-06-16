import "./App.css";

function App() {
  return (
    <main className="site">
      <nav className="navbar">
        <h2>The Crown 👑</h2>

        <div className="nav-links">
          <a>Home</a>
          <a>Events</a>
          <a>Bookings</a>
          <a>Perform Here</a>
          <a>Contact</a>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">Luton’s community pub & live music space</p>

        <h1>
          Live Music.
          <br />
          Great Events.
          <br />
          A Place For Everyone.
        </h1>

        <p className="hero-text">
          A modern British pub, live music venue, event space and proud
          community hub in the heart of Luton.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">View Events</button>
          <button className="secondary-btn">Book An Event</button>
        </div>
      </section>

      <section className="feature-grid">
        <Feature icon="🎤" title="Live Music" text="Open mic nights, DJs and local performers." />
        <Feature icon="🎉" title="Private Events" text="Birthdays, celebrations and community nights." />
        <Feature icon="🏳️‍🌈" title="Inclusive Space" text="A welcoming atmosphere for everyone." />
        <Feature icon="🍻" title="Great Drinks" text="Classic pub energy with modern nightlife vibes." />
      </section>
    </main>
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

export default App;