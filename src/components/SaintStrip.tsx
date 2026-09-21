import { saints } from "@/content/site";
import { useLang } from "@/lib/lang";
import { FadeIn } from "./FadeIn";

export function SaintStrip({ eager = false }: { eager?: boolean }) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {saints.map((s, i) => (
        <FadeIn key={s.src} delay={i * 120}>
          <figure className="card-soft overflow-hidden">
            <div className="bg-sand p-3">
              <img
                src={s.src}
                alt={t(s.name)}
                width={1024}
                height={1024}
                loading={eager ? "eager" : "lazy"}
                decoding="async"
                className="mx-auto h-auto w-full rounded-lg object-contain"
              />
            </div>
            <figcaption className="border-t border-border px-4 py-3 text-center text-sm font-semibold text-maroon">
              {t(s.name)}
            </figcaption>
          </figure>
        </FadeIn>
      ))}
    </div>
  );
}
