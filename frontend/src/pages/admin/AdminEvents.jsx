import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    day: "",
    time: "",
    description: ""
  });

  function loadEvents() {
    apiFetch("/events")
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function resetForm() {
    setFormData({
      name: "",
      day: "",
      time: "",
      description: ""
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
      name: event.name,
      day: event.day,
      time: event.time,
      description: event.description
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

  return (
    <section className="admin-page">
      <p className="eyebrow">MANAGER DASHBOARD</p>
      <h1>Manage Events</h1>

      {message && <p className="form-message">{message}</p>}

      <form className="booking-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Event name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <textarea
          name="description"
          placeholder="Event description"
          value={formData.description}
          onChange={handleChange}
          required
        />

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
            <h2>{event.name}</h2>

            <p>
              <strong>Day:</strong> {event.day}
            </p>

            <p>
              <strong>Time:</strong> {event.time}
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