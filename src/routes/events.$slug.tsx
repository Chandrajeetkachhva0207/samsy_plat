import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { events, formatEventDate } from "@/content/events";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = events.find((e) => e.slug === params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "कार्यक्रम उपलब्ध नाही | मा नर्मदा आध्यात्मिक गुरुकुल" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.event.title.mr} | मा नर्मदा आध्यात्मिक गुरुकुल`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.event.description.mr },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.event.description.mr },
        { property: "og:url", content: `/events/${loaderData.event.slug}` },
      ],
      links: [{ rel: "canonical", href: `/events/${loaderData.event.slug}` }],
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
        <h1 className="text-2xl">{t({ mr: "कार्यक्रम सापडला नाही", en: "Event not found" })}</h1>
        <Link
          to="/events"
          className="mt-4 inline-block text-sm font-semibold text-maroon underline underline-offset-4"
        >
          {t({ mr: "सर्व कार्यक्रम पहा", en: "See all events" })}
        </Link>
      </div>
    </Section>
  );
}

function EventDetail() {
  const { t, lang } = useLang();
  const { event } = Route.useLoaderData();

  const rows = [
    { label: { mr: "तारीख व वार", en: "Date & day" }, value: formatEventDate(event.date, lang) },
    { label: { mr: "वेळ", en: "Time" }, value: event.time },
    { label: { mr: "ठिकाण", en: "Venue" }, value: t(event.venue) },
    { label: { mr: "प्रमुख व्यक्ती", en: "Chief guests" }, value: t(event.people) },
  ];

  return (
    <>
      <PageHeader title={event.title} sub={{ mr: "कार्यक्रमाची माहिती", en: "Event details" }} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <h2 className="text-base">{t({ mr: "कार्यक्रमाविषयी", en: "About the event" })}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
              {t(event.description)}
            </p>
          </Card>
          <Card>
            <h2 className="text-base">{t({ mr: "थोडक्यात", en: "At a glance" })}</h2>
            <dl className="mt-3 space-y-3 text-sm">
              {rows.map((r) => (
                <div key={r.label.en}>
                  <dt className="text-muted-foreground">{t(r.label)}</dt>
                  <dd className="font-medium">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <h2 className="mt-10 text-lg">{t({ mr: "छायाचित्रे", en: "Photos" })}</h2>
        {event.photos.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {event.photos.map((src) => (
              <img
                key={src}
                src={src}
                alt={t(event.title)}
                loading="lazy"
                className="aspect-4/3 w-full rounded-xl object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {t({
              mr: "या कार्यक्रमाची छायाचित्रे प्रशासनाकडून जोडली जातील.",
              en: "Photos for this event will be added by the administration.",
            })}
          </p>
        )}

        <div className="mt-8">
          <Link
            to="/events"
            className="text-sm font-semibold text-maroon underline underline-offset-4"
          >
            ← {t({ mr: "सर्व कार्यक्रम", en: "All events" })}
          </Link>
        </div>
        <EditableNote />
      </Section>
    </>
  );
}
