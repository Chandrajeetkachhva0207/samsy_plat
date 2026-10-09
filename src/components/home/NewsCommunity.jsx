import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { news, quickLinks, socials } from "../../data/siteData.js";

const socialIcon = { Telegram: "telegram", X: "x", YouTube: "youtube", LinkedIn: "linkedin", Instagram: "instagram", Facebook: "facebook" };

export function NewsList({ items = news, compact = false }) {
  return (
    <ul className={`news-list ${compact ? "news-list--compact" : ""}`}>
      {items.map((n) => (
        <li key={n.title}>
          <time>{n.date}</time>
          <span className="news-list__title">{n.title}</span>
          <span className={`tag tag--${n.tag.toLowerCase()}`}>{n.tag}</span>
        </li>
      ))}
    </ul>
  );
}

export function SocialRow() {
  return (
    <div className="social-row">
      {socials.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} className={`social social--${s.name.toLowerCase()}`}>
          <Icon name={socialIcon[s.name]} size={18} />
        </a>
      ))}
    </div>
  );
}

export function Subscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    // TODO: connect to your backend, e.g. fetch("/api/subscribe", { method: "POST", ... })
    setDone(true);
    setEmail("");
  };
  return (
    <form className="subscribe" onSubmit={submit}>
      <div className="subscribe__field">
        <Icon name="mail" size={16} />
        <input type="email" required placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button className="btn btn--primary btn--sm" type="submit">{done ? "Subscribed ✓" : "Subscribe"}</button>
    </form>
  );
}

export default function NewsCommunity() {
  return (
    <section className="news-section">
      <div className="container news-section__grid">
        <div className="news-section__col">
          <div className="col-head">
            <h3><Icon name="doc" size={22} /> Latest News &amp; Announcements</h3>
            <Link to="/news" className="link-sm">View All →</Link>
          </div>
          <NewsList compact />
        </div>

        <div className="news-section__col">
          <h3 className="col-title">Quick Links</h3>
          <ul className="quick">
            {quickLinks.map((q) => (
              <li key={q.title}>
                <Link to={q.to}>
                  <span className="quick__icon"><Icon name={q.icon} size={20} /></span>
                  <span><strong>{q.title}</strong><small>{q.text}</small></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="news-section__col">
          <h3 className="col-title">Join Our Community</h3>
          <p className="muted">Stay updated with the latest news, launches and opportunities.</p>
          <SocialRow />
          <Subscribe />
          <div className="newsletter">
            <span className="newsletter__bell"><Icon name="bell" size={22} /></span>
            <div>
              <strong>Newsletter</strong>
              <small>Get the latest updates on SMZ, SM9 and ecosystem news.</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
