import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section, SectionTitle } from "@/components/ui";
import { bankDetails, org, supportTypes } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "सहकार्य करा | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content:
          "गुरुकुलाच्या शैक्षणिक व आध्यात्मिक कार्यास सहकार्य करा — आर्थिक मदत, अन्नदान, शैक्षणिक साहित्य व सेवा.",
      },
      { property: "og:title", content: "सहकार्य करा | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "संस्थेच्या अधिकृत खात्यावरच देणगी स्वीकारली जाते." },
      { property: "og:url", content: "/support" },
    ],
    links: [{ rel: "canonical", href: "/support" }],
  }),
  component: Support,
});

function Support() {
  const { t } = useLang();

  return (
    <>
      <PageHeader
        title={{ mr: "सहकार्य करा", en: "Support Us" }}
        sub={{
          mr: "आपले सहकार्य विद्यार्थ्यांच्या शिक्षण व संस्कारासाठी वापरले जाते.",
          en: "Your support goes towards the education and values of the students.",
        }}
      />

      <Section>
        <SectionTitle
          title={{ mr: "सहकार्याचे प्रकार", en: "Ways to support" }}
          sub={{
            mr: "आपल्या सोयीनुसार कोणत्याही प्रकारे सहकार्य करता येईल.",
            en: "You may support in whichever way suits you.",
          }}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportTypes.map((s) => (
            <Card key={s.title.en}>
              <div className="text-2xl" aria-hidden="true">
                {s.icon}
              </div>
              <h3 className="mt-2 text-base">{t(s.title)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(s.text)}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <SectionTitle
          title={{ mr: "अधिकृत बँक तपशील", en: "Official bank details" }}
          sub={{
            mr: "देणगी केवळ संस्थेच्या अधिकृत खात्यावरच स्वीकारली जाते.",
            en: "Donations are accepted only into the institution's official account.",
          }}
        />
        <div className="mx-auto mt-8 max-w-2xl">
          <Card>
            <dl className="divide-y divide-border text-sm">
              {bankDetails.map((b) => (
                <div key={b.label.en} className="flex flex-wrap justify-between gap-2 py-3">
                  <dt className="text-muted-foreground">{t(b.label)}</dt>
                  <dd className="font-medium">{b.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 rounded-lg border border-dashed border-primary/40 bg-sand px-4 py-3 text-sm text-muted-foreground">
              {t({
                mr: "हे तपशील संस्थेकडून अधिकृत माहिती मिळाल्यावर भरले जातील. कोणत्याही व्यक्तीच्या वैयक्तिक खात्यावर रक्कम पाठवू नये.",
                en: "These details will be filled in once official information is received from the institution. Never send money to any individual's personal account.",
              })}
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl">{t({ mr: "पावती व करसवलत", en: "Receipts & tax exemption" })}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t({
              mr: "देणगीची पावती संस्थेकडून दिली जाते. करसवलतीविषयी माहिती अधिकृत प्रमाणपत्रे उपलब्ध असल्यासच दर्शवली जाईल.",
              en: "Donation receipts are issued by the institution. Tax exemption information will be shown only if valid official certificates are available.",
            })}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/certificates"
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-card px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-accent"
            >
              {t({ mr: "नोंदणी व प्रमाणपत्रे", en: "Registration & certificates" })}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {t({ mr: "संपर्क करा", en: "Contact us" })}
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{t(org.name)}</p>
          <EditableNote />
        </div>
      </Section>
    </>
  );
}
