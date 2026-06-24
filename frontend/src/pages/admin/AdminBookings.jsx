import { useEffect, useState } from "react";
import { apiFetch, downloadProtectedFile } from "../../api";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [editingBookingId, setEditingBookingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    notes: "",
    status: "Pending",
    adminNotes: ""
  });

  function loadBookings() {
    apiFetch("/bookings")
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending" || !booking.status
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const rejectedCount = bookings.filter(
    (booking) => booking.status === "Rejected"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const filteredBookings = bookings.filter((booking) => {
    const searchText = `
      ${booking.name}
      ${booking.email}
      ${booking.phone}
      ${booking.eventType}
      ${booking.eventDate}
      ${booking.status}
    `.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || (booking.status || "Pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function resetForm() {
    setEditingBookingId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      guestCount: "",
      notes: "",
      status: "Pending",
      adminNotes: ""
    });
  }

  function editBooking(booking) {
    setEditingBookingId(booking.id);

    setFormData({
      name: booking.name || "",
      email: booking.email || "",
      phone: booking.phone || "",
      eventType: booking.eventType || "",
      eventDate: booking.eventDate || "",
      guestCount: booking.guestCount || "",
      notes: booking.notes || "",
      status: booking.status || "Pending",
      adminNotes: booking.adminNotes || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    apiFetch(`/bookings/${editingBookingId}`, {
      method: "PUT",
      body: JSON.stringify(formData)
    })
      .then(() => {
        setMessage("Booking updated successfully.");
        resetForm();
        loadBookings();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Booking could not be updated.");
      });
  }

  function quickStatusUpdate(booking, status) {
    apiFetch(`/bookings/${booking.id}/status`, {
      method: "PUT",
      body: JSON.stringify({
        status,
        adminNotes: booking.adminNotes || ""
      })
    })
      .then(() => {
        setMessage(`Booking marked as ${status}.`);
        loadBookings();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Booking status could not be updated.");
      });
  }

  function deleteBooking(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }

    apiFetch(`/bookings/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setMessage("Booking deleted successfully.");
        loadBookings();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Booking could not be deleted.");
      });
  }

  function exportBookings() {
    downloadProtectedFile("/admin/export/bookings", "castle-bookings.csv").catch(
      (err) => {
        console.error(err);
        setMessage("Bookings could not be exported.");
      }
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-header-row">
        <div>
          <p className="eyebrow">MANAGER DASHBOARD</p>
          <h1>Booking Requests</h1>
        </div>

        <button className="secondary-btn" onClick={exportBookings}>
          Export CSV
        </button>
      </div>

      <div className="mini-stats-grid">
        <div className="mini-stat-card">
          <strong>{bookings.length}</strong>
          <span>Total</span>
        </div>

        <div className="mini-stat-card">
          <strong>{pendingCount}</strong>
          <span>Pending</span>
        </div>

        <div className="mini-stat-card">
          <strong>{confirmedCount}</strong>
          <span>Confirmed</span>
        </div>

        <div className="mini-stat-card">
          <strong>{rejectedCount}</strong>
          <span>Rejected</span>
        </div>

        <div className="mini-stat-card">
          <strong>{completedCount}</strong>
          <span>Completed</span>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          placeholder="Search by name, email, phone, event or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {message && <p className="form-message">{message}</p>}

      {editingBookingId && (
        <form className="booking-form pro-admin-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Customer name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            name="eventType"
            placeholder="Event type"
            value={formData.eventType}
            onChange={handleChange}
            required
          />

          <input
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />

          <input
            name="guestCount"
            type="number"
            placeholder="Guest count"
            value={formData.guestCount}
            onChange={handleChange}
            required
          />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>

          <textarea
            name="notes"
            placeholder="Customer notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <textarea
            name="adminNotes"
            placeholder="Private manager notes"
            value={formData.adminNotes}
            onChange={handleChange}
          />

          <button className="primary-btn" type="submit">
            Update Booking
          </button>

          <button className="secondary-btn" type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        </form>
      )}

      <div className="admin-bookings-grid admin-list-spacing">
        {filteredBookings.map((booking) => (
          <div className="admin-booking-card" key={booking.id}>
            <div className="admin-card-topline">
              <h2>{booking.name}</h2>
              <span className="status-pill">{booking.status || "Pending"}</span>
            </div>

            <p>
              <strong>Email:</strong> {booking.email}
            </p>

            <p>
              <strong>Phone:</strong> {booking.phone}
            </p>

            <p>
              <strong>Event Type:</strong> {booking.eventType}
            </p>

            <p>
              <strong>Date:</strong> {booking.eventDate}
            </p>

            <p>
              <strong>Guests:</strong> {booking.guestCount}
            </p>

            <p>
              <strong>Customer Notes:</strong>{" "}
              {booking.notes || "No notes provided"}
            </p>

            <p>
              <strong>Manager Notes:</strong>{" "}
              {booking.adminNotes || "No manager notes yet"}
            </p>

            <p>
              <strong>Submitted:</strong> {booking.createdAt}
            </p>

            <div className="admin-actions">
              <button className="accept-btn" onClick={() => editBooking(booking)}>
                Edit
              </button>

              <button
                className="accept-btn"
                onClick={() => quickStatusUpdate(booking, "Confirmed")}
              >
                Confirm
              </button>

              <button
                className="secondary-btn"
                onClick={() => quickStatusUpdate(booking, "Completed")}
              >
                Complete
              </button>

              <button
                className="reject-btn"
                onClick={() => quickStatusUpdate(booking, "Rejected")}
              >
                Reject
              </button>

              <button
                className="reject-btn"
                onClick={() => deleteBooking(booking.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="empty-state">
          <h2>No bookings found</h2>
          <p>Try changing the search term or status filter.</p>
        </div>
      )}
    </section>
  );
}

export default AdminBookings;