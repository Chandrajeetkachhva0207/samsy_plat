import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Card,
  EditableNote,
  PageHeader,
  Section,
} from "@/components/ui";
import { api } from "@/lib/api";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      {
        title: "व्हिडिओ | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        name: "description",
        content:
          "गुरुकुलातील कीर्तन, प्रवचन व कार्यक्रमांचे अधिकृत व्हिडिओ.",
      },
      {
        property: "og:title",
        content:
          "व्हिडिओ | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        property: "og:description",
        content:
          "अधिकृत YouTube व्हिडिओ संग्रह.",
      },
      {
        property: "og:url",
        content: "/videos",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/videos",
      },
    ],
  }),

  component: Videos,
});


/* =====================================================
   VIDEO TYPES
===================================================== */

interface BilingualText {
  mr?: string;
  en?: string;
}

interface VideoItem {
  _id: string;

  title:
    | BilingualText
    | string;

  url: string;

  date?: string;

  description?:
    | BilingualText
    | string;

  isActive?: boolean;
}


/* =====================================================
   VIDEOS PAGE
===================================================== */

function Videos() {
  const { t, lang } = useLang();

  const [videos, setVideos] =
    useState<VideoItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);


  /* ===================================================
     LOAD VIDEOS
  =================================================== */

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await api.getVideos();

        if (res.success && Array.isArray(res.data)) {
          const activeVideos = res.data.filter(
            (video: VideoItem) =>
              video.isActive !== false
          );

          setVideos(activeVideos);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error(
          "Failed to load videos:",
          error
        );

        setError(true);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);


  /* ===================================================
     PAGE
  =================================================== */

  return (
    <>
      <PageHeader
        title={{
          mr: "व्हिडिओ",
          en: "Videos",
        }}
        sub={{
          mr: "संस्थेच्या अधिकृत व्हिडिओ लिंक येथे दर्शवल्या जातात.",
          en: "The institution's official video links are shown here.",
        }}
      />

      <Section>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <p className="py-10 text-center text-muted-foreground">
            {t({
              mr: "व्हिडिओ लोड होत आहेत...",
              en: "Loading videos...",
            })}
          </p>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="py-10 text-center">
            <p className="text-base font-medium text-maroon">
              {t({
                mr: "व्हिडिओ लोड करता आले नाहीत.",
                en: "Unable to load videos.",
              })}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {t({
                mr: "कृपया पुन्हा प्रयत्न करा.",
                en: "Please try again.",
              })}
            </p>
          </div>
        )}


        {/* =================================================
            VIDEOS
        ================================================= */}

        {!loading &&
          !error &&
          videos.length > 0 && (

            <div className="grid gap-5 sm:grid-cols-2">

              {videos.map((video) => {

                const embedUrl =
                  getYoutubeEmbedUrl(
                    video.url
                  );

                const title =
                  getBilingualText(
                    video.title,
                    lang
                  );

                const description =
                  getBilingualText(
                    video.description,
                    lang
                  );

                return (
                  <Card
                    key={video._id}
                    className="flex flex-col"
                  >

                    {/* =====================================
                        YOUTUBE VIDEO
                    ===================================== */}

                    <div className="overflow-hidden rounded-xl border border-border bg-sand">

                      {embedUrl ? (

                        <iframe
                          src={embedUrl}
                          title={title || "YouTube Video"}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="aspect-video w-full"
                        />

                      ) : (

                        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-center">

                          <span
                            className="text-3xl"
                            aria-hidden="true"
                          >
                            ▶
                          </span>

                          <p className="px-4 text-sm text-muted-foreground">
                            {t({
                              mr: "YouTube व्हिडिओ लिंक उपलब्ध नाही.",
                              en: "YouTube video link is not available.",
                            })}
                          </p>

                        </div>

                      )}

                    </div>


                    {/* =====================================
                        TITLE
                    ===================================== */}

                    {title && (
                      <h2 className="mt-4 text-base font-semibold text-foreground">
                        {title}
                      </h2>
                    )}


                    {/* =====================================
                        DATE
                    ===================================== */}

                    {video.date && (
                      <p className="mt-1 text-sm font-semibold text-maroon">
                        {formatVideoDate(
                          video.date,
                          lang
                        )}
                      </p>
                    )}


                    {/* =====================================
                        DESCRIPTION
                    ===================================== */}

                    {description && (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    )}


                    {/* =====================================
                        YOUTUBE LINK
                    ===================================== */}

                    {video.url && (
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-sm font-semibold text-maroon underline underline-offset-4"
                      >
                        {t({
                          mr: "YouTube वर पहा",
                          en: "Watch on YouTube",
                        })}
                      </a>
                    )}

                  </Card>
                );
              })}

            </div>
          )}


        {/* =================================================
            NO VIDEOS
        ================================================= */}

        {!loading &&
          !error &&
          videos.length === 0 && (

            <p className="py-10 text-center text-muted-foreground">
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


/* =====================================================
   BILINGUAL TEXT HELPER
===================================================== */

function getBilingualText(
  value: BilingualText | string | undefined,
  lang: "mr" | "en"
): string {

  if (!value) {
    return "";
  }

  // Old data support
  if (typeof value === "string") {
    return value;
  }

  // Current bilingual data
  if (lang === "mr") {
    return (
      value.mr ||
      value.en ||
      ""
    );
  }

  return (
    value.en ||
    value.mr ||
    ""
  );
}


/* =====================================================
   YOUTUBE URL → EMBED URL
===================================================== */

function getYoutubeEmbedUrl(
  url: string
): string {

  try {

    const parsed =
      new URL(url);

    let videoId = "";


    /* ===============================================
       youtu.be/VIDEO_ID
    =============================================== */

    if (
      parsed.hostname.includes(
        "youtu.be"
      )
    ) {

      videoId =
        parsed.pathname
          .replace("/", "")
          .split("/")[0];

    }


    /* ===============================================
       youtube.com/watch?v=VIDEO_ID
    =============================================== */

    else if (
      parsed.hostname.includes(
        "youtube.com"
      )
    ) {

      videoId =
        parsed.searchParams.get(
          "v"
        ) || "";


      /* =============================================
         /shorts/VIDEO_ID
      ============================================= */

      if (
        !videoId &&
        parsed.pathname.startsWith(
          "/shorts/"
        )
      ) {

        videoId =
          parsed.pathname
            .split("/shorts/")[1]
            ?.split("/")[0] || "";

      }


      /* =============================================
         /embed/VIDEO_ID
      ============================================= */

      if (
        !videoId &&
        parsed.pathname.startsWith(
          "/embed/"
        )
      ) {

        videoId =
          parsed.pathname
            .split("/embed/")[1]
            ?.split("/")[0] || "";

      }

    }


    if (videoId) {

      return `https://www.youtube-nocookie.com/embed/${videoId}`;

    }

  } catch {
    // Invalid URL
  }

  return "";
}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatVideoDate(
  date: string,
  lang: "mr" | "en"
) {

  /*
   * Supports:
   * 2026-07-05
   * 05-07-2026
   * other normal date strings
   */

  let parsedDate: Date;

  /* ===============================================
     DD-MM-YYYY
  =============================================== */

  const ddmmyyyy =
    /^(\d{2})-(\d{2})-(\d{4})$/.exec(
      date
    );

  if (ddmmyyyy) {

    const day =
      Number(ddmmyyyy[1]);

    const month =
      Number(ddmmyyyy[2]) - 1;

    const year =
      Number(ddmmyyyy[3]);

    parsedDate =
      new Date(
        year,
        month,
        day
      );

  } else {

    parsedDate =
      new Date(date);

  }


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

    return date;

  }


  return parsedDate.toLocaleDateString(
    lang === "mr"
      ? "mr-IN"
      : "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}