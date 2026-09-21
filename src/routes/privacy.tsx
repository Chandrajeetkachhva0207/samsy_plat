import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Section } from "@/components/ui";
import { useLang, type Bi } from "@/lib/lang";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "गोपनीयता धोरण | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content:
          "विद्यार्थ्यांची संवेदनशील माहिती प्रसिद्ध न करण्याविषयी व संपर्क माहितीच्या वापराविषयी संस्थेचे धोरण.",
      },
      { property: "og:title", content: "गोपनीयता धोरण" },
      { property: "og:description", content: "विद्यार्थी व अभ्यागतांच्या माहितीबाबतचे धोरण." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

const sections: { title: Bi; points: Bi[] }[] = [
  {
    title: { mr: "विद्यार्थ्यांची माहिती", en: "Student information" },
    points: [
      {
        mr: "आधार क्रमांक, घरचा पत्ता, वैयक्तिक दूरध्वनी क्रमांक व जन्मतारीख ही माहिती संकेतस्थळावर कधीही प्रसिद्ध केली जात नाही.",
        en: "Aadhaar numbers, home addresses, personal phone numbers and dates of birth are never published on this website.",
      },
      {
        mr: "विद्यार्थ्यांची छायाचित्रे व नावे केवळ पालक/पालकांची संमती मिळाल्यावरच प्रसिद्ध केली जातात.",
        en: "Student photos and names are published only with the consent of their parents or guardians.",
      },
    ],
  },
  {
    title: { mr: "संपर्क फॉर्मद्वारे मिळणारी माहिती", en: "Information from the contact form" },
    points: [
      {
        mr: "संपर्क फॉर्ममध्ये दिलेली माहिती केवळ आपणास उत्तर देण्यासाठी वापरली जाते.",
        en: "Details submitted through the contact form are used only to respond to you.",
      },
      {
        mr: "ही माहिती कोणत्याही तिसऱ्या व्यक्ती किंवा संस्थेस विक्री अथवा हस्तांतरित केली जात नाही.",
        en: "This information is never sold or transferred to any third party.",
      },
    ],
  },
  {
    title: { mr: "देणगी व आर्थिक माहिती", en: "Donations and financial information" },
    points: [
      {
        mr: "देणगी केवळ संस्थेच्या अधिकृत खात्यावर स्वीकारली जाते; कोणत्याही वैयक्तिक खात्यावर नाही.",
        en: "Donations are accepted only into the institution's official account, never a personal one.",
      },
      {
        mr: "संकेतस्थळावर कोणतीही बँक किंवा कार्ड माहिती साठवली जात नाही.",
        en: "No bank or card details are stored on this website.",
      },
    ],
  },
  {
    title: { mr: "सुरक्षितता", en: "Security" },
    points: [
      {
        mr: "संकेतस्थळ HTTPS वापरते व प्रशासन विभाग सुरक्षित प्रवेशाने संरक्षित असेल.",
        en: "The website uses HTTPS and the administration area will be protected by secure login.",
      },
    ],
  },
];

function Privacy() {
  const { t } = useLang();
  return (
    <>
      <PageHeader
        title={{ mr: "गोपनीयता धोरण", en: "Privacy Policy" }}
        sub={{
          mr: "विद्यार्थी व अभ्यागतांच्या माहितीबाबत संस्थेची भूमिका.",
          en: "How the institution handles information about students and visitors.",
        }}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-4">
          {sections.map((s) => (
            <Card key={s.title.en}>
              <h2 className="text-base">{t(s.title)}</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {s.points.map((p) => (
                  <li key={p.en} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    {t(p)}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
