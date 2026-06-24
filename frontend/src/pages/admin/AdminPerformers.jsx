import { useEffect, useState } from "react";
import { apiFetch, downloadProtectedFile } from "../../api";

function AdminPerformers() {
  const [performers, setPerformers] = useState([]);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");

  function loadPerformers() {
    apiFetch("/performers")
      .then((data) => setPerformers(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadPerformers();
  }, []);

  const pendingCount = performers.filter(
    (performer) => performer.status === "Pending" || !performer.status
  ).length;

  const acceptedCount = performers.filter(
    (performer) => performer.status === "Accepted"
  ).length;

  const rejectedCount = performers.filter(
    (performer) => performer.status === "Rejected"
  ).length;

  const genres = [
    "All",
    ...new Set(
      performers
        .map((performer) => performer.genre)
        .filter((genre) => genre && genre.trim() !== "")
    )
  ];

  const filteredPerformers = performers.filter((performer) => {
    const searchText = `
      ${performer.stageName}
      ${performer.realName}
      ${performer.email}
      ${performer.phone}
      ${performer.genre}
      ${performer.bio}
      ${performer.status}
    `.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (performer.status || "Pending") === statusFilter;

    const matchesGenre =
      genreFilter === "All" || performer.genre === genreFilter;

    return matchesSearch && matchesStatus && matchesGenre;
  });

  function updateStatus(performerId, newStatus) {
    apiFetch(`/performers/${performerId}/status`, {
      method: "PUT",
      body: JSON.stringify({
        status: newStatus
      })
    })
      .then(() => {
        setMessage(`Performer marked as ${newStatus}.`);
        loadPerformers();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Could not update performer status.");
      });
  }

  function copyAcceptanceMessage(performer) {
    const text = `Hi ${performer.realName || performer.stageName},

Thank you for applying to perform at The Castle. We liked your application and would love to discuss a possible performance slot with you.

Artist name: ${performer.stageName}
Genre: ${performer.genre}
Preferred date: ${performer.preferredDate || "To be confirmed"}

Please reply with your availability and any final equipment requirements.

Kind regards,
The Castle Team`;

    navigator.clipboard.writeText(text);
    setMessage("Acceptance message copied to clipboard.");
  }

  function copyRejectionMessage(performer) {
    const text = `Hi ${performer.realName || performer.stageName},

Thank you for applying to perform at The Castle. We really appreciate you taking the time to send your details.

At the moment, we are not able to offer a performance slot, but we will keep your details in mind for future opportunities.

Kind regards,
The Castle Team`;

    navigator.clipboard.writeText(text);
    setMessage("Response message copied to clipboard.");
  }

  function copyFollowUpMessage(performer) {
    const text = `Hi ${performer.realName || performer.stageName},

Thank you for applying to perform at The Castle.

Before we confirm anything, could you please send over any extra links, videos, set examples or details about your equipment needs?

Artist name: ${performer.stageName}
Genre: ${performer.genre}

Kind regards,
The Castle Team`;

    navigator.clipboard.writeText(text);
    setMessage("Follow-up message copied to clipboard.");
  }

  function deletePerformer(performerId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this performer application?"
    );

    if (!confirmed) {
      return;
    }

    apiFetch(`/performers/${performerId}`, {
      method: "DELETE"
    })
      .then(() => {
        setMessage("Performer application deleted successfully.");
        loadPerformers();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Could not delete performer application.");
      });
  }

  function exportPerformers() {
    downloadProtectedFile(
      "/admin/export/performers",
      "castle-performers.csv"
    ).catch((err) => {
      console.error(err);
      setMessage("Performer applications could not be exported.");
    });
  }

  return (
    <section className="admin-page">
      <div className="admin-header-row">
        <div>
          <p className="eyebrow">MANAGER DASHBOARD</p>
          <h1>Performer Applications</h1>
        </div>

        <button className="secondary-btn" onClick={exportPerformers}>
          Export CSV
        </button>
      </div>

      <div className="mini-stats-grid">
        <div className="mini-stat-card">
          <strong>{performers.length}</strong>
          <span>Total</span>
        </div>

        <div className="mini-stat-card">
          <strong>{pendingCount}</strong>
          <span>Pending</span>
        </div>

        <div className="mini-stat-card">
          <strong>{acceptedCount}</strong>
          <span>Accepted</span>
        </div>

        <div className="mini-stat-card">
          <strong>{rejectedCount}</strong>
          <span>Rejected</span>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          placeholder="Search artist, name, email, genre or bio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "All" ? "All genres" : genre}
            </option>
          ))}
        </select>
      </div>

      {message && <p className="form-message">{message}</p>}

      <div className="admin-bookings-grid">
        {filteredPerformers.map((performer) => (
          <div className="admin-booking-card" key={performer.id}>
            <div className="admin-card-topline">
              <h2>{performer.stageName}</h2>
              <span className="status-pill">
                {performer.status || "Pending"}
              </span>
            </div>

            <p>
              <strong>Real Name:</strong> {performer.realName}
            </p>

            <p>
              <strong>Genre:</strong> {performer.genre}
            </p>

            <p>
              <strong>Email:</strong> {performer.email}
            </p>

            <p>
              <strong>Phone:</strong> {performer.phone}
            </p>

            <p>
              <strong>Preferred Date:</strong>{" "}
              {performer.preferredDate || "Not provided"}
            </p>

            <p>
              <strong>Social Link:</strong>{" "}
              {performer.socialLink || "Not provided"}
            </p>

            <p>
              <strong>Equipment:</strong>{" "}
              {performer.equipmentNeeds || "Not provided"}
            </p>

            <p>
              <strong>Bio:</strong> {performer.bio}
            </p>

            <div className="admin-actions">
              <button
                type="button"
                className="accept-btn"
                onClick={() => updateStatus(performer.id, "Accepted")}
              >
                Accept
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => updateStatus(performer.id, "Pending")}
              >
                Pending
              </button>

              <button
                type="button"
                className="reject-btn"
                onClick={() => updateStatus(performer.id, "Rejected")}
              >
                Reject
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => copyAcceptanceMessage(performer)}
              >
                Copy Accept Email
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => copyFollowUpMessage(performer)}
              >
                Copy Follow-up
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => copyRejectionMessage(performer)}
              >
                Copy Reply
              </button>

              <button
                type="button"
                className="reject-btn"
                onClick={() => deletePerformer(performer.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPerformers.length === 0 && (
        <div className="empty-state">
          <h2>No performer applications found</h2>
          <p>Try changing the search, status or genre filter.</p>
        </div>
      )}
    </section>
  );
}

export default AdminPerformers;