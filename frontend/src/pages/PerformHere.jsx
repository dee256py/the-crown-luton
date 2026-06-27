import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api";

function PerformHere() {
  const [formData, setFormData] = useState({
    stageName: "",
    realName: "",
    email: "",
    phone: "",
    genre: "",
    socialLink: "",
    preferredDate: "",
    equipmentNeeds: "",
    bio: ""
  });

  const [message, setMessage] = useState("");
  const [applicationReference, setApplicationReference] = useState(null);
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
    setApplicationReference(null);

    fetch(`${API_BASE_URL}/performers`, {
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

        setApplicationReference(data.performerId);
        setMessage("Your performer application has been sent.");

        setFormData({
          stageName: "",
          realName: "",
          email: "",
          phone: "",
          genre: "",
          socialLink: "",
          preferredDate: "",
          equipmentNeeds: "",
          bio: ""
        });
      })
      .catch((err) => {
        console.error(err);
        setIsSubmitting(false);
        setMessage("Application could not be sent right now.");
      });
  }

  return (
    <section className="lux-perform-page">
      <div className="lux-perform-hero">
        <p className="eyebrow">PERFORM AT THE CASTLE</p>

        <h1>
          Bring the sound.
          <br />
          Own the room.
        </h1>

        <p>
          Apply for a performance slot at The Castle. Send your artist details,
          genre, links, availability and equipment needs straight to the venue
          manager dashboard.
        </p>
      </div>

      <div className="lux-booking-layout">
        <div className="lux-booking-panel">
          <p className="eyebrow">ARTIST APPLICATION</p>

          <form className="booking-form lux-booking-form" onSubmit={handleSubmit}>
            <input
              name="stageName"
              placeholder="Stage name / artist name"
              value={formData.stageName}
              onChange={handleChange}
              required
            />

            <input
              name="realName"
              placeholder="Real name"
              value={formData.realName}
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
              required
            />

            <input
              name="genre"
              placeholder="Genre e.g. R&B, Afrobeats, DJ, Spoken Word"
              value={formData.genre}
              onChange={handleChange}
              required
            />

            <input
              name="socialLink"
              placeholder="Instagram, TikTok, YouTube, SoundCloud or portfolio link"
              value={formData.socialLink}
              onChange={handleChange}
            />

            <input
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleChange}
            />

            <textarea
              name="equipmentNeeds"
              placeholder="Equipment needs e.g. microphone, DJ deck, speakers, backing track..."
              value={formData.equipmentNeeds}
              onChange={handleChange}
            />

            <textarea
              name="bio"
              placeholder="Tell us about your sound, experience, performance style and why you want to perform here..."
              value={formData.bio}
              onChange={handleChange}
              required
            />

            <button className="primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending Application..." : "Send Application"}
            </button>
          </form>

          {message && (
            <div className="lux-success-card">
              <p className="eyebrow">APPLICATION UPDATE</p>
              <h2>{message}</h2>

              {applicationReference && (
                <p>
                  Application reference: <strong>#{applicationReference}</strong>
                </p>
              )}

              <div className="lux-detail-actions">
                <Link className="secondary-btn" to="/events">
                  View Events
                </Link>

                <Link className="secondary-btn" to="/contact">
                  Contact Team
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="lux-booking-sidebar">
          <div className="lux-booking-info-card">
            <span>01</span>
            <h3>Send your details</h3>
            <p>
              Submit your artist name, genre, links, bio and performance needs.
            </p>
          </div>

          <div className="lux-booking-info-card">
            <span>02</span>
            <h3>Venue review</h3>
            <p>
              The manager can accept, reject, filter and export performer
              applications from the dashboard.
            </p>
          </div>

          <div className="lux-booking-info-card">
            <span>03</span>
            <h3>Get contacted</h3>
            <p>
              The team can copy email-ready replies and contact you with the next
              steps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PerformHere;