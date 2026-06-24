import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>The Castle!</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/book-event">Bookings</Link>
        <Link to="/perform">Perform Here</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;