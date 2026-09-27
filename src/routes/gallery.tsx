import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditableNote, PageHeader, Section } from "@/components/ui";
import { galleryCategories } from "@/content/site";
import { useLang } from "@/lib/lang";
import { api, API_ORIGIN } from "@/lib/api";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      {
        title: "फोटो गॅलरी | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        name: "description",
        content:
          "गुरुकुल, विद्यार्थी, कीर्तन, वारकरी व सांस्कृतिक कार्यक्रमांची छायाचित्रे विभागानुसार.",
      },
      {
        property: "og:title",
        content:
          "फोटो गॅलरी | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        property: "og:description",
        content:
          "गुरुकुलातील उपक्रम व कार्यक्रमांची छायाचित्रे.",
      },
      {
        property: "og:url",
        content: "/gallery",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/gallery",
      },
    ],
  }),
  component: Gallery,
});

interface GalleryItem {
  _id: string;

  image?: string;
  imageUrl?: string;
  url?: string;

  category?: string;

  caption?:
    | {
        mr?: string;
        en?: string;
      }
    | string;

  isActive?: boolean;
}

/* =====================================================
   GET TEXT
===================================================== */

const getText = (
  value:
    | string
    | {
        mr?: string;
        en?: string;
      }
    | undefined,
  language: "mr" | "en"
) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return (
    value[language] ||
    value.mr ||
    value.en ||
    ""
  );
};

/* =====================================================
   GET CATEGORY KEY
===================================================== */

const getCategoryKey = (categoryMr: string) => {
  switch (categoryMr) {
    case "सर्व":
      return "all";

    case "विद्यार्थी":
      return "students";

    case "कार्यक्रम":
      return "events";

    case "सुविधा":
      return "facilities";

    case "सामान्य":
      return "general";

    default:
      return categoryMr;
  }
};

/* =====================================================
   IMAGE URL RESOLVER
===================================================== */

function getUploadedImageUrl(
  image?: string | null
): string {
  if (!image) {
    return "";
  }

  const value = image.trim();

  if (!value) {
    return "";
  }

  /* ---------------------------------------------
     1. Already a complete URL
     Example:
     http://localhost:5000/uploads/photo.jpg
     https://example.com/photo.jpg
  --------------------------------------------- */

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  /* ---------------------------------------------
     2. Already starts with /uploads/
  --------------------------------------------- */

  if (value.startsWith("/uploads/")) {
    return `${API_ORIGIN}${value}`;
  }

  /* ---------------------------------------------
     3. Starts with uploads/
  --------------------------------------------- */

  if (value.startsWith("uploads/")) {
    return `${API_ORIGIN}/${value}`;
  }

  /* ---------------------------------------------
     4. Starts with /images/
     These are frontend static images.
  --------------------------------------------- */

  if (value.startsWith("/images/")) {
    return value;
  }

  /* ---------------------------------------------
     5. Starts with /assets/
  --------------------------------------------- */

  if (value.startsWith("/assets/")) {
    return value;
  }

  /* ---------------------------------------------
     6. Plain uploaded filename
     Example:
     1758701234567-photo.jpg

     Backend uploads are served from:
     /uploads/filename
  --------------------------------------------- */

  return `${API_ORIGIN}/uploads/${value}`;
}

/* =====================================================
   GET IMAGE FROM GALLERY ITEM
===================================================== */

function getGalleryItemImage(
  item: GalleryItem
): string {
  const source =
    item.image ||
    item.imageUrl ||
    item.url ||
    "";

  return getUploadedImageUrl(source);
}

/* =====================================================
   GALLERY PAGE
===================================================== */

function Gallery() {
  const { t, lang } = useLang();

  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [active, setActive] =
    useState("सर्व");

  const [lightbox, setLightbox] =
    useState<number | null>(null);

  /* ===================================================
     LOAD GALLERY
  =================================================== */

  const loadGallery = async () => {
    try {
      setLoading(true);

      const response = await api.getGallery();

      console.log(
        "Gallery API response:",
        response
      );

      if (
        response?.success &&
        Array.isArray(response.data)
      ) {
        const activePhotos =
          response.data.filter(
            (item: GalleryItem) =>
              item.isActive !== false
          );

        console.log(
          "Gallery photos:",
          activePhotos
        );

        setGallery(activePhotos);
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error(
        "Failed to load public gallery:",
        error
      );

      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  /* ===================================================
     CATEGORY FILTER
  =================================================== */

  const activeCategoryKey =
    getCategoryKey(active);

  const photos =
    activeCategoryKey === "all"
      ? gallery
      : gallery.filter(
          (photo) =>
            photo.category ===
            activeCategoryKey
        );

  /* ===================================================
     LIGHTBOX KEYBOARD
  =================================================== */

  useEffect(() => {
    if (lightbox === null) {
      return;
    }

    const onKey = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    };

    window.addEventListener(
      "keydown",
      onKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKey
      );
    };
  }, [lightbox]);

  /* ===================================================
     CURRENT PHOTO
  =================================================== */

  const current =
    lightbox === null
      ? null
      : photos[lightbox];

  return (
    <>
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <PageHeader
        title={{
          mr: "फोटो गॅलरी",
          en: "Photo Gallery",
        }}
        sub={{
          mr:
            "विभाग निवडून छायाचित्रे पहा. छायाचित्रावर क्लिक केल्यास मोठे दिसेल.",
          en:
            "Pick a category to browse. Click a photo to view it larger.",
        }}
      />

      {/* =================================================
          GALLERY
      ================================================= */}

      <Section>
        {/* CATEGORY BUTTONS */}

        <div className="flex flex-wrap justify-center gap-2">
          {galleryCategories.map((category) => {
            const isActive =
              active === category.mr;

            return (
              <button
                key={category.en}
                type="button"
                onClick={() => {
                  setActive(category.mr);
                  setLightbox(null);
                }}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/40 bg-card text-maroon hover:bg-accent"
                }`}
              >
                {t(category)}
              </button>
            );
          })}
        </div>

        {/* LOADING */}

        {loading ? (
          <p className="mt-8 text-center text-muted-foreground">
            {t({
              mr: "गॅलरी लोड होत आहे...",
              en: "Loading gallery...",
            })}
          </p>
        ) : photos.length ? (
          /* =================================================
             PHOTO GRID
          ================================================= */

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => {
              const imageUrl =
                getGalleryItemImage(photo);

              const caption =
                getText(
                  photo.caption,
                  lang
                ) ||
                t({
                  mr: "गॅलरी फोटो",
                  en: "Gallery Photo",
                });

              return (
                <button
                  key={
                    photo._id + index
                  }
                  type="button"
                  onClick={() =>
                    setLightbox(index)
                  }
                  className="group overflow-hidden rounded-xl border border-border bg-card text-left shadow-soft"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-4/3 w-full overflow-hidden bg-sand/30">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={caption}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        onError={(event) => {
                          console.error(
                            "Gallery image failed to load:",
                            imageUrl
                          );

                          /*
                           IMPORTANT:
                           Do NOT replace the uploaded
                           image with hero-gurukul.jpg.

                           This keeps the actual problem
                           visible instead of hiding it.
                          */

                          event.currentTarget.style.display =
                            "none";

                          const parent =
                            event.currentTarget
                              .parentElement;

                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex h-full w-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                                ${
                                  lang === "mr"
                                    ? "फोटो लोड करता आला नाही"
                                    : "Unable to load photo"
                                }
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                        {t({
                          mr: "फोटो उपलब्ध नाही",
                          en: "Photo not available",
                        })}
                      </div>
                    )}
                  </div>

                  {/* CAPTION */}

                  <p className="px-4 py-3 text-sm text-muted-foreground">
                    {caption}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          /* =================================================
             EMPTY
          ================================================= */

          <p className="mt-8 text-center text-muted-foreground">
            {t({
              mr:
                "या विभागातील छायाचित्रे प्रशासनाकडून जोडली जातील.",
              en:
                "Photos for this category will be added by the administration.",
            })}
          </p>
        )}

        {/* NOTE */}

        <EditableNote
          text={{
            mr:
              "विद्यार्थ्यांची छायाचित्रे केवळ योग्य संमती मिळाल्यावरच प्रसिद्ध केली जातील. नवीन छायाचित्रे प्रशासनाकडून जोडली जातील.",
            en:
              "Student photos are published only with proper consent. New photos will be added by the administration.",
          }}
        />
      </Section>

      {/* =================================================
          LIGHTBOX
      ================================================= */}

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={getText(
            current.caption,
            lang
          )}
          onClick={() =>
            setLightbox(null)
          }
          className="fixed inset-0 z-50 flex items-center justify-center bg-maroon/80 p-4"
        >
          <div
            className="max-h-full w-full max-w-3xl overflow-auto rounded-2xl bg-card p-3"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* LIGHTBOX IMAGE */}

            {getGalleryItemImage(
              current
            ) ? (
              <img
                src={getGalleryItemImage(
                  current
                )}
                alt={
                  getText(
                    current.caption,
                    lang
                  ) || "Gallery photo"
                }
                className="w-full rounded-xl object-contain"
                onError={(event) => {
                  console.error(
                    "Lightbox image failed to load:",
                    getGalleryItemImage(
                      current
                    )
                  );

                  event.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
                {t({
                  mr: "फोटो उपलब्ध नाही",
                  en: "Photo not available",
                })}
              </div>
            )}

            {/* CAPTION + CLOSE */}

            <div className="flex items-center justify-between gap-4 px-2 py-3">
              <p className="text-sm text-muted-foreground">
                {getText(
                  current.caption,
                  lang
                )}
              </p>

              <button
                type="button"
                onClick={() =>
                  setLightbox(null)
                }
                className="rounded-full border border-primary/50 px-4 py-1.5 text-sm font-semibold text-maroon"
              >
                {t({
                  mr: "बंद करा",
                  en: "Close",
                })}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}