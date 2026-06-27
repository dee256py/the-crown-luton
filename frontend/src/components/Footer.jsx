import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="lux-footer">
      <div className="lux-footer-main">
        <div className="lux-footer-brand">
          <p className="eyebrow">THE CASTLE LIVE</p>

          <h2>
            Built for nights
            <br />
            people remember.
          </h2>

          <p>
            A premium venue platform for live events, private hire, performer
            applications and manager-ready operations.
          </p>
        </div>

        <div className="lux-footer-links compact-footer-links">
          <div>
            <h3>Venue</h3>
            <Link to="/events">What’s On</Link>
            <Link to="/book-event">Private Hire</Link>
            <Link to="/perform">Perform Here</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/admin/login">Admin Login</Link>
          </div>

          <div>
            <h3>Social</h3>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="lux-footer-bottom">
        <span>© {new Date().getFullYear()} The Castle Live.</span>
        <span>Designed and built as a full-stack venue platform.</span>
      </div>
    </footer>
  );
}

export default Footer;