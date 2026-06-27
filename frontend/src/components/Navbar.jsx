import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <NavLink className="navbar-logo" to="/" onClick={closeMenu}>
        THE CASTLE
      </NavLink>

      <button
        className="mobile-menu-btn"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
      </button>

      <nav className={menuOpen ? "nav-links nav-links-open" : "nav-links"}>
        <NavLink
          to="/"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Home
        </NavLink>

        <NavLink
          to="/events"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Events
        </NavLink>

        <NavLink
          to="/book-event"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Bookings
        </NavLink>

        <NavLink
          to="/perform"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Perform Here
        </NavLink>

        <NavLink
          to="/contact"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Contact
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;