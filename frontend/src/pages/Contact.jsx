import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [message, setMessage] = useState("");
  const [contactReference, setContactReference] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setContactReference(null);

    fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);

        if (data.error) {
          setMessage(data.error);
          return;
        }

        setContactReference(data.contactId);
        setMessage("Your message has been sent.");

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
        setIsSubmitting(false);
        setMessage("Message could not be sent right now.");
      });
  }

  return (
    <section className="lux-contact-page">
      <div className="lux-contact-hero">
        <p className="eyebrow">CONTACT THE CASTLE</p>

        <h1>
          Questions,
          <br />
          bookings,
          <br />
          big ideas.
        </h1>

        <p>
          Send an enquiry directly to the venue team. Whether you’re asking
          about private hire, live events, performer opportunities or general
          venue details, your message goes straight into the manager dashboard.
        </p>
      </div>

      <div className="lux-booking-layout">
        <div className="lux-booking-panel">
          <p className="eyebrow">SEND AN ENQUIRY</p>

          <form className="booking-form lux-booking-form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full name"
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
              placeholder="Phone number optional"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              name="subject"
              placeholder="Subject e.g. Private hire, event enquiry, performer question"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button className="primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending Message..." : "Send Message"}
            </button>
          </form>

          {message && (
            <div className="lux-success-card">
              <p className="eyebrow">MESSAGE UPDATE</p>
              <h2>{message}</h2>

              {contactReference && (
                <p>
                  Message reference: <strong>#{contactReference}</strong>
                </p>
              )}

              <div className="lux-detail-actions">
                <Link className="secondary-btn" to="/events">
                  View Events
                </Link>

                <Link className="secondary-btn" to="/book-event">
                  Book the Venue
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="lux-contact-sidebar">
          <div className="lux-contact-card">
            <span>Private Hire</span>
            <h3>Plan an event</h3>
            <p>
              Ask about birthdays, celebrations, community nights, DJ events and
              private venue hire.
            </p>
          </div>

          <div className="lux-contact-card">
            <span>Performers</span>
            <h3>Bring your sound</h3>
            <p>
              Questions about open mic nights, performance slots, equipment or
              artist applications can be sent here too.
            </p>
          </div>

          <div className="lux-contact-card">
            <span>Management</span>
            <h3>Tracked properly</h3>
            <p>
              Every enquiry is stored in the admin dashboard so the team can
              search, reply, close and export messages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;