import { Link } from "@tanstack/react-router";
import {
  nav,
  org,
  secondaryNav,
  PLACEHOLDER,
  socialLinks,
} from "@/content/site";
import { useLang } from "@/lib/lang";
import { Container } from "./ui";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 border-t border-border bg-sand">
      <div className="saffron-rule" aria-hidden="true" />
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt={t(org.name)}
              className="h-12 w-12 shrink-0 rounded-full border border-primary/40 object-cover shadow-sm"
            />
            <div>
              <h3 className="text-base font-semibold leading-tight text-maroon">{t(org.name)}</h3>
              <p className="text-xs text-muted-foreground">{t(org.gurukul)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-maroon">{t(org.greeting)}</p>
        </div>

        <nav aria-label={t({ mr: "त्वरित दुवे", en: "Quick links" })}>
          <h3 className="text-base">{t({ mr: "त्वरित दुवे", en: "Quick links" })}</h3>
          <ul className="mt-3 grid gap-1.5 text-sm">
            {nav.slice(1, 8).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted-foreground hover:text-maroon">
                  {t(n.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t({ mr: "इतर", en: "More" })}>
          <h3 className="text-base">{t({ mr: "इतर", en: "More" })}</h3>
          <ul className="mt-3 grid gap-1.5 text-sm">
            {[...nav.slice(8), ...secondaryNav].map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted-foreground hover:text-maroon">
                  {t(n.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-base">{t({ mr: "संपर्क", en: "Contact" })}</h3>
          <address className="mt-3 text-sm text-muted-foreground not-italic">
            {t(org.address)}
            <br />

            {t({ mr: "दूरध्वनी", en: "Phone" })}:{" "}
            <a
              href={`tel:${PLACEHOLDER.phone.en}`}
              className="hover:text-maroon"
            >
              {t(PLACEHOLDER.phone)}
            </a>

            <br />

            {t({ mr: "ई-मेल", en: "E-mail" })}:{" "}
            <a
              href={`mailto:${PLACEHOLDER.email.en.trim()}`}
              className="hover:text-maroon"
            >
              {t(PLACEHOLDER.email)}
            </a>
          </address>
          <ul className="mt-3 flex gap-3 text-sm">
            <li>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-maroon"
              >
                YouTube
              </a>
            </li>

            <li>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-maroon"
              >
                Facebook
              </a>
            </li>

            <li>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-maroon"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center gap-2 py-4 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>© {year} {t(org.name)}. {t({ mr: "सर्व हक्क राखीव.", en: "All rights reserved." })}</p>
          <Link to="/privacy" className="hover:text-maroon">
            {t({ mr: "गोपनीयता धोरण", en: "Privacy Policy" })}
          </Link>
        </Container>
      </div>
    </footer>
  );
}
