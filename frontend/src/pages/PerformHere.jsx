import { useState } from "react";

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

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:5050/performers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then(() => {
        setMessage("Application sent successfully!");

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
        setMessage("Something went wrong. Please try again.");
      });
  }

  return (
    <section className="booking-page">
      <p className="eyebrow">PERFORM AT THE CASTLE</p>

      <h1>Perform Here</h1>

      <p className="booking-intro">
        Are you a singer, DJ, band, poet or performer? Send us your details and
        tell us what you would bring to the stage.
      </p>

      <form className="booking-form" onSubmit={handleSubmit}>
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
          placeholder="Genre e.g. Indie Rock, Afrobeats, House"
          value={formData.genre}
          onChange={handleChange}
          required
        />

        <input
          name="socialLink"
          placeholder="Social media / music link"
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
          placeholder="Equipment needs e.g. microphone, DJ decks, guitar amp"
          value={formData.equipmentNeeds}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Tell us about your act"
          value={formData.bio}
          onChange={handleChange}
          required
        />

        <button className="primary-btn" type="submit">
          Send Performer Application
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

export default PerformHere;