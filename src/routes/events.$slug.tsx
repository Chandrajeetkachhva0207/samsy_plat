import {
  createFileRoute,
  Link,
  notFound,
} from "@tanstack/react-router";

import {
  Card,
  EditableNote,
  PageHeader,
  Section,
} from "@/components/ui";

import {
  events,
  formatEventDate,
  normalizeEvent,
} from "@/content/events";

import { useLang } from "@/lib/lang";
import { api } from "@/lib/api";

export const Route = createFileRoute(
  "/events/$slug"
)({
  loader: async ({ params }) => {
    try {
      const res = await api.getEvents();

      if (
        res.success &&
        Array.isArray(res.data)
      ) {
        const parsed = res.data.map(
          normalizeEvent
        );

        const found = parsed.find(
          (e) => e.slug === params.slug
        );

        if (found) {
          return {
            event: found,
          };
        }
      }
    } catch (err) {
      console.error(
        "Failed to load event detail",
        err
      );
    }

    // Fallback for seeded/static events
    const fallback = events.find(
      (e) => e.slug === params.slug
    );

    if (!fallback) {
      throw notFound();
    }

    return {
      event: fallback,
    };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          {
            title:
              "कार्यक्रम उपलब्ध नाही | मा नर्मदा आध्यात्मिक गुरुकुल",
          },
          {
            name: "robots",
            content: "noindex",
          },
        ],
      };
    }

    const title = `${loaderData.event.title.mr} | मा नर्मदा आध्यात्मिक गुरुकुल`;

    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content:
            loaderData.event.description.mr,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content:
            loaderData.event.description.mr,
        },
        {
          property: "og:url",
          content: `/events/${loaderData.event.slug}`,
        },
      ],

      links: [
        {
          rel: "canonical",
          href: `/events/${loaderData.event.slug}`,
        },
      ],
    };
  },

  component: EventDetail,

  notFoundComponent: EventNotFound,
});

function EventNotFound() {
  const { t } = useLang();

  return (
    <Section>
      <div className="text-center">
        <h1 className="text-2xl">
          {t({
            mr: "कार्यक्रम सापडला नाही",
            en: "Event not found",
          })}
        </h1>

        <Link
          to="/events"
          className="mt-4 inline-block text-sm font-semibold text-maroon underline underline-offset-4"
        >
          {t({
            mr: "सर्व कार्यक्रम पहा",
            en: "See all events",
          })}
        </Link>
      </div>
    </Section>
  );
}

function getCategoryLabel(
  category: string,
  lang: "mr" | "en"
) {
  const categories: Record<
    string,
    { mr: string; en: string }
  > = {
    general: {
      mr: "सर्वसाधारण",
      en: "General",
    },

    cultural: {
      mr: "सांस्कृतिक",
      en: "Cultural",
    },

    religious: {
      mr: "धार्मिक / अध्यात्मिक",
      en: "Religious / Spiritual",
    },
  };

  const selected =
    categories[category] ||
    categories.general;

  return lang === "mr"
    ? selected.mr
    : selected.en;
}

function EventDetail() {
  const { t, lang } = useLang();

  const { event } =
    Route.useLoaderData();

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title={event.title}
        sub={{
          mr: "कार्यक्रमाची माहिती",
          en: "Event details",
        }}
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">

          {/* Main Event Information */}
          <Card>
            <h2 className="text-xl font-semibold text-maroon">
              {t({
                mr: "कार्यक्रमाविषयी",
                en: "About the event",
              })}
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">
              {t(event.description)}
            </p>
          </Card>

          {/* Event Details */}
          <Card>
            <h2 className="text-xl font-semibold text-maroon">
              {t({
                mr: "कार्यक्रमाची माहिती",
                en: "Event information",
              })}
            </h2>

            <dl className="mt-5 space-y-4 text-sm">

              {/* Date */}
              <div>
                <dt className="text-muted-foreground">
                  📅{" "}
                  {t({
                    mr: "तारीख",
                    en: "Date",
                  })}
                </dt>

                <dd className="mt-1 font-medium">
                  {formatEventDate(
                    event.date,
                    lang
                  )}
                </dd>
              </div>

              {/* Category */}
              <div>
                <dt className="text-muted-foreground">
                  🏷️{" "}
                  {t({
                    mr: "प्रकार",
                    en: "Category",
                  })}
                </dt>

                <dd className="mt-1 font-medium">
                  {getCategoryLabel(
                    event.category,
                    lang
                  )}
                </dd>
              </div>

              {/* Time */}
              {event.time && (
                <div>
                  <dt className="text-muted-foreground">
                    🕐{" "}
                    {t({
                      mr: "वेळ",
                      en: "Time",
                    })}
                  </dt>

                  <dd className="mt-1 font-medium">
                    {event.time}
                  </dd>
                </div>
              )}

              {/* Venue */}
              <div>
                <dt className="text-muted-foreground">
                  📍{" "}
                  {t({
                    mr: "स्थळ",
                    en: "Venue",
                  })}
                </dt>

                <dd className="mt-1 font-medium">
                  {t(event.venue)}
                </dd>
              </div>

              {/* Chief Person */}
              {event.people.mr && (
                <div>
                  <dt className="text-muted-foreground">
                    👤{" "}
                    {t({
                      mr: "प्रमुख व्यक्ती",
                      en: "Chief person",
                    })}
                  </dt>

                  <dd className="mt-1 font-medium">
                    {t(event.people)}
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </div>


        {/* Photos
        <div className="mt-10">
          <h2 className="text-lg text-maroon">
            {t({
              mr: "छायाचित्रे",
              en: "Photos",
            })}
          </h2>

          {event.photos.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {event.photos.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt={t(event.title)}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl object-cover shadow-sm"
                />
              ))}
            </div>
          ) : null}
        </div> */}

        {/* Back */}
        <div className="mt-8">
          <Link
            to="/events"
            className="text-sm font-semibold text-maroon underline underline-offset-4"
          >
            ←{" "}
            {t({
              mr: "सर्व कार्यक्रम",
              en: "All events",
            })}
          </Link>
        </div>

        <EditableNote />
      </Section>
    </>
  );
}