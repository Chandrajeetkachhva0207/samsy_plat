import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import stack from "../assets/ecosystem-stack.svg";
import { services } from "../data/siteData.js";

export default function Ecosystem() {
  return (
    <>
      <PageHero eyebrow="OUR ECOSYSTEM" title="One Platform. Endless Possibilities." subtitle="Payments, social, commerce, AI, entertainment and utilities – all on one blockchain powered platform." />
      <section className="section container two-col">
        <div className="card-grid card-grid--2">
          {services.map((s) => (
            <article className="card" key={s.title}>
              <span className="card__icon"><Icon name={s.icon} size={24} /></span>
              <h3>{s.title}</h3>
              <small className="muted">{s.text}</small>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
        <img className="stack-img" src={stack} alt="Samsy platform layers" />
      </section>
    </>
  );
}
