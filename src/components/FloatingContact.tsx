import { PLACEHOLDER } from "@/content/site";
import { useLang } from "@/lib/lang";
import { Phone } from "lucide-react";

export function FloatingContact() {
  const { t } = useLang();

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${PLACEHOLDER.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t({
          mr: "व्हॉट्सअ‍ॅपवर संपर्क करा",
          en: "Contact on WhatsApp",
        })}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7 fill-current"
          aria-hidden="true"
        >
          <path d="M19.11 17.41c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.57-1.49-1.84-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.11 2.82.14.18 1.92 2.94 4.65 4.12.65.28 1.15.45 1.54.58.65.21 1.24.18 1.7.11.52-.08 1.59-.65 1.81-1.27.23-.63.23-1.16.16-1.27-.07-.11-.25-.18-.52-.32z" />
          <path d="M16 3.2A12.8 12.8 0 0 0 5.02 22.6L3.2 28.8l6.36-1.77A12.8 12.8 0 1 0 16 3.2zm0 23.3c-2.03 0-4-.55-5.72-1.6l-.41-.25-3.77 1.05 1.03-3.68-.27-.42A10.62 10.62 0 1 1 16 26.5z" />
        </svg>
      </a>

      {/* Call */}
      <a
        href="tel:+917385501205"
        title="+91 73855 01205 / +91 79729 61607"
        aria-label={t({
          mr: "दूरध्वनी करा (+91 73855 01205 / +91 79729 61607)",
          en: "Call (+91 73855 01205 / +91 79729 61607)",
        })}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
      >
        <Phone
          className="h-6 w-6"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </a>
    </div>
  );
}