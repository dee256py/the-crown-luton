import { useEffect, useState } from "react";
import { apiFetch, downloadProtectedFile } from "../../api";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  function loadContacts() {
    apiFetch("/contact")
      .then((data) => setContacts(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const newCount = contacts.filter(
    (contact) => contact.status === "New" || !contact.status
  ).length;

  const repliedCount = contacts.filter(
    (contact) => contact.status === "Replied"
  ).length;

  const closedCount = contacts.filter(
    (contact) => contact.status === "Closed"
  ).length;

  const filteredContacts = contacts.filter((contact) => {
    const searchText = `
      ${contact.name}
      ${contact.email}
      ${contact.phone}
      ${contact.subject}
      ${contact.message}
      ${contact.status}
    `.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || (contact.status || "New") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function updateStatus(contactId, status) {
    apiFetch(`/contact/${contactId}/status`, {
      method: "PUT",
      body: JSON.stringify({
        status
      })
    })
      .then(() => {
        setMessage(`Message marked as ${status}.`);
        loadContacts();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Message status could not be updated.");
      });
  }

  function copyReply(contact) {
    const text = `Hi ${contact.name},

Thank you for getting in touch with The Castle.

We have received your message about "${contact.subject}" and a member of the team will get back to you as soon as possible.

Kind regards,
The Castle Team`;

    navigator.clipboard.writeText(text);
    setMessage("Reply template copied to clipboard.");
  }

  function copyDetailedReply(contact) {
    const text = `Hi ${contact.name},

Thank you for contacting The Castle.

I’m getting back to you regarding your message: "${contact.subject}".

Thanks for sharing the details with us. We’ll review your enquiry and respond with the next steps as soon as possible.

Your original message:
"${contact.message}"

Kind regards,
The Castle Team`;

    navigator.clipboard.writeText(text);
    setMessage("Detailed reply copied to clipboard.");
  }

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
        setMessage("Message deleted successfully.");
        loadContacts();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Message could not be deleted.");
      });
  }

  function exportContacts() {
    downloadProtectedFile(
      "/admin/export/contacts",
      "castle-contact-messages.csv"
    ).catch((err) => {
      console.error(err);
      setMessage("Messages could not be exported.");
    });
  }

  return (
    <section className="admin-page">
      <div className="admin-header-row">
        <div>
          <p className="eyebrow">MANAGER DASHBOARD</p>
          <h1>Contact Messages</h1>
        </div>

        <button className="secondary-btn" onClick={exportContacts}>
          Export CSV
        </button>
      </div>

      <div className="mini-stats-grid">
        <div className="mini-stat-card">
          <strong>{contacts.length}</strong>
          <span>Total</span>
        </div>

        <div className="mini-stat-card">
          <strong>{newCount}</strong>
          <span>New</span>
        </div>

        <div className="mini-stat-card">
          <strong>{repliedCount}</strong>
          <span>Replied</span>
        </div>

        <div className="mini-stat-card">
          <strong>{closedCount}</strong>
          <span>Closed</span>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          placeholder="Search by name, email, phone, subject or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="New">New</option>
          <option value="Replied">Replied</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {message && <p className="form-message">{message}</p>}

      <div className="admin-bookings-grid">
        {filteredContacts.map((contact) => (
          <div className="admin-booking-card" key={contact.id}>
            <div className="admin-card-topline">
              <h2>{contact.subject}</h2>
              <span className="status-pill">{contact.status || "New"}</span>
            </div>

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
                className="accept-btn"
                onClick={() => updateStatus(contact.id, "New")}
              >
                New
              </button>

              <button
                className="secondary-btn"
                onClick={() => updateStatus(contact.id, "Replied")}
              >
                Replied
              </button>

              <button
                className="secondary-btn"
                onClick={() => updateStatus(contact.id, "Closed")}
              >
                Closed
              </button>

              <button className="secondary-btn" onClick={() => copyReply(contact)}>
                Copy Quick Reply
              </button>

              <button
                className="secondary-btn"
                onClick={() => copyDetailedReply(contact)}
              >
                Copy Detailed Reply
              </button>

              <button
                className="reject-btn"
                onClick={() => deleteContact(contact.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="empty-state">
          <h2>No contact messages found</h2>
          <p>Try changing the search term or status filter.</p>
        </div>
      )}
    </section>
  );
}

export default AdminContacts;