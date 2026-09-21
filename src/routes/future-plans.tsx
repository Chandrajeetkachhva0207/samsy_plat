import { createFileRoute } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { futurePlans } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/future-plans")({
  head: () => ({
    meta: [
      { title: "भविष्यातील योजना | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content:
          "गुरुकुलासाठी प्रस्तावित योजना — स्वतःची जागा, विद्यार्थी निवास, भोजन कक्ष, वर्गखोल्या, सभागृह व क्रीडांगण.",
      },
      { property: "og:title", content: "भविष्यातील योजना | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "प्रस्तावित सुविधा व पुढील वाटचाल." },
      { property: "og:url", content: "/future-plans" },
    ],
    links: [{ rel: "canonical", href: "/future-plans" }],
  }),
  component: FuturePlans,
});

function FuturePlans() {
  const { t } = useLang();

  return (
    <>
      <PageHeader
        title={{ mr: "भविष्यातील योजना", en: "Future Plans" }}
        sub={{
          mr: "खाली दिलेल्या सर्व बाबी प्रस्तावित योजना आहेत — पूर्ण झालेल्या सुविधा नाहीत.",
          en: "Everything listed below is a proposed plan, not a completed facility.",
        }}
      />
      <Section>
        <div className="rounded-xl border border-dashed border-primary/50 bg-sand px-5 py-4 text-sm">
          ⚠{" "}
          {t({
            mr: "सूचना: या योजना संस्थेच्या पुढील वाटचालीचा भाग आहेत. सहकार्य मिळाल्यानुसार त्या टप्प्याटप्प्याने पूर्ण केल्या जातील.",
            en: "Note: these plans are part of the institution's road ahead and will be completed in stages as support becomes available.",
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {futurePlans.map((p) => (
            <Card key={p.title.en}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base">{t(p.title)}</h2>
                <span className="shrink-0 rounded-full border border-primary/40 bg-sand px-3 py-1 text-xs font-semibold text-maroon">
                  {t({ mr: "प्रस्तावित", en: "Proposed" })}
                </span>
              </div>
            </Card>
          ))}
        </div>
        <EditableNote />
      </Section>
    </>
  );
}
