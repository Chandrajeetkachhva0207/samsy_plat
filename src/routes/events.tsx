import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section, SectionTitle } from "@/components/ui";
import { formatEventDate, splitEvents, type EventItem } from "@/content/events";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "कार्यक्रम | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content:
          "गुरुकुलातील येणारे व झालेले कार्यक्रम — कीर्तन, प्रवचन, संस्कार शिबिरे, सोहळे व सांस्कृतिक कार्यक्रम.",
      },
      { property: "og:title", content: "कार्यक्रम | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "येणारे व झालेले कार्यक्रम, तारीख, वेळ व ठिकाणासह." },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: Events,
});

function EventCard({ e }: { e: EventItem }) {
  const { t, lang } = useLang();
  return (
    <Card>
      <p className="text-sm font-semibold text-maroon">{formatEventDate(e.date, lang)}</p>
      <h3 className="mt-1 text-base">{t(e.title)}</h3>
      <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
        <div className="flex gap-2">
          <dt className="shrink-0">🕉 {t({ mr: "वेळ:", en: "Time:" })}</dt>
          <dd>{e.time}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0">📍 {t({ mr: "ठिकाण:", en: "Venue:" })}</dt>
          <dd>{t(e.venue)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0">👤 {t({ mr: "प्रमुख:", en: "Chief:" })}</dt>
          <dd>{t(e.people)}</dd>
        </div>
      </dl>
      <Link
        to="/events/$slug"
        params={{ slug: e.slug }}
        className="mt-3 inline-block text-sm font-semibold text-maroon underline underline-offset-4"
      >
        {t({ mr: "संपूर्ण माहिती", en: "Full details" })}
      </Link>
    </Card>
  );
}

function Events() {
  const { t } = useLang();
  const { upcoming, past } = splitEvents();

  return (
    <>
      <PageHeader
        title={{ mr: "कार्यक्रम", en: "Events" }}
        sub={{
          mr: "गुरुकुलातील येणारे व झालेले कार्यक्रम.",
          en: "Upcoming and past programmes at the gurukul.",
        }}
      />
      <Section>
        {upcoming.length ? (
          <SectionTitle title={{ mr: "येणारे कार्यक्रम", en: "Upcoming events" }} />
        ) : (
          <SectionTitle
            title={{ mr: "येणारे कार्यक्रम", en: "Upcoming events" }}
            sub={{
              mr: "सध्या कोणताही कार्यक्रम नोंदवलेला नाही.",
              en: "No events are listed at the moment.",
            }}
          />
        )}
        {upcoming.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.slug} e={e} />
            ))}
          </div>
        ) : null}
        <EditableNote />
      </Section>
      <Section tone="sand">
        <SectionTitle title={{ mr: "झालेले कार्यक्रम", en: "Past events" }} />
        {past.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.slug} e={e} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-muted-foreground">
            {t({ mr: "नोंद उपलब्ध नाही.", en: "No records available." })}
          </p>
        )}
      </Section>
    </>
  );
}
