
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import Icon from "../Icon.jsx";
import heroBg from "../../assets/hero-bg-img.png";
import { heroFeatures } from "../../data/siteData.js";

export default function HeroSection() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="badge-india">
            <span className="flag" aria-hidden="true" />
            BUILT IN INDIA
          </span>

          <h1>
            SAMSY
            <span className="grad">Digital Infrastructure</span>
            for the <span className="green">Future</span>
          </h1>

          <p>
            Blockchain technology. Secure ecosystem. Global opportunities.
            Samsy is building a decentralized digital economy for individuals,
            freelancers and MSMEs — from India, for the world.
          </p>

          <div className="hero__cta">
            <Link to="/ecosystem" className="btn btn--primary">
              Explore Ecosystem <span aria-hidden="true">→</span>
            </Link>

            <button type="button" className="btn btn--outline">
              <Play size={14} />
              Watch Video
            </button>
          </div>
        </div>

        <div className="hero__globe-space" aria-hidden="true" />

        <ul className="hero__features">
          {heroFeatures.map((feature) => (
            <li key={feature.title}>
              <span className="hero__feat-icon">
                <Icon name={feature.icon} size={26} />
              </span>

              <div>
                <strong>{feature.title}</strong>
                <span>{feature.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}