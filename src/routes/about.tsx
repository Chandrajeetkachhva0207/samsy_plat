import { createFileRoute } from "@tanstack/react-router";
import { SaintStrip } from "@/components/SaintStrip";
import { Card, EditableNote, PageHeader, Section, SectionTitle } from "@/components/ui";
import { about } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "आमच्याविषयी | मा नर्मदा आध्यात्मिक शिक्षण संस्था" },
      {
        name: "description",
        content: "संस्थेची स्थापना, उद्दिष्टे, आळंदीतील कार्य आणि १२ वर्षांचा प्रवास.",
      },
      { property: "og:title", content: "आमच्याविषयी | मा नर्मदा आध्यात्मिक शिक्षण संस्था" },
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
        title={{ mr: "आमच्याविषयी", en: "About Us" }}
        sub={{
          mr: "शिक्षण, संस्कार व अध्यात्म यांची सेवा",
          en: "A service of education, values and spirituality",
        }}
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {about.sections.map((s) => (
            <Card key={s.title.en}>
              <h2 className="text-lg">{t(s.title)}</h2>
              <p className="mt-2 text-muted-foreground">{t(s.body)}</p>
            </Card>
          ))}
        </div>
        <EditableNote text={about.verified} />
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
