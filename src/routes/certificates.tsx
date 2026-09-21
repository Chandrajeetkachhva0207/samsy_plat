import { createFileRoute } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { certificates } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "संस्था नोंदणी व प्रमाणपत्रे | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content: "संस्थेची नोंदणी, 12A, 80G व PAN यासंबंधीची अधिकृत माहिती.",
      },
      { property: "og:title", content: "संस्था नोंदणी व प्रमाणपत्रे" },
      { property: "og:description", content: "संस्थेची अधिकृत नोंदणी व प्रमाणपत्रांची माहिती." },
      { property: "og:url", content: "/certificates" },
    ],
    links: [{ rel: "canonical", href: "/certificates" }],
  }),
  component: Certificates,
});

function Certificates() {
  const { t } = useLang();
  return (
    <>
      <PageHeader
        title={{ mr: "संस्था नोंदणी व प्रमाणपत्रे", en: "Registration & Certificates" }}
        sub={{
          mr: "केवळ संस्थेकडून मिळालेली व वैध असलेली माहितीच येथे दर्शवली जाते.",
          en: "Only information received from the institution and verified as valid is shown here.",
        }}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((c) => (
            <Card key={c.name.en}>
              <h2 className="text-base">{t(c.name)}</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{t({ mr: "क्रमांक", en: "Number" })}</dt>
                  <dd className="font-medium">{c.number}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{t({ mr: "वैधता", en: "Validity" })}</dt>
                  <dd className="font-medium">{c.validity}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
        <EditableNote
          text={{
            mr: "हे क्रमांक व वैधता संस्थेकडून अधिकृत कागदपत्रे मिळाल्यावरच भरली जातील. तोपर्यंत कोणताही दावा केला जात नाही.",
            en: "These numbers and validity dates will be filled in only after official documents are received. No claims are made until then.",
          }}
        />
      </Section>
    </>
  );
}
