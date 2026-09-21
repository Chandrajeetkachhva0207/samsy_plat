import { createFileRoute } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { reports } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "कार्य अहवाल | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content: "संस्थेचे वार्षिक कार्य अहवाल — उपक्रम, शैक्षणिक व आध्यात्मिक कार्याची माहिती.",
      },
      { property: "og:title", content: "कार्य अहवाल | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "वार्षिक कार्य अहवाल पहा व डाउनलोड करा." },
      { property: "og:url", content: "/reports" },
    ],
    links: [{ rel: "canonical", href: "/reports" }],
  }),
  component: Reports,
});

function Reports() {
  const { t, lang } = useLang();

  const contents = [
    { mr: "वर्षभरातील उपक्रम", en: "Activities during the year" },
    { mr: "विद्यार्थ्यांविषयी माहिती", en: "Information about students" },
    { mr: "शैक्षणिक कार्य", en: "Educational work" },
    { mr: "आध्यात्मिक कार्यक्रम", en: "Spiritual programmes" },
    { mr: "सामाजिक उपक्रम", en: "Social initiatives" },
    { mr: "छायाचित्रे", en: "Photos" },
    { mr: "पुढील योजना", en: "Plans ahead" },
  ];

  return (
    <>
      <PageHeader
        title={{ mr: "कार्य अहवाल", en: "Annual Reports" }}
        sub={{
          mr: "वार्षिक अहवाल PDF स्वरूपात पाहता व डाउनलोड करता येतील.",
          en: "Annual reports can be viewed and downloaded as PDF files.",
        }}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((r) => (
            <Card key={r.yearEn}>
              <p className="text-2xl" aria-hidden="true">
                📄
              </p>
              <h2 className="mt-2 text-base">
                {lang === "mr" ? `${r.year} कार्य अहवाल` : `${r.yearEn} Annual Report`}
              </h2>
              {r.file ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={r.file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    {t({ mr: "PDF पहा", en: "View PDF" })}
                  </a>
                  <a
                    href={r.file}
                    download
                    className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-card px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-accent"
                  >
                    ↓ {t({ mr: "डाउनलोड", en: "Download" })}
                  </a>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t({
                    mr: "अहवालाची PDF प्रशासनाकडून अपलोड केली जाईल.",
                    en: "The report PDF will be uploaded by the administration.",
                  })}
                </p>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <h2 className="text-base">{t({ mr: "अहवालात काय असते?", en: "What reports contain" })}</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {contents.map((c) => (
              <li key={c.en} className="flex gap-2">
                <span aria-hidden="true">•</span>
                {t(c)}
              </li>
            ))}
          </ul>
        </Card>
        <EditableNote />
      </Section>
    </>
  );
}
