import { createFileRoute } from "@tanstack/react-router";
import { Card, EditableNote, PageHeader, Section } from "@/components/ui";
import { videos } from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "व्हिडिओ | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content: "गुरुकुलातील कीर्तन, प्रवचन व कार्यक्रमांचे अधिकृत व्हिडिओ.",
      },
      { property: "og:title", content: "व्हिडिओ | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "अधिकृत YouTube व्हिडिओ संग्रह." },
      { property: "og:url", content: "/videos" },
    ],
    links: [{ rel: "canonical", href: "/videos" }],
  }),
  component: Videos,
});

function Videos() {
  const { t, lang } = useLang();

  return (
    <>
      <PageHeader
        title={{ mr: "व्हिडिओ", en: "Videos" }}
        sub={{
          mr: "संस्थेच्या अधिकृत व्हिडिओ लिंक येथे दर्शवल्या जातात.",
          en: "The institution's official video links are shown here.",
        }}
      />
      <Section>
        {videos.length ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {videos.map((v) => (
              <Card key={v.title.en} className="flex flex-col">
                <div className="overflow-hidden rounded-xl border border-border bg-sand">
                  {v.youtubeId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                      title={t(v.title)}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  ) : (
                    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-center">
                      <span className="text-3xl" aria-hidden="true">
                        ▶
                      </span>
                      <p className="px-4 text-sm text-muted-foreground">
                        {t({
                          mr: "व्हिडिओ लिंक प्रशासनाकडून जोडली जाईल.",
                          en: "The video link will be added by the administration.",
                        })}
                      </p>
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-base">{t(v.title)}</h2>
                <p className="mt-1 text-sm font-semibold text-maroon">
                  {new Date(v.date).toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{t(v.description)}</p>
                {v.youtubeId ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-sm font-semibold text-maroon underline underline-offset-4"
                  >
                    {t({ mr: "YouTube वर पहा", en: "Watch on YouTube" })}
                  </a>
                ) : null}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {t({
              mr: "अधिकृत व्हिडिओ प्रशासनाकडून जोडले जातील.",
              en: "Official videos will be added by the administration.",
            })}
          </p>
        )}
        <EditableNote />
      </Section>
    </>
  );
}
