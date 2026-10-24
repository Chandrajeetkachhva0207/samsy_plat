import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import stack from "../../assets/ecosystem_img_bg.png"; // replace with real 3D stack image
import lion from "../../assets/lion.svg";             // replace with SMZ emblem
import eagle from "../../assets/eagle.svg";           // replace with SM9 emblem
import { services, tokens } from "../../data/siteData.js";

export default function EcosystemSection() {
  return (
    <section className="eco">
      <div className="container eco__grid">
        <div className="eco__left">
          <span className="eyebrow">OUR ECOSYSTEM</span>
          <h2>One Platform. Endless Possibilities.</h2>
          <p>
            Samsy Uni brings together multiple services on a single blockchain
            powered platform — making digital life simple, secure and accessible
            for everyone.
          </p>
          <ul className="eco__services">
            {services.map((s) => (
              <li key={s.title}>
                <span className="eco__icon"><Icon name={s.icon} size={20} /></span>
                <div><strong>{s.title}</strong><span>{s.text}</span></div>
              </li>
            ))}
          </ul>
          <Link to="/ecosystem" className="btn btn--primary btn--sm">Learn More About Ecosystem →</Link>
        </div>

        <div className="eco__center">
          <img src={stack} alt="Samsy platform layers" />
        </div>

        <div className="eco__right">
          <article className="token-card token-card--smz">
            <img className="token-card__emblem" src={lion} alt="" />
            <div>
              <h3>{tokens.smz.name}</h3>
              <p>{tokens.smz.sub}</p>
              <Link to="/smz-token" className="btn btn--primary btn--sm">View Details →</Link>
            </div>
            <span className="token-card__watermark">SMZ</span>
          </article>
          <article className="token-card token-card--sm9">
            <img className="token-card__emblem" src={eagle} alt="" />
            <div>
              <h3>{tokens.sm9.name}</h3>
              <p>{tokens.sm9.sub}</p>
              <Link to="/sm9-project" className="btn btn--gold btn--sm">View Details →</Link>
            </div>
            <span className="token-card__watermark">SM9</span>
          </article>
        </div>
      </div>
    </section>
  );
}
