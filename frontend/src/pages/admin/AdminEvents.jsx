import { useEffect, useState } from "react";
import { apiFetch, downloadProtectedFile } from "../../api";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    day: "",
    time: "",
    description: "",
    category: "Live Music",
    capacity: "",
    isFeatured: false,
    isPublished: true
  });

  function loadEvents() {
    apiFetch("/admin/events")
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  }

  function resetForm() {
    setFormData({
      name: "",
      day: "",
      time: "",
      description: "",
      category: "Live Music",
      capacity: "",
      isFeatured: false,
      isPublished: true
    });

    setEditingEventId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const url = editingEventId ? `/events/${editingEventId}` : "/events";
    const method = editingEventId ? "PUT" : "POST";

    apiFetch(url, {
      method,
      body: JSON.stringify(formData)
    })
      .then(() => {
        setMessage(
          editingEventId
            ? "Event updated successfully!"
            : "Event created successfully!"
        );

        resetForm();
        loadEvents();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Something went wrong.");
      });
  }

  function editEvent(event) {
    setEditingEventId(event.id);

    setFormData({
      name: event.name || "",
      day: event.day || "",
      time: event.time || "",
      description: event.description || "",
      category: event.category || "Live Music",
      capacity: event.capacity || "",
      isFeatured: event.isFeatured === 1,
      isPublished: event.isPublished === 1
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteEvent(id) {
    const confirmed = window.confirm("Are you sure you want to delete this event?");

    if (!confirmed) {
      return;
    }

    apiFetch(`/events/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setMessage("Event deleted successfully!");
        loadEvents();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Event could not be deleted.");
      });
  }

  function exportEvents() {
    downloadProtectedFile("/admin/export/events", "castle-events.csv").catch(
      (err) => {
        console.error(err);
        setMessage("Events could not be exported.");
      }
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-header-row">
        <div>
          <p className="eyebrow">MANAGER DASHBOARD</p>
          <h1>Manage Events</h1>
        </div>

        <button className="secondary-btn" onClick={exportEvents}>
          Export CSV
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}

      <form className="booking-form pro-admin-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Event name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="Live Music">Live Music</option>
          <option value="Open Mic">Open Mic</option>
          <option value="DJ Night">DJ Night</option>
          <option value="Community Event">Community Event</option>
          <option value="Private Hire">Private Hire</option>
          <option value="Special Event">Special Event</option>
        </select>

        <input
          name="day"
          placeholder="Day e.g. Friday"
          value={formData.day}
          onChange={handleChange}
          required
        />

        <input
          name="time"
          placeholder="Time e.g. 7:00 PM"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Event description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label className="checkbox-row">
          <input
            name="isFeatured"
            type="checkbox"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          Feature this event
        </label>

        <label className="checkbox-row">
          <input
            name="isPublished"
            type="checkbox"
            checked={formData.isPublished}
            onChange={handleChange}
          />
          Publish on public website
        </label>

        <button className="primary-btn" type="submit">
          {editingEventId ? "Update Event" : "Create Event"}
        </button>

        {editingEventId && (
          <button className="secondary-btn" type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <div className="admin-bookings-grid admin-list-spacing">
        {events.map((event) => (
          <div className="admin-booking-card" key={event.id}>
            <div className="admin-card-topline">
              <h2>{event.name}</h2>

              <span className={event.isPublished === 1 ? "status-pill" : "status-pill muted"}>
                {event.isPublished === 1 ? "Published" : "Hidden"}
              </span>
            </div>

            {event.isFeatured === 1 && <span className="status-pill">Featured</span>}

            <p>
              <strong>Category:</strong> {event.category || "Live Music"}
            </p>

            <p>
              <strong>Day:</strong> {event.day}
            </p>

            <p>
              <strong>Time:</strong> {event.time}
            </p>

            <p>
              <strong>Capacity:</strong>{" "}
              {Number(event.capacity) > 0 ? event.capacity : "Not set"}
            </p>

            <p>
              <strong>Description:</strong> {event.description}
            </p>

            <div className="admin-actions">
              <button className="accept-btn" onClick={() => editEvent(event)}>
                Edit
              </button>

              <button className="reject-btn" onClick={() => deleteEvent(event.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminEvents;