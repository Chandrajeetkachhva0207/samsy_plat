import { Link } from "react-router-dom";
import founder from "../../assets/founder.svg"; // replace with founder photo (PNG with transparent bg looks best)
import { about } from "../../data/siteData.js";

export default function AboutSection() {
  return (
    <section className="about-strip">
      <div className="container about-strip__grid">
        <div className="about-strip__left">
          <span className="eyebrow eyebrow--blue">ABOUT SAMSY</span>
          <h2>{about.heading}</h2>
          <p>{about.text}</p>
          <Link to="/about" className="btn btn--outline btn--sm">Our Vision &amp; Mission →</Link>
        </div>

        <div className="about-strip__mid">
          <ul className="stats">
            {about.stats.map((s) => (
              <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>
            ))}
          </ul>
          <div className="signature">
            <span className="signature__sign">{about.founder}</span>
            <strong>{about.founder} <span className="flag flag--sm" aria-hidden="true" /></strong>
            <small>Founder</small>
          </div>
        </div>

        <div className="about-strip__photo">
          <img src={founder} alt={about.founder} />
        </div>

        <blockquote className="about-strip__quote">
          <p>“{about.quote}”</p>
          <footer>
            <strong>– {about.founder}</strong>
            <span>{about.founderRole}</span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
