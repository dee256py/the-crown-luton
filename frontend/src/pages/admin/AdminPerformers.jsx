import { useEffect, useState } from "react";
import { apiFetch, downloadProtectedFile } from "../../api";

function AdminPerformers() {
  const [performers, setPerformers] = useState([]);
  const [message, setMessage] = useState("");

  function loadPerformers() {
    apiFetch("/performers")
      .then((data) => setPerformers(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadPerformers();
  }, []);

  function updateStatus(performerId, newStatus) {
    apiFetch(`/performers/${performerId}/status`, {
      method: "PUT",
      body: JSON.stringify({
        status: newStatus
      })
    })
      .then(() => {
        setMessage(`Performer marked as ${newStatus}`);
        loadPerformers();
      })
      .catch((err) => {
        console.error(err);
        setMessage("Could not update performer status.");
      });
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
        setMessage("Performer application deleted successfully!");
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

      {message && <p className="form-message">{message}</p>}

      <div className="admin-bookings-grid">
        {performers.map((performer) => (
          <div className="admin-booking-card" key={performer.id}>
            <div className="admin-card-topline">
              <h2>{performer.stageName}</h2>
              <span className="status-pill">{performer.status || "Pending"}</span>
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
                className="reject-btn"
                onClick={() => deletePerformer(performer.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminPerformers;