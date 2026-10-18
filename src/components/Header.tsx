
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { nav, org, secondaryNav } from "@/content/site";
import { useLang } from "@/lib/lang";
import { useAuth } from "@/lib/auth";
import { Container } from "./ui";
import narmadaLogo from "@/assets/narmada-logo.jpeg";

export function Header() {
  const { t, lang, setLang } = useLang();
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const buttonClass =
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2 py-2 text-[10px] font-semibold leading-tight transition-colors sm:px-4 sm:py-2 sm:text-sm";

  const languageButtonClass = (active: boolean) =>
    `px-3 py-1.5 transition-colors ${active
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="saffron-rule" aria-hidden="true" />

      {/* Top bar */}
      <Container className="flex min-w-0 items-center gap-2 py-2 sm:gap-3 sm:py-3">
        {/* Logo and organization name */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial sm:gap-3"
        >
          <img
            src={narmadaLogo}
            alt={t(org.name)}
            className="block h-10 w-10 min-h-10 min-w-10 shrink-0 rounded-full border-2 border-primary/50 object-cover object-center shadow-sm sm:h-12 sm:w-12 sm:min-h-12 sm:min-w-12 lg:h-14 lg:w-14 lg:min-h-14 lg:min-w-14"
          />

          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-semibold leading-tight text-maroon sm:text-base lg:text-lg">
              {t(org.name)}
            </span>
            <span className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">
              {t(org.tagline)}
            </span>
          </span>
        </Link>

        {/* Top actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Language selector: tablet and desktop */}
          <div
            className="hidden items-center overflow-hidden rounded-full border border-border text-xs sm:flex"
            role="group"
            aria-label={t({ mr: "भाषा", en: "Language" })}
          >
            <button
              type="button"
              onClick={() => setLang("mr")}
              aria-pressed={lang === "mr"}
              className={languageButtonClass(lang === "mr")}
            >
              मराठी
            </button>

            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={languageButtonClass(lang === "en")}
            >
              English
            </button>
          </div>

          {/* Login, Admin or Student Portal */}
          {!user ? (
            <Link
              to="/login"
              search={{ mode: "login" }}
              onClick={closeMenu}
              className={`${buttonClass} max-w-[116px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 sm:max-w-none`}            >
              <span className="sm:hidden">
                {t({ mr: "नोंदणी / लॉगिन", en: "Register / Login" })}
              </span>
              <span className="hidden sm:inline">
                {t({ mr: "नोंदणी / लॉगिन", en: "Register / Login" })}
              </span>
            </Link>
          ) : isAdmin ? (
            <Link
              to="/admin"
              onClick={closeMenu}
              className={`${buttonClass} border border-primary/50 bg-sand/60 text-maroon hover:bg-sand`}
            >
              {t({ mr: "प्रशासन", en: "Admin" })}
            </Link>
          ) : (
            <Link
              to="/student/dashboard"
              onClick={closeMenu}
              className={`${buttonClass} border border-primary/50 bg-sand/60 text-maroon hover:bg-sand`}
            >
              <span className="sm:hidden">
                {t({ mr: "विद्यार्थी", en: "Student" })}
              </span>
              <span className="hidden sm:inline">
                {t({ mr: "विद्यार्थी डॅशबोर्ड", en: "Student Portal" })}
              </span>
            </Link>
          )}

          {/* Support button: larger screens only */}
          <Link
            to="/support"
            onClick={closeMenu}
            className={`${buttonClass} hidden bg-primary text-primary-foreground hover:bg-primary/90 xl:inline-flex`}
          >
            {t({
              mr: "सहकार्य करा / देणगी",
              en: "Support / Donate",
            })}
          </Link>

          {/* Logout: larger screens */}
          {user && (
            <button
              type="button"
              onClick={() => {
                logout();
                closeMenu();
              }}
              className={`${buttonClass} hidden border border-border text-muted-foreground hover:bg-accent hover:text-maroon xl:inline-flex`}
            >
              {t({ mr: "लॉगआउट", en: "Logout" })}
            </button>
          )}

          {/* Mobile and tablet menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            aria-label={t({
              mr: open ? "मेनू बंद करा" : "मेनू उघडा",
              en: open ? "Close menu" : "Open menu",
            })}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-lg transition-colors hover:bg-accent sm:h-10 sm:w-10 xl:hidden"
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </Container>

      {/* Desktop navigation */}
      <nav
        aria-label={t({ mr: "मुख्य मेनू", en: "Main menu" })}
        className="hidden border-t border-border xl:block"
      >
        <Container>
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 py-2 text-sm">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{
                    className: "bg-accent text-maroon font-semibold",
                  }}
                  className="block rounded-full px-3 py-2 text-foreground/80 transition-colors hover:bg-accent"
                >
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* Mobile and tablet drawer */}
      {open && (
        <nav
          id="site-mobile-menu"
          aria-label={t({ mr: "मोबाईल मेनू", en: "Mobile menu" })}
          className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-border bg-card xl:hidden"
        >
          <Container className="py-3 sm:py-4">
            {/* Main navigation */}
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={closeMenu}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{
                      className: "bg-accent text-maroon font-semibold",
                    }}
                    className="block rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-accent"
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Secondary navigation */}
            {secondaryNav && secondaryNav.length > 0 && (
              <div className="mt-3 border-t border-border/70 pt-3">
                <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t({
                    mr: "अधिकृत माहिती व योजना",
                    en: "Official Info & Plans",
                  })}
                </p>

                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2">
                  {secondaryNav.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={closeMenu}
                        activeProps={{
                          className: "bg-accent text-maroon font-semibold",
                        }}
                        className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent ${item.to === "/certificates"
                            ? "bg-sand/50 font-semibold text-maroon"
                            : "text-foreground/90"
                          }`}
                      >
                        <span>{t(item.label)}</span>

                        {item.to === "/certificates" && (
                          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            {t({
                              mr: "अधिकृत ४ कागदपत्रे",
                              en: "4 Documents",
                            })}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile language selector */}
            <div className="mt-3 border-t border-border/70 pt-3 sm:hidden">
              <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
                {t({ mr: "भाषा निवडा", en: "Choose language" })}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLang("mr")}
                  aria-pressed={lang === "mr"}
                  className={`flex-1 rounded-full border border-border px-3 py-2 text-sm transition-colors ${lang === "mr"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                    }`}
                >
                  मराठी
                </button>

                <button
                  type="button"
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                  className={`flex-1 rounded-full border border-border px-3 py-2 text-sm transition-colors ${lang === "en"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                    }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Mobile authentication and account actions */}
            <div className="mt-3 border-t border-border/70 pt-3">
              {!user ? (
                <Link
                  to="/login"
                  search={{ mode: "login" }}
                  onClick={closeMenu}
                  className="block w-full rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                >
                  {t({
                    mr: "नोंदणी / लॉगिन",
                    en: "Register / Login",
                  })}
                </Link>
              ) : (
                <div className="grid gap-2">
                  <Link
                    to={isAdmin ? "/admin" : "/student/dashboard"}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-maroon transition-colors hover:bg-accent"
                  >
                    {isAdmin
                      ? t({ mr: "प्रशासन डॅशबोर्ड", en: "Admin Dashboard" })
                      : t({
                        mr: "विद्यार्थी डॅशबोर्ड",
                        en: "Student Dashboard",
                      })}
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-maroon transition-colors hover:bg-accent"
                  >
                    {t({ mr: "लॉगआउट", en: "Logout" })}
                  </button>
                </div>
              )}

              {/* Support link inside drawer */}
              <Link
                to="/support"
                onClick={closeMenu}
                className="mt-2 block rounded-full border border-primary/40 bg-sand/40 px-4 py-2.5 text-center text-sm font-semibold text-maroon transition-colors hover:bg-sand"
              >
                {t({
                  mr: "सहकार्य करा / देणगी",
                  en: "Support / Donate",
                })}
              </Link>
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
