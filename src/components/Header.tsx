import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { nav, org } from "@/content/site";
import { useLang } from "@/lib/lang";
import { useAuth } from "@/lib/auth";
import { Container } from "./ui";
import narmadaLogo from "@/assets/narmada-logo.jpeg";

export function Header() {
  const { t, lang, setLang } = useLang();
  const { admin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="saffron-rule" aria-hidden="true" />
      <Container className="flex items-center gap-3 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={narmadaLogo}
            alt={t(org.name)}
            className="h-14 w-14 shrink-0 rounded-full border-2 border-primary/50 object-cover shadow-sm transition-transform hover:scale-105"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight font-semibold text-maroon sm:text-lg">
              {t(org.name)}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{t(org.tagline)}</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div
            className="hidden items-center overflow-hidden rounded-full border border-border text-xs sm:flex"
            role="group"
            aria-label="Language"
          >
            <button
              onClick={() => setLang("mr")}
              aria-pressed={lang === "mr"}
              className={`px-3 py-1.5 ${lang === "mr" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`px-3 py-1.5 ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              English
            </button>
          </div>

          <Link
            to={admin ? "/admin" : "/admin/login"}
            className="rounded-full border border-primary/50 bg-sand/60 px-3 py-1.5 text-xs font-semibold text-maroon hover:bg-sand transition-colors"
          >
            {admin ? "प्रशासन (Admin)" : "लॉगिन"}
          </Link>

          <Link
            to="/support"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 sm:text-sm"
          >
            {t({ mr: "सहकार्य करा / देणगी", en: "Support / Donate" })}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t({ mr: "मेनू", en: "Menu" })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border xl:hidden"
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </Container>

      {/* Desktop nav */}
      <nav aria-label={t({ mr: "मुख्य मेनू", en: "Main menu" })} className="hidden border-t border-border xl:block">
        <Container>
          <ul className="flex flex-wrap items-center justify-center gap-x-1 py-1.5 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "bg-accent text-maroon" }}
                  className="rounded-full px-3 py-1.5 text-foreground/80 hover:bg-accent"
                >
                  {t(n.label)}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* Mobile drawer */}
      {open ? (
        <nav
          aria-label={t({ mr: "मोबाईल मेनू", en: "Mobile menu" })}
          className="border-t border-border bg-card xl:hidden"
        >
          <Container className="py-3">
            <ul className="grid gap-1">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: n.to === "/" }}
                    activeProps={{ className: "bg-accent text-maroon" }}
                    className="block rounded-lg px-3 py-2.5 hover:bg-accent"
                  >
                    {t(n.label)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2 sm:hidden">
              <button
                onClick={() => setLang("mr")}
                aria-pressed={lang === "mr"}
                className={`flex-1 rounded-full border border-border px-3 py-2 text-sm ${lang === "mr" ? "bg-primary text-primary-foreground" : ""}`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`flex-1 rounded-full border border-border px-3 py-2 text-sm ${lang === "en" ? "bg-primary text-primary-foreground" : ""}`}
              >
                English
              </button>
            </div>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
