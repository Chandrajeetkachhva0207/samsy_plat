import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditableNote, PageHeader, Section } from "@/components/ui";
import { galleryCategories, galleryPhotos } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "फोटो गॅलरी | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content:
          "गुरुकुल, विद्यार्थी, कीर्तन, वारकरी व सांस्कृतिक कार्यक्रमांची छायाचित्रे विभागानुसार.",
      },
      { property: "og:title", content: "फोटो गॅलरी | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "गुरुकुलातील उपक्रम व कार्यक्रमांची छायाचित्रे." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const { t } = useLang();
  const [active, setActive] = useState("सर्व");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const photos =
    active === "सर्व" ? galleryPhotos : galleryPhotos.filter((p) => p.category === active);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const current = lightbox === null ? null : photos[lightbox];

  return (
    <>
      <PageHeader
        title={{ mr: "फोटो गॅलरी", en: "Photo Gallery" }}
        sub={{
          mr: "विभाग निवडून छायाचित्रे पहा. छायाचित्रावर क्लिक केल्यास मोठे दिसेल.",
          en: "Pick a category to browse. Click a photo to view it larger.",
        }}
      />
      <Section>
        <div className="flex flex-wrap justify-center gap-2">
          {galleryCategories.map((c) => {
            const isActive = active === c.mr;
            return (
              <button
                key={c.en}
                onClick={() => {
                  setActive(c.mr);
                  setLightbox(null);
                }}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/40 bg-card text-maroon hover:bg-accent"
                }`}
              >
                {t(c)}
              </button>
            );
          })}
        </div>

        {photos.length ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p, i) => (
              <button
                key={p.src + i}
                onClick={() => setLightbox(i)}
                className="group overflow-hidden rounded-xl border border-border bg-card text-left shadow-soft"
              >
                <img
                  src={p.src}
                  alt={t(p.caption)}
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <p className="px-4 py-3 text-sm text-muted-foreground">{t(p.caption)}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-muted-foreground">
            {t({
              mr: "या विभागातील छायाचित्रे प्रशासनाकडून जोडली जातील.",
              en: "Photos for this category will be added by the administration.",
            })}
          </p>
        )}

        <EditableNote
          text={{
            mr: "विद्यार्थ्यांची छायाचित्रे केवळ योग्य संमती मिळाल्यावरच प्रसिद्ध केली जातील. नवीन छायाचित्रे प्रशासनाकडून जोडली जातील.",
            en: "Student photos are published only with proper consent. New photos will be added by the administration.",
          }}
        />
      </Section>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(current.caption)}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-maroon/80 p-4"
        >
          <div className="max-h-full w-full max-w-3xl overflow-auto rounded-2xl bg-card p-3">
            <img
              src={current.src}
              alt={t(current.caption)}
              className="w-full rounded-xl object-contain"
            />
            <div className="flex items-center justify-between gap-4 px-2 py-3">
              <p className="text-sm text-muted-foreground">{t(current.caption)}</p>
              <button
                onClick={() => setLightbox(null)}
                className="rounded-full border border-primary/50 px-4 py-1.5 text-sm font-semibold text-maroon"
              >
                {t({ mr: "बंद करा", en: "Close" })}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
