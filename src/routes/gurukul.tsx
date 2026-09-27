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

      <Section tone="sand" className="relative">
        <div className="mx-auto max-w-4xl">
          {/* Header Title with Registration Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-sand px-4 py-1.5 text-xs font-bold text-maroon shadow-xs">
              <span>नोंदणी क्र. – {gurukul.registrationNo}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-maroon sm:text-3xl">
              {t({ mr: "दैनिक दिनचर्या", en: "Daily Routine" })}
            </h2>
            <div className="mx-auto mt-2 h-[2px] w-20 rounded-full bg-primary/70" />
            <p className="mt-2 text-sm text-muted-foreground">
              {t({
                mr: "मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची ता. खेड जि. पुणे",
                en: "Maa Narmada Adhyatmik Gurukul, Alandi Devachi, Tal. Khed, Dist. Pune",
              })}
            </p>
          </div>

          {/* Routine Table / List */}
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card shadow-md">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-maroon via-primary to-maroon px-6 py-3.5 text-center text-primary-foreground">
              <span className="font-display text-base font-bold tracking-wide sm:text-lg">
                {t({ mr: "✤ गुरुकुलाचा दैनंदिन दिनक्रम ✤", en: "✤ Gurukul Daily Schedule ✤" })}
              </span>
            </div>

            <div className="divide-y divide-border">
              {gurukul.routine.map((r, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-sand/60 sm:flex-row sm:items-center sm:justify-between ${
                    i % 2 === 1 ? "bg-sand/30" : "bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
                      {r.icon}
                    </span>
                    <div>
                      <span className="font-display text-base font-bold text-maroon sm:text-lg">
                        {t(r.item)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start pl-12 sm:self-auto sm:pl-0">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-sand px-3 py-1 font-mono text-xs font-bold text-maroon sm:text-sm">
                      <span className="text-primary font-bold">🕒</span>
                      <span>{t({ mr: r.time, en: r.timeEn })}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Notes Card Footer */}
            <div className="border-t-2 border-primary/20 bg-amber-50/80 p-5 text-sm sm:p-6">
              <div className="space-y-2 font-medium text-amber-950">
                {gurukul.specialNotes.map((note, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">✤</span>
                    <span className="leading-relaxed">{t(note)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
