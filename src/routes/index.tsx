import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import heroImg from "@/assets/hero-gurukul.jpg";
import { FadeIn } from "@/components/FadeIn";
import { SaintStrip } from "@/components/SaintStrip";

import {
  Card,
  Container,
  MalaDivider,
  OutlineLink,
  PrimaryLink,
  Section,
  SectionTitle,
} from "@/components/ui";

import {
  galleryPhotos,
  homeIntro,
  org,
  timeline,
} from "@/content/site";

import { api } from "@/lib/api";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/")({
head: () => ({
  meta: [
    {
      title:
        "Maa Narmada Sanstha Alandi | Maa Narmada Gurukul, Alandi Devachi",
    },
    {
      name: "description",
      content:
        "Maa Narmada Sanstha and Maa Narmada Gurukul, Alandi Devachi, Pune. Education, संस्कार, spirituality and Warkari tradition for students.",
    },
    {
      property: "og:title",
      content:
        "Maa Narmada Sanstha Alandi | Maa Narmada Gurukul",
    },
    {
      property: "og:description",
      content:
        "Official website of Maa Narmada Sanstha and Maa Narmada Gurukul, Alandi Devachi, Pune.",
    },
    {
      property: "og:url",
      content: "/",
    },
  ],

  links: [
    {
      rel: "icon",
      type: "image/jpeg",
      href: "/favicon.jpg",
    },
    {
      rel: "canonical",
      href: "/",
    },
  ],
}),

  component: Home,
});

function Home() {
  const { t, lang } = useLang();

  /* =========================================
     UPCOMING EVENTS
     FETCH FROM BACKEND
     SHOW ONLY 3
  ========================================= */

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const loadUpcomingEvents = async () => {
      try {
        setEventsLoading(true);

        const res = await api.getEvents();

        if (res.success && Array.isArray(res.data)) {
          const today = new Date();

          today.setHours(0, 0, 0, 0);

          const upcoming = res.data
            .filter((event: any) => {
              if (event.isActive === false) {
                return false;
              }

              if (!event.date) {
                return false;
              }

              const eventDate = new Date(event.date);

              if (Number.isNaN(eventDate.getTime())) {
                return false;
              }

              return eventDate >= today;
            })
            .sort(
              (a: any, b: any) =>
                new Date(a.date).getTime() -
                new Date(b.date).getTime()
            );

          // Only 3 upcoming events on Home
          setUpcomingEvents(upcoming.slice(0, 3));
        } else {
          setUpcomingEvents([]);
        }
      } catch (error) {
        console.error(
          "Failed to load upcoming events:",
          error
        );

        setUpcomingEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    loadUpcomingEvents();
  }, []);

  return (
    <>
      {/* =========================================
          HERO
      ========================================= */}

      <section className="relative">
        <div className="relative h-[52vh] min-h-[320px] w-full overflow-hidden sm:h-[62vh]">
          <img
            src={heroImg}
            alt={t({
              mr: "गुरुकुलातील विद्यार्थी सकाळच्या प्रकाशात अभ्यास करताना",
              en: "Gurukul students studying in the morning light",
            })}
            width={1600}
            height={1008}
            className="h-full w-full object-cover"
          />

          <div
            className="absolute inset-0 bg-maroon/55"
            aria-hidden="true"
          />

          <Container className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <img
              src="/images/logo.jpg"
              alt={t(org.name)}
              className="mb-3 h-16 w-16 rounded-full border-2 border-amber-300/80 object-cover shadow-lg sm:h-20 sm:w-20"
            />

            <p className="text-sm tracking-wide text-primary-foreground/90">
              {t(org.greeting)}
            </p>

            <h1 className="mt-2 max-w-3xl text-2xl text-primary-foreground sm:text-4xl">
              {t(org.name)}
            </h1>

            <p className="mt-2 font-display text-lg text-primary-foreground/95 sm:text-xl">
              {t(org.gurukul)}
            </p>

            <p className="mt-3 text-sm text-primary-foreground/90 sm:text-base">
              {t(org.tagline)}
            </p>

            <p className="mt-2 text-sm text-primary-foreground/90">
              {t(org.greeting2)}
            </p>
          </Container>
        </div>

        <Container className="-mt-8 relative z-10">
          <div className="card-soft grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            <PrimaryLink to="/about">
              {t({
                mr: "संस्थाविषयी",
                en: "About us",
              })}
            </PrimaryLink>

            <OutlineLink to="/gurukul">
              {t({
                mr: "दैनिक दिनचर्या",
                en: "Daily Routine",
              })}
            </OutlineLink>

            <OutlineLink to="/activities">
              {t({
                mr: "गुरुकुलाचे उपक्रम",
                en: "Activities",
              })}
            </OutlineLink>

            <OutlineLink to="/support">
              {t({
                mr: "सहकार्य करा",
                en: "Support us",
              })}
            </OutlineLink>

            <OutlineLink to="/contact">
              {t({
                mr: "संपर्क करा",
                en: "Contact",
              })}
            </OutlineLink>
          </div>
        </Container>
      </section>

      {/* =========================================
          INTRO
      ========================================= */}

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed">
            {t(homeIntro)}
          </p>
        </div>

        <MalaDivider />
      </Section>

      {/* =========================================
          SAINTS
      ========================================= */}

      <Section tone="sand">
        <SectionTitle
          title={{
            mr: "संतपरंपरा",
            en: "Our Inspiration",
          }}
          sub={{
            mr: "आमच्या कार्याची प्रेरणा",
            en: "The inspiration behind our work",
          }}
        />

        <div className="mt-8">
          <SaintStrip />
        </div>
      </Section>

      {/* =========================================
          KEY ACTIVITIES
          BUTTON ONLY
      ========================================= */}

      <Section>
        <SectionTitle
          title={{
            mr: "प्रमुख उपक्रम",
            en: "Key Activities",
          }}
          sub={{
            mr: "गुरुकुलातील विविध शैक्षणिक, आध्यात्मिक आणि सांस्कृतिक उपक्रम",
            en: "Educational, spiritual and cultural activities of the Gurukul",
          }}
        />

        <div className="mt-8 text-center">
          <OutlineLink to="/activities">
            {t({
              mr: "सर्व उपक्रम पहा",
              en: "View all activities",
            })}
          </OutlineLink>
        </div>
      </Section>

      {/* =========================================
          FOUNDER
      ========================================= */}

      <Section tone="sand">
        <div className="card-soft mx-auto flex max-w-3xl flex-col items-center gap-6 p-6 text-center sm:flex-row sm:text-left">
          <img
            src="/images/founder.jpg"
            alt={t(org.founder)}
            className="h-28 w-28 shrink-0 rounded-full border-2 border-primary/40 object-cover object-top shadow-md"
          />

          <div>
            <h3 className="text-xl">
              {t(org.founder)}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {t(org.founderRole)}
            </p>

            <div className="mt-4">
              <OutlineLink to="/founder">
                {t({
                  mr: "अधिक माहिती",
                  en: "Read more",
                })}
              </OutlineLink>
            </div>
          </div>
        </div>
      </Section>

      {/* =========================================
          12 YEAR JOURNEY
      ========================================= */}

      <Section>
        <SectionTitle
          title={{
            mr: "१२ वर्षांचा प्रवास",
            en: "A journey of 12 years",
          }}
        />

        <ol className="mx-auto mt-8 max-w-3xl border-l-2 border-primary/30 pl-6 sm:pl-8 space-y-6">
          {timeline.map((m, i) => (
            <FadeIn
              key={i}
              delay={i * 80}
            >
              <li className="relative pb-2 group">
                <span
                  className="absolute -left-[37px] sm:-left-[45px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md ring-4 ring-background transition-transform group-hover:scale-110"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>

                <div className="rounded-2xl border border-primary/15 bg-card/90 p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-primary font-marathi">
                    {t(m.year)}
                  </h3>

                  <p className="mt-2 text-foreground/85 leading-relaxed text-sm sm:text-base">
                    {t(m.text)}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      </Section>

      {/* =========================================
          UPCOMING EVENTS
          ONLY 3
      ========================================= */}

      <Section tone="sand">
        <SectionTitle
          title={{
            mr: "आगामी कार्यक्रम",
            en: "Upcoming Events",
          }}
          sub={{
            mr: "गुरुकुलातील आगामी कार्यक्रम व उपक्रम",
            en: "Upcoming events and activities at the Gurukul",
          }}
        />

        {eventsLoading ? (
          <div className="mt-8 py-8 text-center text-sm text-muted-foreground">
            {t({
              mr: "कार्यक्रम लोड होत आहेत...",
              en: "Loading upcoming events...",
            })}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {upcomingEvents.map(
                (event: any, index: number) => {
                  const title =
                    typeof event.title === "string"
                      ? event.title
                      : event.title?.[lang] ||
                      event.title?.mr ||
                      event.title?.en ||
                      event.eventName ||
                      "कार्यक्रम";

                  const venue =
                    typeof event.venue === "string"
                      ? event.venue
                      : event.venue?.[lang] ||
                      event.venue?.mr ||
                      event.venue?.en ||
                      event.location ||
                      "";

                  const eventDate = new Date(
                    event.date
                  );

                  const description =
                    typeof event.description === "string"
                      ? event.description
                      : event.description?.[lang] ||
                      event.description?.mr ||
                      event.description?.en ||
                      "";

                  return (
                    <FadeIn
                      key={
                        event._id ||
                        event.id ||
                        index
                      }
                      delay={index * 80}
                    >
                      <Card className="flex h-full flex-col">
                        <p className="text-sm font-semibold text-primary">
                          {eventDate.toLocaleDateString(
                            lang === "mr"
                              ? "mr-IN"
                              : "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                          {title}
                        </h3>

                        {venue ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {venue}
                          </p>
                        ) : null}

                        {description ? (
                          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                            {description}
                          </p>
                        ) : null}
                      </Card>
                    </FadeIn>
                  );
                }
              )}
            </div>

            <div className="mt-8 text-center">
              <OutlineLink to="/events">
                {t({
                  mr: "सर्व कार्यक्रम पहा",
                  en: "View all events",
                })}
              </OutlineLink>
            </div>
          </>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {t({
                mr: "सध्या आगामी कार्यक्रम नाहीत.",
                en: "No upcoming events at present.",
              })}
            </p>

            <div className="mt-5">
              <OutlineLink to="/events">
                {t({
                  mr: "सर्व कार्यक्रम पहा",
                  en: "View all events",
                })}
              </OutlineLink>
            </div>
          </div>
        )}
      </Section>

      {/* =========================================
          GALLERY PREVIEW
      ========================================= */}

      <Section>
        <SectionTitle
          title={{
            mr: "फोटो गॅलरी",
            en: "Photo Gallery",
          }}
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {galleryPhotos
            .slice(0, 4)
            .map((p) => (
              <img
                key={p.src}
                src={p.src}
                alt={t(p.caption)}
                loading="lazy"
                decoding="async"
                width={600}
                height={600}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <OutlineLink to="/gallery">
            {t({
              mr: "संपूर्ण गॅलरी",
              en: "Full gallery",
            })}
          </OutlineLink>

          <OutlineLink to="/videos">
            {t({
              mr: "व्हिडिओ पहा",
              en: "Watch videos",
            })}
          </OutlineLink>
        </div>
      </Section>

      {/* =========================================
          SUPPORT
      ========================================= */}

      <Section tone="sand">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl">
            {t({
              mr: "सहकार्याचे आवाहन",
              en: "An appeal for support",
            })}
          </h2>

          <p className="mt-4 text-lg">
            {t({
              mr: "विद्यार्थ्यांच्या शिक्षण, संस्कार आणि गुरुकुलाच्या विकासासाठी समाजातील हितचिंतकांचे सहकार्य आवश्यक आहे.",
              en: "The support of well-wishers is needed for the students' education, values and the growth of the gurukul.",
            })}
          </p>

          <div className="mt-6">
            <PrimaryLink to="/support">
              {t({
                mr: "सहकार्य करा / देणगी",
                en: "Support / Donate",
              })}
            </PrimaryLink>
          </div>
        </div>
      </Section>
    </>
  );
}