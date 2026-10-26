import { Link } from "react-router-dom";
import samsyMark from "../assets/samsy-mark.png";
import { site } from "../data/siteData.js";

export default function Logo({ small = false }) {
  return (
    <Link
      to="/"
      className={`logo ${small ? "logo--small" : ""}`}
      aria-label="Samsy Uni"
    >
      <span className="logo__mark">
        <img src={samsyMark} alt="Samsy Uni" className="logo__img" />
      </span>
      <span className="logo__text">
        <strong className="logo__title">SAMSY UNI</strong>
      </span>
    </Link>
  );
}
