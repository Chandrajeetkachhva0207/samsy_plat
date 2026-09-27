import React, { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";

import {
  Card,
  EditableNote,
  PageHeader,
  Section,
  SectionTitle,
} from "@/components/ui";

import {
  formatEventDate,
  normalizeEvent,
  splitEventList,
  type EventItem,
} from "@/content/events";

import { useLang } from "@/lib/lang";
import { api } from "@/lib/api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      {
        title: "कार्यक्रम | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        name: "description",
        content:
          "गुरुकुलातील येणारे व झालेले कार्यक्रम — कीर्तन, प्रवचन, संस्कार शिबिरे, सोहळे व सांस्कृतिक कार्यक्रम.",
      },
      {
        property: "og:title",
        content: "कार्यक्रम | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        property: "og:description",
        content:
          "येणारे व झालेले कार्यक्रम, तारीख, वेळ व ठिकाणासह.",
      },
      {
        property: "og:url",
        content: "/events",
      },
    ],

    links: [
      {
        rel: "canonical",
        href: "/events",
      },
    ],
  }),

  component: Events,
});

function EventCard({ e }: { e: EventItem }) {
  const { t, lang } = useLang();

  return (
    <Card className="h-full">
      {/* DATE */}
      <p className="text-sm font-semibold text-maroon">
        {formatEventDate(e.date, lang)}
      </p>

      {/* TITLE */}
      <h3 className="mt-1 text-base font-semibold">
        {t(e.title)}
      </h3>

      {/* DETAILS */}
      <dl className="mt-3 space-y-2 text-sm text-muted-foreground">

        {/* TIME */}
        {e.time && (
          <div className="flex gap-2">
            <dt className="shrink-0">
              🕉 {t({ mr: "वेळ:", en: "Time:" })}
            </dt>

            <dd>{e.time}</dd>
          </div>
        )}

        {/* VENUE */}
        <div className="flex gap-2">
          <dt className="shrink-0">
            📍 {t({ mr: "ठिकाण:", en: "Venue:" })}
          </dt>

          <dd>{t(e.venue)}</dd>
        </div>

        {/* CHIEF / SPEAKER */}
        {e.people.mr && (
          <div className="flex gap-2">
            <dt className="shrink-0">
              👤 {t({ mr: "प्रमुख:", en: "Chief:" })}
            </dt>

            <dd>{t(e.people)}</dd>
          </div>
        )}
      </dl>

      {/* DESCRIPTION PREVIEW */}
      {e.description.mr && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {t(e.description)}
        </p>
      )}

      {/* DETAILS BUTTON */}
      <Link
        to="/events/$slug"
        params={{ slug: e.slug }}
        className="mt-4 inline-block text-sm font-semibold text-maroon underline underline-offset-4"
      >
        {t({
          mr: "संपूर्ण माहिती",
          en: "Full details",
        })}
      </Link>
    </Card>
  );
}

function Events() {
  const { t } = useLang();

  /*
   * IMPORTANT:
   * If URL is /events/:slug,
   * show the child route (/events/$slug)
   * instead of showing the events listing again.
   */
  const location = useLocation();

  const isEventDetailPage =
    location.pathname.startsWith("/events/") &&
    location.pathname !== "/events";

  const [eventList, setEventList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.getEvents();

        console.log("Public Events API response:", res);

        if (!mounted) return;

        if (res.success && Array.isArray(res.data)) {
          const parsed = res.data.map(normalizeEvent);

          console.log("Normalized events:", parsed);

          setEventList(parsed);
        } else {
          setEventList([]);
          setError("कार्यक्रमांची माहिती उपलब्ध नाही.");
        }
      } catch (err) {
        console.error("Failed to load events:", err);

        if (mounted) {
          setEventList([]);
          setError(
            "कार्यक्रम लोड करताना समस्या आली. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * VERY IMPORTANT
   *
   * When URL is:
   * /events/6ab40624f09e2a1341aa78d6
   *
   * render the child route:
   * /events/$slug
   */
  if (isEventDetailPage) {
    return <Outlet />;
  }

  const { upcoming, past } = splitEventList(eventList);

  return (
    <>
      {/* PAGE HEADER */}
      <PageHeader
        title={{
          mr: "कार्यक्रम",
          en: "Events",
        }}
        sub={{
          mr: "गुरुकुलातील येणारे व झालेले कार्यक्रम.",
          en: "Upcoming and past programmes at the gurukul.",
        }}
      />

      {/* ERROR */}
      {error && (
        <Section>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            {error}
          </div>
        </Section>
      )}

      {/* LOADING */}
      {loading ? (
        <Section>
          <div className="py-12 text-center text-sm text-muted-foreground">
            कार्यक्रम लोड होत आहेत...
          </div>
        </Section>
      ) : (
        <>
          {/* UPCOMING EVENTS */}
          <Section>
            {upcoming.length > 0 ? (
              <SectionTitle
                title={{
                  mr: "येणारे कार्यक्रम",
                  en: "Upcoming events",
                }}
              />
            ) : (
              <SectionTitle
                title={{
                  mr: "येणारे कार्यक्रम",
                  en: "Upcoming events",
                }}
                sub={{
                  mr: "सध्या कोणताही आगामी कार्यक्रम नोंदवलेला नाही.",
                  en: "No upcoming events are listed at the moment.",
                }}
              />
            )}

            {upcoming.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard
                    key={event.slug}
                    e={event}
                  />
                ))}
              </div>
            )}

            <EditableNote />
          </Section>

          {/* PAST EVENTS */}
          <Section tone="sand">
            <SectionTitle
              title={{
                mr: "झालेले कार्यक्रम",
                en: "Past events",
              }}
            />

            {past.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <EventCard
                    key={event.slug}
                    e={event}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-center text-muted-foreground">
                {t({
                  mr: "नोंद उपलब्ध नाही.",
                  en: "No records available.",
                })}
              </p>
            )}
          </Section>
        </>
      )}
    </>
  );
}