import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");

  function loadContacts() {
    apiFetch("/contact")
      .then((data) => setContacts(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadContacts();
  }, []);

  function deleteContact(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    );

    if (!confirmed) {
      return;
    }

    apiFetch(`/contact/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setMessage("Message deleted successfully!");
        loadContacts();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Message could not be deleted.");
      });
  }

  return (
    <section className="admin-page">
      <p className="eyebrow">MANAGER DASHBOARD</p>
      <h1>Contact Messages</h1>

      {message && <p className="form-message">{message}</p>}

      <div className="admin-bookings-grid">
        {contacts.map((contact) => (
          <div className="admin-booking-card" key={contact.id}>
            <h2>{contact.subject}</h2>

            <p>
              <strong>Name:</strong> {contact.name}
            </p>

            <p>
              <strong>Email:</strong> {contact.email}
            </p>

            <p>
              <strong>Phone:</strong> {contact.phone || "Not provided"}
            </p>

            <p>
              <strong>Message:</strong> {contact.message}
            </p>

            <p>
              <strong>Sent:</strong> {contact.createdAt}
            </p>

            <div className="admin-actions">
              <button
                className="reject-btn"
                onClick={() => deleteContact(contact.id)}
              >
                Delete Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminContacts;