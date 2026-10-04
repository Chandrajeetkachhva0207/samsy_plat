import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { activities } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "उपक्रम | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content:
          "शालेय शिक्षण, अभ्यास मार्गदर्शन, प्रार्थना, नामस्मरण, संतविचार, कीर्तन, प्रवचन व सामाजिक उपक्रम.",
      },
      { property: "og:title", content: "उपक्रम | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "गुरुकुलात चालणारे शैक्षणिक व आध्यात्मिक उपक्रम." },
      { property: "og:url", content: "/activities" },
    ],
    links: [{ rel: "canonical", href: "/activities" }],
  }),
  component: Activities,
});

function Activities() {
  const { t } = useLang();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title={{ mr: "उपक्रम", en: "Activities" }}
        sub={{
          mr: "प्रत्येक उपक्रमावर क्लिक करून अधिक माहिती पहा.",
          en: "Select an activity to read more.",
        }}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => {
            const isOpen = open === a.title.en;
            return (
              <Card key={a.title.en} className="overflow-hidden flex flex-col justify-between">
                <div>
                  {a.image ? (
                    <div className="relative -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-xl bg-muted">
                      <img
                        src={a.image}
                        alt={t(a.title)}
                        className="h-52 w-full object-cover object-top transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {a.icon}
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-primary">{t(a.title)}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{t(a.short)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => setOpen(isOpen ? null : a.title.en)}
                    aria-expanded={isOpen}
                    className="mt-3 text-sm font-semibold text-maroon underline underline-offset-4"
                  >
                    {isOpen
                      ? t({ mr: "बंद करा", en: "Close" })
                      : t({ mr: "अधिक वाचा", en: "Read more" })}
                  </button>
                  {isOpen ? (
                    <p className="mt-3 rounded-lg bg-sand px-4 py-3 text-sm">{t(a.detail)}</p>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
        <EditableNote />
      </Section>
    </>
  );
}
