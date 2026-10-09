import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import { SocialRow } from "../components/home/NewsCommunity.jsx";
import { site } from "../data/siteData.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    // TODO: connect to your Node/Express API: fetch("/api/contact", { method:"POST", body: JSON.stringify(form) })
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <PageHero eyebrow="CONTACT" title="Get in Touch" subtitle="Questions about Samsy, SMZ or SM9? We'd love to hear from you." />
      <section className="section container two-col">
        <form className="form" onSubmit={submit}>
          <label>Name<input required value={form.name} onChange={set("name")} /></label>
          <label>Email<input type="email" required value={form.email} onChange={set("email")} /></label>
          <label>Message<textarea rows="5" required value={form.message} onChange={set("message")} /></label>
          <button className="btn btn--primary" type="submit">Send Message</button>
          {sent && <p className="form__ok">Thanks! We'll get back to you soon.</p>}
        </form>
        <div className="contact-info">
          <p><Icon name="mail" size={18} /> <a href={`mailto:${site.email}`}>{site.email}</a></p>
          <p><Icon name="globe" size={18} /> {site.website}</p>
          <h3>Follow us</h3>
          <SocialRow />
        </div>
      </section>
    </>
  );
}
