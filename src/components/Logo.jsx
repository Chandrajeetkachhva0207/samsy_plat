import { Link } from "react-router-dom";
import logo from "../assets/logo.svg"; // <-- replace src/assets/logo.svg with your real logo
import { site } from "../data/siteData.js";

export default function Logo({ small = false }) {
  return (
    <Link to="/" className={`logo ${small ? "logo--small" : ""}`} aria-label={site.name}>
      <img src={logo} alt="" className="logo__img" />
      <span className="logo__text">
        <strong>{site.name}</strong>
        <small>{site.tagline}</small>
      </span>
    </Link>
  );
}
