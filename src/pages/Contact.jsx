
import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import { SocialRow } from "../components/home/NewsCommunity.jsx";
import { site } from "../data/siteData.js";
import "../styles/contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const set = (key) => (e) => {
    setForm((previous) => ({
      ...previous,
      [key]: e.target.value,
    }));
    setSent(false);
  };

  const submit = (e) => {
    e.preventDefault();

    // Connect your backend API here when it is ready.
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="contact-page">
      <PageHero
        eyebrow="LET'S CONNECT"
        title="Get in Touch"
        subtitle="Questions about Samsy, SMZ or SM9? We'd love to hear from you."
      />

      <section className="contact-section">
        <div className="contact-container">
          {/* Section introduction */}
          <div className="contact-heading">
            <span className="contact-eyebrow">WE'RE HERE TO HELP</span>
            <h2>
              Let's Start a <span>Conversation.</span>
            </h2>
            <p>
              Have a question, an idea, or a collaboration in mind?
              Send us a message and let's explore the possibilities together.
            </p>
          </div>

          <div className="contact-grid">
            {/* Contact form */}
            <div className="contact-form-card">
              <div className="contact-card-heading">
                <div className="contact-heading-icon">
                  <Icon name="send" size={22} />
                </div>
                <div>
                  <h3>Send Us a Message</h3>
                  <p>Fill in the details below to get in touch.</p>
                </div>
              </div>

              <form className="contact-form" onSubmit={submit}>
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={form.name}
                  onChange={set("name")}
                  required
                />

                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                />

                <label htmlFor="contact-message">Your Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={set("message")}
                  required
                />

                <button
                  className="contact-submit"
                  type="submit"
                >
                  <span>Send Message</span>
                  <Icon name="arrow-right" size={18} />
                </button>

                {sent && (
                  <p className="contact-success" role="status">
                    Thank you for reaching out! Your form has been
                    submitted successfully.
                  </p>
                )}
              </form>

              <div className="contact-form-note">
                <Icon name="shield" size={16} />
                <span>Your information is used to respond to your enquiry.</span>
              </div>
            </div>

            {/* Contact information */}
            <aside className="contact-sidebar">
              <div className="contact-info-card">
                <span className="contact-eyebrow">CONTACT INFORMATION</span>
                <h3>Let's Connect with SAMSY</h3>
                <p className="contact-info-description">
                  Reach out to learn more about our ecosystem, explore
                  opportunities, or discuss working together.
                </p>

                <a
                  className="contact-detail"
                  href={`mailto:${site.email}`}
                >
                  <span className="contact-detail-icon">
                    <Icon name="mail" size={21} />
                  </span>
                  <span className="contact-detail-text">
                    <small>Email Us</small>
                    <strong>{site.email}</strong>
                  </span>
                  <Icon name="arrow-up-right" size={17} />
                </a>

                <div className="contact-detail">
                  <span className="contact-detail-icon">
                    <Icon name="globe" size={21} />
                  </span>
                  <span className="contact-detail-text">
                    <small>Visit Our Website</small>
                    <strong>{site.website}</strong>
                  </span>
                </div>

                <div className="contact-divider" />

                <div className="contact-social-heading">
                  <h4>Follow Our Journey</h4>
                  <p>Stay connected with the SAMSY community.</p>
                </div>

                <div className="contact-socials">
                  <SocialRow />
                </div>
              </div>

              <div className="contact-highlight">
                <div className="contact-highlight-icon">
                  <Icon name="messages-square" size={24} />
                </div>
                <div>
                  <h4>Have an idea to share?</h4>
                  <p>
                    We'd love to hear your thoughts and explore new
                    possibilities together.
                  </p>
                </div>
                <span className="contact-highlight-decoration">S</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
