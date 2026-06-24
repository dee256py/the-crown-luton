import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:5050/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then(() => {
        setMessage("Message sent successfully!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Something went wrong. Please try again.");
      });
  }

  return (
    <section className="booking-page">
      <p className="eyebrow">CONTACT THE CASTLE</p>

      <h1>Contact</h1>

      <p className="booking-intro">
        Have a question about events, bookings, performers or the venue? Send a
        message and the team can review it from the manager dashboard.
      </p>

      <form className="booking-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Your name"
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
        />

        <input
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button className="primary-btn" type="submit">
          Send Message
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

export default Contact;