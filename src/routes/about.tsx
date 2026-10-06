import { createFileRoute } from "@tanstack/react-router";
import { SaintStrip } from "@/components/SaintStrip";
import { Card, EditableNote, PageHeader, Section, SectionTitle } from "@/components/ui";
import { about, timeline } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "संस्थाविषयी | मा नर्मदा आध्यात्मिक शिक्षण संस्था" },
      {
        name: "description",
        content: "संस्थेची स्थापना, उद्दिष्टे, आळंदीतील कार्य आणि १२ वर्षांचा प्रवास.",
      },
      { property: "og:title", content: "संस्थाविषयी | मा नर्मदा आध्यात्मिक शिक्षण संस्था" },
      { property: "og:description", content: "संस्थेची स्थापना, उद्दिष्टे व आळंदीतील कार्य." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const { t } = useLang();
  return (
    <>
      <PageHeader
        title={{ mr: "संस्थाविषयी", en: "About Us" }}
        sub={{
          mr: "शिक्षण, संस्कार व अध्यात्म यांची सेवा",
          en: "A service of education, values and spirituality",
        }}
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {about.sections.map((s) => (
            <Card key={s.title.en}>
              <h2 className="text-lg font-bold text-primary">{t(s.title)}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{t(s.body)}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <SectionTitle
          title={{ mr: "१२ वर्षांचा प्रवास", en: "A Journey of 12 Years" }}
          sub={{
            mr: "गुरुकुलाचा १२ वर्षांचा प्रेरणादायी आणि गौरवशाली प्रवास",
            en: "An inspiring and glorious 12-year journey of the Gurukul",
          }}
        />
        <ol className="mx-auto mt-8 max-w-3xl border-l-2 border-primary/30 pl-6 sm:pl-8 space-y-6">
          {timeline.map((m, i) => (
            <li key={i} className="relative pb-2 group">
              <span
                className="absolute -left-[37px] sm:-left-[45px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md ring-4 ring-background"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="rounded-2xl border border-primary/15 bg-card/90 p-5 shadow-sm">
                <h3 className="text-lg font-bold text-primary font-marathi">
                  {t(m.year)}
                </h3>
                <p className="mt-2 text-foreground/85 leading-relaxed text-sm sm:text-base">
                  {t(m.text)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sand">
        <SectionTitle title={{ mr: "संतपरंपरा", en: "Our Inspiration" }} />
        <div className="mt-8">
          <SaintStrip />
        </div>
      </Section>
    </>
  );
}
