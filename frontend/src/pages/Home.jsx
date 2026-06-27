import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="lux-home">
      <div className="lux-hero">
        <div className="lux-hero-copy">
          <p className="eyebrow">THE CASTLE LIVE</p>

          <h1>
            Live music.
            <br />
            Private hire.
            <br />
            Managed beautifully.
          </h1>

          <p className="lux-hero-text">
            A premium venue platform for discovering events, booking the space,
            applying to perform and helping managers run everything from one
            secure dashboard.
          </p>

          <div className="lux-hero-actions">
            <Link className="primary-btn" to="/events">
              Explore Events
            </Link>

            <Link className="secondary-btn" to="/book-event">
              Book the Venue
            </Link>
          </div>
        </div>

        <div className="lux-hero-visual">
          <div className="floating-card main-floating-card">
            <span>Tonight</span>
            <h2>Open Mic Night</h2>
            <p>Local performers, warm lighting, live sound and community energy.</p>
          </div>

          <div className="floating-card small-floating-card top-card">
            <strong>24</strong>
            <span>Bookings managed</span>
          </div>

          <div className="floating-card small-floating-card bottom-card">
            <strong>Live</strong>
            <span>Performer applications</span>
          </div>
        </div>
      </div>

      <div className="lux-marquee">
        <span>Live Music</span>
        <span>Private Hire</span>
        <span>Open Mic</span>
        <span>DJ Nights</span>
        <span>Community Events</span>
        <span>Performer Applications</span>
      </div>

      <div className="lux-section">
        <p className="eyebrow">BUILT FOR REAL VENUES</p>
        <h2>Everything important, handled in one place.</h2>

        <div className="lux-bento-grid">
          <Link to="/events" className="lux-bento-card big-card">
            <p>01</p>
            <h3>Discover Events</h3>
            <span>
              Browse published events, featured nights and live venue updates.
            </span>
          </Link>

          <Link to="/book-event" className="lux-bento-card">
            <p>02</p>
            <h3>Book the Space</h3>
            <span>
              Customers can send event requests without calling or messaging
              manually.
            </span>
          </Link>

          <Link to="/perform" className="lux-bento-card">
            <p>03</p>
            <h3>Apply to Perform</h3>
            <span>
              Artists can submit genre, links, bio and equipment requirements.
            </span>
          </Link>

          <Link to="/contact" className="lux-bento-card">
            <p>04</p>
            <h3>Contact the Team</h3>
            <span>
              Venue enquiries are stored and tracked inside the dashboard.
            </span>
          </Link>
        </div>
      </div>

      <div className="lux-experience-section">
        <div className="lux-experience-heading">
          <p className="eyebrow">MADE FOR THE WHOLE NIGHT</p>
          <h2>From first enquiry to final encore.</h2>
          <p>
            The Castle platform is designed for the full venue experience:
            customers, artists and managers all have a smoother way to connect.
          </p>
        </div>

        <div className="lux-experience-grid">
          <div className="lux-experience-card">
            <span>Private Hire</span>
            <h3>Celebrations with structure.</h3>
            <p>
              Birthdays, graduations, community nights and private events can be
              requested through one polished booking flow.
            </p>
          </div>

          <div className="lux-experience-card">
            <span>Artists</span>
            <h3>A proper stage pathway.</h3>
            <p>
              Performers can send their sound, links, bio and setup needs
              directly to the team without messy DMs.
            </p>
          </div>

          <div className="lux-experience-card">
            <span>Managers</span>
            <h3>Everything stays organised.</h3>
            <p>
              Bookings, events, performers and contact messages are managed from
              a secure dashboard with filters, statuses and exports.
            </p>
          </div>
        </div>
      </div>

      <div className="lux-split-section">
        <div>
          <p className="eyebrow">MANAGER DASHBOARD</p>
          <h2>Not just a website. A control room.</h2>
        </div>

        <div className="lux-dashboard-preview">
          <div className="preview-row">
            <span>Bookings</span>
            <strong>Search · Filter · Confirm</strong>
          </div>

          <div className="preview-row">
            <span>Performers</span>
            <strong>Accept · Reject · Copy Email</strong>
          </div>

          <div className="preview-row">
            <span>Events</span>
            <strong>Create · Feature · Publish</strong>
          </div>

          <div className="preview-row">
            <span>Contacts</span>
            <strong>Reply · Close · Export</strong>
          </div>
        </div>
      </div>

      <div className="lux-final-cta">
        <p className="eyebrow">READY WHEN YOU ARE</p>
        <h2>Plan the night. Fill the room. Manage the venue.</h2>

        <div className="lux-hero-actions">
          <Link className="primary-btn" to="/book-event">
            Start a Booking
          </Link>

          <Link className="secondary-btn" to="/perform">
            Apply to Perform
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;