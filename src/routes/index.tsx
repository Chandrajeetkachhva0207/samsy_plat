import { createFileRoute, Link } from "@tanstack/react-router";
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
import { homeIntro, keyActivities, org, timeline } from "@/content/site";
import { formatEventDate, splitEvents } from "@/content/events";
import { galleryPhotos } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची | शिक्षण • संस्कार • अध्यात्म" },
      {
        name: "description",
        content:
          "आळंदी देवाची येथे गेल्या १२ वर्षांपासून विद्यार्थ्यांना शालेय शिक्षणासोबत आध्यात्मिक संस्कार व वारकरी परंपरेची ओळख.",
      },
      { property: "og:title", content: "मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची" },
      {
        property: "og:description",
        content: "शिक्षण • संस्कार • अध्यात्म • वारकरी परंपरा — आळंदी देवाची, ता. खेड, जि. पुणे.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { t, lang } = useLang();
  const { upcoming } = splitEvents();

  return (
    <>
      {/* Hero */}
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
          <div className="absolute inset-0 bg-maroon/55" aria-hidden="true" />
          <Container className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-sm tracking-wide text-primary-foreground/90">{t(org.greeting)}</p>
            <h1 className="mt-2 max-w-3xl text-2xl text-primary-foreground sm:text-4xl">
              {t(org.name)}
            </h1>
            <p className="mt-2 font-display text-lg text-primary-foreground/95 sm:text-xl">
              {t(org.gurukul)}
            </p>
            <p className="mt-3 text-sm text-primary-foreground/90 sm:text-base">
              {t(org.tagline)}
            </p>
            <p className="mt-2 text-sm text-primary-foreground/90">{t(org.greeting2)}</p>
          </Container>
        </div>

        <Container className="-mt-8 relative z-10">
          <div className="card-soft grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            <PrimaryLink to="/about">{t({ mr: "आमच्याविषयी", en: "About us" })}</PrimaryLink>
            <OutlineLink to="/activities">
              {t({ mr: "गुरुकुलाचे उपक्रम", en: "Activities" })}
            </OutlineLink>
            <OutlineLink to="/support">{t({ mr: "सहकार्य करा", en: "Support us" })}</OutlineLink>
            <OutlineLink to="/contact">{t({ mr: "संपर्क करा", en: "Contact" })}</OutlineLink>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed">{t(homeIntro)}</p>
        </div>
        <MalaDivider />
      </Section>

      {/* Saints */}
      <Section tone="sand">
        <SectionTitle
          title={{ mr: "संतपरंपरा", en: "Our Inspiration" }}
          sub={{
            mr: "आमच्या कार्याची प्रेरणा",
            en: "The inspiration behind our work",
          }}
        />
        <div className="mt-8">
          <SaintStrip />
        </div>
      </Section>

      {/* Key activities */}
      <Section>
        <SectionTitle title={{ mr: "प्रमुख उपक्रम", en: "Key Activities" }} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {keyActivities.map((a, i) => (
            <FadeIn key={a.title.en} delay={i * 60}>
              <Card className="h-full text-center">
                <div className="text-3xl" aria-hidden="true">
                  {a.icon}
                </div>
                <h3 className="mt-2 text-base">{t(a.title)}</h3>
              </Card>
            </FadeIn>
          ))}
        </div>
        <div className="mt-8 text-center">
          <OutlineLink to="/activities">
            {t({ mr: "सर्व उपक्रम पहा", en: "See all activities" })}
          </OutlineLink>
        </div>
      </Section>

      {/* Founder */}
      <Section tone="sand">
        <div className="card-soft mx-auto flex max-w-3xl flex-col items-center gap-6 p-6 text-center sm:flex-row sm:text-left">
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-sand text-3xl"
            aria-label={t({ mr: "छायाचित्र स्लॉट", en: "Photo slot" })}
          >
            🙏
          </div>
          <div>
            <h3 className="text-xl">{t(org.founder)}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t(org.founderRole)}</p>
            <div className="mt-4">
              <OutlineLink to="/founder">
                {t({ mr: "अधिक माहिती", en: "Read more" })}
              </OutlineLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionTitle title={{ mr: "१२ वर्षांचा प्रवास", en: "A journey of 12 years" }} />
        <ol className="mx-auto mt-8 max-w-2xl border-l-2 border-primary/30 pl-6">
          {timeline.map((m, i) => (
            <FadeIn key={i} delay={i * 80}>
              <li className="relative pb-8">
                <span
                  className="absolute top-2 -left-[31px] h-3 w-3 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <h3 className="text-base">{t(m.year)}</h3>
                <p className="mt-1 text-muted-foreground">{t(m.text)}</p>
              </li>
            </FadeIn>
          ))}
        </ol>
      </Section>

      {/* Upcoming events */}
      <Section tone="sand">
        <SectionTitle title={{ mr: "आगामी कार्यक्रम", en: "Upcoming Events" }} />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {upcoming.slice(0, 3).map((e) => (
            <Card key={e.slug}>
              <p className="text-sm text-primary">{formatEventDate(e.date, lang)}</p>
              <h3 className="mt-1 text-base">{t(e.title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(e.venue)}</p>
              <Link
                to="/events/$slug"
                params={{ slug: e.slug }}
                className="mt-3 inline-block text-sm font-semibold text-maroon underline underline-offset-4"
              >
                {t({ mr: "तपशील पहा", en: "View details" })}
              </Link>
            </Card>
          ))}
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground">
              {t({ mr: "सध्या आगामी कार्यक्रम नाहीत.", en: "No upcoming events at present." })}
            </p>
          ) : null}
        </div>
      </Section>

      {/* Gallery preview */}
      <Section>
        <SectionTitle title={{ mr: "फोटो गॅलरी", en: "Photo Gallery" }} />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {galleryPhotos.slice(0, 4).map((p) => (
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
          <OutlineLink to="/gallery">{t({ mr: "संपूर्ण गॅलरी", en: "Full gallery" })}</OutlineLink>
          <OutlineLink to="/videos">{t({ mr: "व्हिडिओ पहा", en: "Watch videos" })}</OutlineLink>
        </div>
      </Section>

      {/* Support appeal */}
      <Section tone="sand">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl">{t({ mr: "सहकार्याचे आवाहन", en: "An appeal for support" })}</h2>
          <p className="mt-4 text-lg">
            {t({
              mr: "विद्यार्थ्यांच्या शिक्षण, संस्कार आणि गुरुकुलाच्या विकासासाठी समाजातील हितचिंतकांचे सहकार्य आवश्यक आहे.",
              en: "The support of well-wishers is needed for the students' education, values and the growth of the gurukul.",
            })}
          </p>
          <div className="mt-6">
            <PrimaryLink to="/support">
              {t({ mr: "सहकार्य करा / देणगी", en: "Support / Donate" })}
            </PrimaryLink>
          </div>
        </div>
      </Section>
    </>
  );
}
