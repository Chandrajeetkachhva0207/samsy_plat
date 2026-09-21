import { PLACEHOLDER } from "@/content/site";
import { useLang } from "@/lib/lang";

export function FloatingContact() {
  const { t } = useLang();
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-2 sm:right-6 sm:bottom-6">
      <a
        href={`https://wa.me/${PLACEHOLDER.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t({ mr: "व्हॉट्सअ‍ॅपवर संपर्क करा", en: "Contact on WhatsApp" })}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-xl shadow-[var(--shadow-card)] ring-1 ring-border"
      >
        <span aria-hidden="true">💬</span>
      </a>
      <a
        href="tel:+910000000000"
        aria-label={t({ mr: "दूरध्वनी करा", en: "Call" })}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground shadow-[var(--shadow-card)]"
      >
        <span aria-hidden="true">📞</span>
      </a>
    </div>
  );
}
