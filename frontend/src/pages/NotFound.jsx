import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="lux-not-found-page">
      <div className="lux-not-found-card">
        <p className="eyebrow">404 · PAGE NOT FOUND</p>

        <h1>
          This room
          <br />
          isn’t open.
        </h1>

        <p>
          The page you’re looking for may have moved, been renamed, or never
          existed. Head back to the venue and keep exploring The Castle.
        </p>

        <div className="lux-detail-actions">
          <Link className="primary-btn" to="/">
            Back Home
          </Link>

          <Link className="secondary-btn" to="/events">
            View Events
          </Link>

          <Link className="secondary-btn" to="/contact">
            Contact Team
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;