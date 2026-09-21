import { createFileRoute } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { facilities } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "विद्यार्थी व सुविधा | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content: "गुरुकुलातील विद्यार्थ्यांसाठी उपलब्ध निवास, भोजन, अभ्यासिका व इतर सुविधा.",
      },
      { property: "og:title", content: "विद्यार्थी व सुविधा" },
      { property: "og:description", content: "निवास, भोजन, अभ्यासिका, संस्कार वर्ग व इतर सुविधा." },
      { property: "og:url", content: "/students" },
    ],
    links: [{ rel: "canonical", href: "/students" }],
  }),
  component: Students,
});

function Students() {
  const { t } = useLang();
  return (
    <>
      <PageHeader
        title={{ mr: "विद्यार्थी व सुविधा", en: "Students & Facilities" }}
        sub={{
          mr: "केवळ प्रत्यक्ष उपलब्ध असलेल्या सुविधा येथे दर्शवल्या जातात.",
          en: "Only facilities that are actually available are listed here.",
        }}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <Card key={f.title.en}>
              <div className="text-2xl" aria-hidden="true">
                {f.icon}
              </div>
              <h2 className="mt-2 text-base">{t(f.title)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t(f.text)}</p>
            </Card>
          ))}
        </div>
        <EditableNote
          text={{
            mr: "गोपनीयता: विद्यार्थ्यांचा आधार क्रमांक, घरचा पत्ता, वैयक्तिक दूरध्वनी, जन्मतारीख यांसारखी संवेदनशील माहिती कधीही प्रसिद्ध केली जात नाही. विद्यार्थ्यांची छायाचित्रे व नावे केवळ संमती मिळाल्यावरच प्रसिद्ध केली जातील.",
            en: "Privacy: sensitive student data such as Aadhaar numbers, home addresses, personal phone numbers and dates of birth is never published. Student photos and names are shown only when consent has been obtained.",
          }}
        />
      </Section>
    </>
  );
}
