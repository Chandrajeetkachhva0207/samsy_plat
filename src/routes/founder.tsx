import { createFileRoute } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { founderPage, org } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: "संस्थापक अध्यक्ष — ह.भ.प. संतोष महाराज पवार" },
      {
        name: "description",
        content: "ह.भ.प. संतोष महाराज पवार, संस्थापक अध्यक्ष, मा नर्मदा आध्यात्मिक शिक्षण संस्था.",
      },
      { property: "og:title", content: "संस्थापक अध्यक्ष — ह.भ.प. संतोष महाराज पवार" },
      { property: "og:description", content: "संस्थेतील भूमिका व कार्याचा थोडक्यात परिचय." },
      { property: "og:url", content: "/founder" },
    ],
    links: [{ rel: "canonical", href: "/founder" }],
  }),
  component: Founder,
});

function Founder() {
  const { t } = useLang();
  return (
    <>
      <PageHeader title={{ mr: "संस्थापक अध्यक्ष", en: "Founder President" }} />
      <Section>
        <div className="grid gap-6 sm:grid-cols-[260px_1fr]">
          <figure className="card-soft overflow-hidden">
            <div
              className="flex aspect-[4/5] items-center justify-center bg-sand text-5xl"
              aria-label={t({ mr: "अधिकृत छायाचित्र स्लॉट", en: "Official photo slot" })}
            >
              🙏
            </div>
            <figcaption className="border-t border-border px-4 py-3 text-center text-sm">
              <span className="block font-semibold text-maroon">{t(org.founder)}</span>
              <span className="mt-1 block text-muted-foreground">{t(org.founderRole)}</span>
            </figcaption>
          </figure>
          <div className="grid gap-5">
            <Card>
              <h2 className="text-lg">{t({ mr: "परिचय", en: "Introduction" })}</h2>
              <p className="mt-2 text-muted-foreground">{t(founderPage.intro)}</p>
            </Card>
            <Card>
              <h2 className="text-lg">{t({ mr: "संस्थेतील भूमिका", en: "Role in the institution" })}</h2>
              <p className="mt-2 text-muted-foreground">{t(founderPage.role)}</p>
            </Card>
            <Card>
              <h2 className="text-lg">{t({ mr: "कार्याचा आढावा", en: "Summary of work" })}</h2>
              <p className="mt-2 text-muted-foreground">{t(founderPage.work)}</p>
            </Card>
          </div>
        </div>
        <EditableNote text={founderPage.photoNote} />
      </Section>
    </>
  );
}
