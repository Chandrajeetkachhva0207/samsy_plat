
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import Logo from "./Logo.jsx";
import { navLinks } from "../data/siteData.js";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <Logo />
        </div>

        <nav
          id="main-navigation"
          className={`navbar__links ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `navbar__link${isActive ? " is-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {/* <button
            className="lang-btn"
            type="button"
            aria-label="Select language"
          >
            <Globe size={14} aria-hidden="true" />
            <span>EN</span>
            <ChevronDown size={12} aria-hidden="true" />
          </button> */}

          <button
            className="btn btn--primary btn--sm"
            type="button"
          >
            Connect Wallet
          </button>

          <button
            className="navbar__toggle"
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="main-navigation"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}