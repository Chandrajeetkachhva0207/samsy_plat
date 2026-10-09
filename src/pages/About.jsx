import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import founderImg from "../assets/founder.svg";
import { about } from "../data/siteData.js";

const values = [
  { icon: "shield", title: "Trust & Transparency", text: "Every transaction is verifiable on-chain." },
  { icon: "users", title: "Inclusion", text: "Built for individuals, freelancers and MSMEs." },
  { icon: "pay", title: "Financial Freedom", text: "Fast, secure and global payments for everyone." },
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="ABOUT US" title="Building a Stronger Digital Tomorrow" subtitle={about.text} />

      <section className="section container two-col">
        <div>
          <h2>Our Vision &amp; Mission</h2>
          <p>
            <strong>Vision:</strong> A swadeshi blockchain ecosystem that gives every Indian – and every
            person in the world – access to secure, fair and borderless digital services.
          </p>
          <p>
            <strong>Mission:</strong> Empower MSMEs and freelancers with payments, commerce, identity,
            content and AI tools on one trusted platform.
          </p>
        </div>
        <ul className="stats stats--light">
          {about.stats.map((s) => (
            <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>
          ))}
        </ul>
      </section>

      <section className="section section--tint">
        <div className="container">
          <h2 className="center">Our Values</h2>
          <div className="card-grid card-grid--3">
            {values.map((v) => (
              <article className="card" key={v.title}>
                <span className="card__icon"><Icon name={v.icon} size={24} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container founder-block">
        <img src={founderImg} alt={about.founder} />
        <div>
          <span className="eyebrow">FOUNDER</span>
          <h2>{about.founder}</h2>
          <p className="quote">“{about.quote}”</p>
          <p className="muted">{about.founderRole}</p>
        </div>
      </section>
    </>
  );
}
