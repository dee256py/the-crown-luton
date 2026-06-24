import { useEffect, useState } from "react";

function AdminPerformers() {
  const [performers, setPerformers] = useState([]);
  const [message, setMessage] = useState("");

  function loadPerformers() {
    fetch("http://localhost:5050/performers")
      .then((res) => res.json())
      .then((data) => setPerformers(data))
      .catch((err) => console.error("Error loading performers:", err));
  }

  useEffect(() => {
    loadPerformers();
  }, []);

  function updateStatus(performerId, newStatus) {
    fetch(`http://localhost:5050/performers/${performerId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMessage(`Performer marked as ${newStatus}`);
        loadPerformers();
      })
      .catch((err) => {
        console.error("Error updating performer status:", err);
        setMessage("Could not update performer status.");
      });
  }

  return (
    <section className="admin-page">
      <p className="eyebrow">MANAGER DASHBOARD</p>
      <h1>Performer Applications</h1>

      {message && <p className="form-message">{message}</p>}

      <div className="admin-bookings-grid">
        {performers.map((performer) => (
          <div className="admin-booking-card" key={performer.id}>
            <h2>{performer.stageName}</h2>

            <p>
              <strong>Status:</strong> {performer.status || "Pending"}
            </p>

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
              <strong>Preferred Date:</strong> {performer.preferredDate}
            </p>

            <p>
              <strong>Equipment:</strong> {performer.equipmentNeeds}
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
                className="reject-btn"
                onClick={() => updateStatus(performer.id, "Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminPerformers;