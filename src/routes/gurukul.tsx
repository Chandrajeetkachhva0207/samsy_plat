import { createFileRoute } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section, SectionTitle } from "@/components/ui";
import { facilities, gurukul, org } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/gurukul")({
  head: () => ({
    meta: [
      { title: "गुरुकुल | मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची" },
      {
        name: "description",
        content: "गुरुकुलाची ओळख, शैक्षणिक व आध्यात्मिक वातावरण, दैनंदिन दिनक्रम व सुविधा.",
      },
      { property: "og:title", content: "गुरुकुल | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "शैक्षणिक व आध्यात्मिक वातावरण, दिनक्रम व सुविधा." },
      { property: "og:url", content: "/gurukul" },
    ],
    links: [{ rel: "canonical", href: "/gurukul" }],
  }),
  component: Gurukul,
});

function Gurukul() {
  const { t } = useLang();
  return (
    <>
      <PageHeader title={{ mr: "गुरुकुल", en: "Gurukul" }} sub={org.gurukul} />
      <Section>
        <div className="grid gap-5 sm:grid-cols-3">
          <Card>
            <h2 className="text-lg">{t({ mr: "गुरुकुलाची ओळख", en: "Identity" })}</h2>
            <p className="mt-2 text-muted-foreground">{t(gurukul.identity)}</p>
          </Card>
          <Card>
            <h2 className="text-lg">{t({ mr: "शैक्षणिक वातावरण", en: "Educational environment" })}</h2>
            <p className="mt-2 text-muted-foreground">{t(gurukul.eduEnv)}</p>
          </Card>
          <Card>
            <h2 className="text-lg">{t({ mr: "आध्यात्मिक वातावरण", en: "Spiritual environment" })}</h2>
            <p className="mt-2 text-muted-foreground">{t(gurukul.spiritualEnv)}</p>
          </Card>
        </div>
      </Section>

      <Section tone="sand">
        <SectionTitle
          title={{ mr: "दैनंदिन दिनक्रम", en: "Daily Routine" }}
          sub={{ mr: "वेळा संपादनयोग्य आहेत.", en: "Timings are editable." }}
        />
        <div className="card-soft mx-auto mt-8 max-w-xl overflow-hidden">
          <ul>
            {gurukul.routine.map((r, i) => (
              <li
                key={r.item.en}
                className={`flex items-center justify-between gap-4 px-5 py-3 ${i % 2 ? "bg-sand" : ""}`}
              >
                <span className="font-semibold text-maroon">{t(r.item)}</span>
                <span className="text-sm text-muted-foreground">{r.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <SectionTitle title={{ mr: "सुविधा", en: "Facilities" }} />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {facilities.map((f) => (
            <Card key={f.title.en} className="text-center">
              <div className="text-2xl" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="mt-2 text-base">{t(f.title)}</h3>
            </Card>
          ))}
        </div>
        <Card className="mt-8">
          <h2 className="text-lg">{t({ mr: "कार्यपद्धती", en: "Working method" })}</h2>
          <p className="mt-2 text-muted-foreground">{t(gurukul.method)}</p>
        </Card>
        <EditableNote />
      </Section>
    </>
  );
}
