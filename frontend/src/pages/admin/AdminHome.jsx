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

    apiFetch("/admin/events")
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));

    apiFetch("/contact")
      .then((data) => setContacts(data))
      .catch((err) => console.error(err));
  }, []);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending" || !booking.status
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  );

  const pendingPerformers = performers.filter(
    (performer) => performer.status === "Pending" || !performer.status
  );

  const newMessages = contacts.filter(
    (contact) => contact.status === "New" || !contact.status
  );

  const publishedEvents = events.filter((event) => event.isPublished === 1);

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

      <div className="admin-stats-grid pro-stats-grid">
        <div className="admin-stat-card">
          <h2>{bookings.length}</h2>
          <p>Total Bookings</p>
        </div>

        <div className="admin-stat-card">
          <h2>{pendingBookings.length}</h2>
          <p>Pending Bookings</p>
        </div>

        <div className="admin-stat-card">
          <h2>{confirmedBookings.length}</h2>
          <p>Confirmed Bookings</p>
        </div>

        <div className="admin-stat-card">
          <h2>{pendingPerformers.length}</h2>
          <p>Pending Performers</p>
        </div>

        <div className="admin-stat-card">
          <h2>{newMessages.length}</h2>
          <p>New Messages</p>
        </div>

        <div className="admin-stat-card">
          <h2>{publishedEvents.length}</h2>
          <p>Published Events</p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <Link to="/admin/bookings" className="admin-dashboard-card">
          <h2>📅 Bookings</h2>
          <p>Review, edit, confirm, reject and export customer bookings.</p>
          <span>Open Bookings →</span>
        </Link>

        <Link to="/admin/performers" className="admin-dashboard-card">
          <h2>🎤 Performers</h2>
          <p>Review performer applications and manage artist status.</p>
          <span>Open Performers →</span>
        </Link>

        <Link to="/admin/events" className="admin-dashboard-card">
          <h2>🎟️ Events</h2>
          <p>Create, edit, feature, publish and export public events.</p>
          <span>Open Events →</span>
        </Link>

        <Link to="/admin/contacts" className="admin-dashboard-card">
          <h2>✉️ Contact</h2>
          <p>Read messages, track replies and export customer enquiries.</p>
          <span>Open Messages →</span>
        </Link>
      </div>

      <div className="recent-panel">
        <h2>Recent Activity</h2>

        <div className="recent-grid">
          <div>
            <h3>Latest Booking</h3>
            <p>
              {bookings[0]
                ? `${bookings[0].name} — ${bookings[0].eventType}`
                : "No bookings yet."}
            </p>
          </div>

          <div>
            <h3>Latest Performer</h3>
            <p>
              {performers[0]
                ? `${performers[0].stageName} — ${performers[0].genre}`
                : "No performer applications yet."}
            </p>
          </div>

          <div>
            <h3>Latest Message</h3>
            <p>
              {contacts[0]
                ? `${contacts[0].name} — ${contacts[0].subject}`
                : "No contact messages yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminHome;