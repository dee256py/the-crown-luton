import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, saveAdminToken } from "../../api";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Login failed.");
        return;
      }

      saveAdminToken(data.token);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="booking-page">
      <div className="admin-login-card">
        <p className="eyebrow">MANAGER ACCESS</p>

        <h1>Admin Login</h1>

        <p className="booking-intro">
          Log in to manage bookings, performer applications, public events and
          contact messages.
        </p>

        <form className="booking-form" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Admin email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Admin password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="primary-btn" type="submit">
            Login
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}

        <p className="admin-demo-note">
          Demo login: admin@castle.local / CastleAdmin123!
        </p>
      </div>
    </section>
  );
}

export default AdminLogin;