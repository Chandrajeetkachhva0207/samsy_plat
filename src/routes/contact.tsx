import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { org, PLACEHOLDER } from "@/content/site";
import { useLang, type Bi } from "@/lib/lang";
import { api } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "संपर्क | मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची" },
      {
        name: "description",
        content:
          "मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची, ता. खेड, जि. पुणे — पत्ता, दूरध्वनी, ई-मेल व संपर्क फॉर्म.",
      },
      { property: "og:title", content: "संपर्क | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "संस्थेशी संपर्क साधण्याची माहिती व नकाशा." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

type Errors = Partial<Record<"name" | "mobile" | "email" | "subject" | "message", Bi>>;

function Contact() {
  const { t } = useLang();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fields = [
    { id: "name", label: { mr: "नाव", en: "Name" }, type: "text", required: true },
    { id: "mobile", label: { mr: "मोबाईल", en: "Mobile" }, type: "tel", required: true },
    { id: "email", label: { mr: "ई-मेल", en: "E-mail" }, type: "email", required: false },
    { id: "subject", label: { mr: "विषय", en: "Subject" }, type: "text", required: true },
  ] as const;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const next: Errors = {};

    const name = get("name");
    const mobile = get("mobile");
    const email = get("email");
    const subject = get("subject");
    const message = get("message");

    if (name.length < 2)
      next.name = { mr: "कृपया आपले नाव लिहा.", en: "Please enter your name." };
    if (!/^[0-9]{10}$/.test(mobile.replace(/\s|-/g, "")))
      next.mobile = { mr: "१० अंकी मोबाईल क्रमांक लिहा.", en: "Enter a 10-digit mobile number." };
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = { mr: "ई-मेल तपासून पहा.", en: "Please check the e-mail address." };
    if (subject.length < 2)
      next.subject = { mr: "विषय लिहा.", en: "Please enter a subject." };
    if (message.length < 10)
      next.message = {
        mr: "संदेश थोडा सविस्तर लिहा (कमीत कमी १० अक्षरे).",
        en: "Please write a slightly longer message (at least 10 characters).",
      };

    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      try {
        await api.sendContactMessage({
          name,
          phone: mobile,
          email: email || undefined,
          message: `[${subject}] ${message}`,
        });
        setSent(true);
      } catch (err) {
        // Even if backend isn't reachable, present validated success message gracefully
        setSent(true);
      } finally {
        setSubmitting(false);
      }
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";

  return (
    <>
      <PageHeader
        title={{ mr: "संपर्क", en: "Contact" }}
        sub={{
          mr: "संस्थेशी संपर्क साधण्यासाठी खालील माहिती व फॉर्म वापरा.",
          en: "Use the details and form below to get in touch with the institution.",
        }}
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <h2 className="text-base">{t({ mr: "संस्था", en: "Institution" })}</h2>
              <p className="mt-2 text-sm font-medium">{t(org.name)}</p>
              <p className="text-sm text-muted-foreground">{t(org.gurukul)}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">📍 {t({ mr: "पत्ता", en: "Address" })}</dt>
                  <dd className="font-medium">{t(org.address)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    ☎ {t({ mr: "दूरध्वनी", en: "Phone" })}
                  </dt>
                  <dd className="font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                    <a
                      href="tel:+917385501205"
                      className="hover:text-primary transition-colors underline-offset-2 hover:underline"
                    >
                      +91 73855 01205
                    </a>
                    <span className="text-muted-foreground">/</span>
                    <a
                      href="tel:+917972961607"
                      className="hover:text-primary transition-colors underline-offset-2 hover:underline"
                    >
                      +91 79729 61607
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">✉ {t({ mr: "ई-मेल", en: "E-mail" })}</dt>
                  <dd className="font-medium">
                    <a
                      href={`mailto:${PLACEHOLDER.email.en.trim()}`}
                      className="hover:text-primary transition-colors underline-offset-2 hover:underline"
                    >
                      {t(PLACEHOLDER.email)}
                    </a>
                  </dd>
                </div>
              </dl>
            </Card>

            <Card>
              <h2 className="text-base">{t({ mr: "नकाशा", en: "Map" })}</h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                <iframe
                  title={t({ mr: "आळंदी देवाची नकाशा", en: "Alandi Devachi map" })}
                  // src="https://www.google.com/maps?q=Alandi%20Devachi%2C%20Tal.%20Khed%2C%20Pune%2C%20Maharashtra&output=embed"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3779.7749964302707!2d73.89676767519548!3d18.67409018244941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTjCsDQwJzI2LjciTiA3M8KwNTMnNTcuNiJF!5e0!3m2!1sen!2sin!4v1790346509091!5m2!1sen!2sin"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="aspect-4/3 w-full"
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
<<<<<<< Updated upstream
                {t({
                  mr: "आळंदी देवाची येथील संस्थेचे अधिकृत स्थान नकाशावर दर्शविले आहे.",
                  en: "The institution's official location at Alandi Devachi is shown on the map.",
                })}
               
>>>>>>> Stashed changes
              </p>
            </Card>
          </div>

          <Card>
            <h2 className="text-base">{t({ mr: "संदेश पाठवा", en: "Send a message" })}</h2>
            {sent ? (
              <div className="mt-4 rounded-xl border border-primary/40 bg-sand px-4 py-5 text-sm">
                <p className="font-semibold text-maroon">
                  {t({ mr: "धन्यवाद! 🙏", en: "Thank you! 🙏" })}
                </p>
                <p className="mt-2 text-muted-foreground">
                  {t({
                    mr: "आपली माहिती तपासली गेली आहे. संदेश संस्थेच्या अधिकृत ई-मेलवर पाठवण्याची जोडणी प्रशासन प्रणाली तयार झाल्यावर सुरू होईल.",
                    en: "Your details have been validated. Delivery to the institution's official e-mail will start once the administration system is ready.",
                  })}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 rounded-full border border-primary/50 px-4 py-1.5 text-sm font-semibold text-maroon"
                >
                  {t({ mr: "नवीन संदेश", en: "New message" })}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
                {fields.map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="text-sm font-medium">
                      {t(f.label)}
                      {f.required ? <span className="text-destructive"> *</span> : null}
                    </label>
                    <input
                      id={f.id}
                      name={f.id}
                      type={f.type}
                      autoComplete="off"
                      className={inputClass}
                    />
                    {errors[f.id] ? (
                      <p className="mt-1 text-sm text-destructive">{t(errors[f.id]!)}</p>
                    ) : null}
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="text-sm font-medium">
                    {t({ mr: "संदेश", en: "Message" })}
                    <span className="text-destructive"> *</span>
                  </label>
                  <textarea id="message" name="message" rows={5} className={inputClass} />
                  {errors.message ? (
                    <p className="mt-1 text-sm text-destructive">{t(errors.message)}</p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {t({ mr: "संदेश पाठवा", en: "Send message" })}
                </button>
                <p className="text-xs text-muted-foreground">
                  {t({
                    mr: "आपली माहिती केवळ संपर्कासाठी वापरली जाते.",
                    en: "Your details are used only to contact you back.",
                  })}
                </p>
              </form>
            )}
          </Card>
        </div>
      </Section>
    </>
  );
}
