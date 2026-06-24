import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch, removeAdminToken } from "../../api";

function AdminHome() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    apiFetch("/bookings")
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));

    apiFetch("/performers")
      .then((data) => setPerformers(data))
      .catch((err) => console.error(err));

    apiFetch("/events")
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));

    apiFetch("/contact")
      .then((data) => setContacts(data))
      .catch((err) => console.error(err));
  }, []);

  const pendingPerformers = performers.filter(
    (performer) => performer.status === "Pending" || !performer.status
  );

  function handleLogout() {
    removeAdminToken();
    navigate("/admin/login");
  }

  return (
    <section className="admin-page">
      <div className="admin-header-row">
        <div>
          <p className="eyebrow">MANAGER DASHBOARD</p>
          <h1>Admin Control Centre</h1>
        </div>

        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h2>{bookings.length}</h2>
          <p>Total Bookings</p>
        </div>

        <div className="admin-stat-card">
          <h2>{performers.length}</h2>
          <p>Performer Applications</p>
        </div>

        <div className="admin-stat-card">
          <h2>{pendingPerformers.length}</h2>
          <p>Pending Performers</p>
        </div>

        <div className="admin-stat-card">
          <h2>{events.length}</h2>
          <p>Upcoming Events</p>
        </div>

        <div className="admin-stat-card">
          <h2>{contacts.length}</h2>
          <p>Contact Messages</p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <Link to="/admin/bookings" className="admin-dashboard-card">
          <h2>📅 Bookings</h2>
          <p>View customer event booking requests.</p>
          <span>Open Bookings →</span>
        </Link>

        <Link to="/admin/performers" className="admin-dashboard-card">
          <h2>🎤 Performers</h2>
          <p>Review performer applications and accept or reject artists.</p>
          <span>Open Performers →</span>
        </Link>

        <Link to="/admin/events" className="admin-dashboard-card">
          <h2>🎟️ Events</h2>
          <p>Create, edit and delete public event listings.</p>
          <span>Open Events →</span>
        </Link>

        <Link to="/admin/contacts" className="admin-dashboard-card">
          <h2>✉️ Contact</h2>
          <p>Read and manage customer contact messages.</p>
          <span>Open Messages →</span>
        </Link>
      </div>
    </section>
  );
}

export default AdminHome;