
import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import Icon from "./Icon.jsx";
import { navLinks, site } from "../data/siteData.js";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Main footer */}
      <div className="footer__main container">
        {/* Brand column */}
        <div className="footer__brand">
          <Logo small />

          <p className="footer__description">
            Building innovative digital experiences and technology
            solutions for a connected world.
          </p>

          <div className="footer__made-in">
            <span className="footer__status-dot" />
            <span>Technology for a connected future</span>
          </div>
        </div>

        {/* Navigation column */}
        <div className="footer__column">
          <h3 className="footer__heading">Explore</h3>

          <nav className="footer__links" aria-label="Explore">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact column */}
        <div className="footer__column">
          <h3 className="footer__heading">Get in Touch</h3>

          <p className="footer__column-text">
            Have a question or want to connect with our team?
          </p>

          <a className="footer__contact-link" href={`mailto:${site.email}`}>
            <span className="footer__icon">
              <Icon name="mail" size={17} />
            </span>
            <span>{site.email}</span>
          </a>

          <a
            className="footer__contact-link"
            href={`https://${site.website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="footer__icon">
              <Icon name="globe" size={17} />
            </span>
            <span>{site.website}</span>
          </a>
        </div>

        {/* Location / identity column */}
        <div className="footer__column footer__column--india">
          <h3 className="footer__heading">Our Identity</h3>

          <div className="footer__india">
            <span className="flag" aria-hidden="true" />
            <div>
              <strong>{site.builtInIndia}</strong>
              <span>{site.buildForWorld}</span>
            </div>
          </div>

          <p className="footer__column-text">
            Rooted in India. Building for the world.
          </p>

          <Link className="footer__back-top" to="/">
            Back to Home
            <span aria-hidden="true">↑</span>
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright">{site.copyright}</p>

          <nav className="footer__legal" aria-label="Legal links">
            <Link to="/contact">Privacy Policy</Link>
            <Link to="/contact">Terms &amp; Conditions</Link>
            <Link to="/contact">Disclaimer</Link>
          </nav>

          <span className="footer__bottom-brand">
            Made with care in India
          </span>
        </div>
      </div>
    </footer>
  );
}