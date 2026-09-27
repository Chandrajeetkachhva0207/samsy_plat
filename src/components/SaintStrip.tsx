import { saints } from "@/content/site";
import { useLang } from "@/lib/lang";
import { FadeIn } from "./FadeIn";

export function SaintStrip({ eager = false }: { eager?: boolean }) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {saints.map((s, i) => (
        <FadeIn key={s.src} delay={i * 120} className="h-full">
          <figure className="card-soft flex h-full flex-col overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-primary/40">
            <div className="flex-1 bg-gradient-to-b from-sand/50 via-sand/30 to-sand/60 p-3 sm:p-4">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-amber-900/10 bg-white shadow-xs">
                <img
                  src={s.src}
                  alt={t(s.name)}
                  width={800}
                  height={1000}
                  loading={eager ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-103"
                />
              </div>
            </div>
            <figcaption className="border-t border-border bg-card px-4 py-3.5 text-center text-sm font-bold text-maroon">
              {t(s.name)}
            </figcaption>
          </figure>
        </FadeIn>
      ))}
    </div>
  );
}
