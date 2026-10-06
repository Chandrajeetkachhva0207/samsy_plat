import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import {
  ExternalLink,
  Play,
  Upload,
  Youtube,
} from "lucide-react";

import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { useLang } from "@/lib/lang";

type BilingualText = {
  mr: string;
  en: string;
};

type VideoItem = {
  _id: string;
  title: BilingualText | string;
  url: string;
  videoType?: "youtube" | "upload";
  cloudinaryPublicId?: string;
  description?: BilingualText | string;
  isActive?: boolean;
  createdAt?: string;
};

/* =========================================================
   BILINGUAL HELPER
========================================================= */

function getBilingualText(value: unknown): BilingualText {
  if (typeof value === "string") {
    return {
      mr: value,
      en: value,
    };
  }

  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;

    return {
      mr: typeof item.mr === "string" ? item.mr : "",
      en: typeof item.en === "string" ? item.en : "",
    };
  }

  return {
    mr: "",
    en: "",
  };
}

/* =========================================================
   YOUTUBE HELPERS
========================================================= */

function isYoutubeUrl(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    /* youtu.be/VIDEO_ID */
    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "").trim();

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    /* youtube.com/watch?v=VIDEO_ID */
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);

      /* youtube.com/shorts/VIDEO_ID */
      if (parts[0] === "shorts" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }

      /* youtube.com/embed/VIDEO_ID */
      if (parts[0] === "embed" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
    }
  } catch {
    return "";
  }

  return "";
}

/* =========================================================
   PAGE
========================================================= */

function VideosPage() {
  /* =========================================================
     USE SAME LANGUAGE SYSTEM AS HEADER
  ========================================================= */

  const { lang: language } = useLang();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD VIDEOS
  ========================================================= */

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getVideos();

        const data = Array.isArray(response)
          ? response
          : response?.data || [];

        const activeVideos = data.filter(
          (video: VideoItem) =>
            video.isActive !== false
        );

        setVideos(activeVideos);
      } catch (err) {
        console.error(err);

        setError(
          language === "mr"
            ? "व्हिडिओ लोड करताना समस्या आली. कृपया पुन्हा प्रयत्न करा."
            : "There was a problem loading the videos. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [language]);

  /* =========================================================
     TRANSLATIONS
  ========================================================= */

  const text = {
    mr: {
      heroTitle: "व्हिडिओ",

      heroDescription:
        "संस्थेच्या अधिकृत व्हिडिओ येथे प्रदर्शित केले जातात.",

      galleryLabel: "व्हिडिओ गॅलरी",

      galleryTitle: "आमचे व्हिडिओ",

      total: "एकूण",

      videos: "व्हिडिओ",

      youtube: "YouTube",

      officialVideo: "संस्थेचा व्हिडिओ",

      youtubeWatch: "YouTube वर पहा",

      openVideo: "व्हिडिओ उघडा",

      loading: "व्हिडिओ लोड होत आहेत...",

      emptyTitle:
        "सध्या कोणतेही व्हिडिओ उपलब्ध नाहीत",

      emptyDescription:
        "संस्थेकडून व्हिडिओ उपलब्ध झाल्यानंतर ते येथे प्रदर्शित केले जातील.",

      browserError:
        "आपल्या ब्राउझरमध्ये व्हिडिओ प्ले करता येत नाही.",
    },

    en: {
      heroTitle: "Videos",

      heroDescription:
        "Official videos of the institution are displayed here.",

      galleryLabel: "VIDEO GALLERY",

      galleryTitle: "Our Videos",

      total: "Total",

      videos: "Videos",

      youtube: "YouTube",

      officialVideo: "Institution Video",

      youtubeWatch: "Watch on YouTube",

      openVideo: "Open Video",

      loading: "Loading videos...",

      emptyTitle: "No videos available",

      emptyDescription:
        "Videos will be displayed here once they are uploaded by the institution.",

      browserError:
        "Your browser does not support video playback.",
    },
  };

  const currentText = text[language];

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#fffdf9]">

      {/* =====================================================
          HERO
      ===================================================== */}

      {/* =====================================================
    HERO
===================================================== */}

      <PageHeader
        title={{
          mr: "व्हिडिओ",
          en: "Videos",
        }}
        sub={{
          mr: "संस्थेच्या अधिकृत व्हिडिओ येथे प्रदर्शित केले जातात.",
          en: "Official videos of the institution are displayed here.",
        }}
      />

      {/* =====================================================
          VIDEO SECTION
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

        {/* Loading */}

        {loading && (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex flex-col items-center">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

              <p className="mt-4 text-sm text-[#765d50]">
                {currentText.loading}
              </p>

            </div>

          </div>
        )}

        {/* Error */}

        {!loading && error && (

          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

            <p className="font-medium text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          videos.length === 0 && (

            <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-[#dfcdb8] bg-[#fffaf3] px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">

                <Play className="h-7 w-7 text-orange-500" />

              </div>

              <h2 className="mt-5 text-xl font-semibold text-[#603528]">
                {currentText.emptyTitle}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#765d50]">
                {currentText.emptyDescription}
              </p>

            </div>
          )}

        {/* ===================================================
            VIDEOS
        =================================================== */}

        {!loading &&
          !error &&
          videos.length > 0 && (

            <>

              {/* =================================================
                  VIDEO GRID
              ================================================= */}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {videos.map((video) => {

                  const title =
                    getBilingualText(video.title);

                  const description =
                    getBilingualText(video.description);

                  const youtube =
                    video.videoType === "youtube" ||
                    (!video.videoType &&
                      isYoutubeUrl(video.url));

                  const embedUrl = youtube
                    ? getYoutubeEmbedUrl(video.url)
                    : "";

                  /* =================================================
                     SELECT TITLE BASED ON CURRENT WEBSITE LANGUAGE
                  ================================================= */

                  const displayTitle =
                    language === "mr"
                      ? title.mr || title.en
                      : title.en || title.mr;

                  /* =================================================
                     SELECT DESCRIPTION BASED ON CURRENT WEBSITE LANGUAGE
                  ================================================= */

                  const displayDescription =
                    language === "mr"
                      ? description.mr ||
                      description.en
                      : description.en ||
                      description.mr;

                  return (

                    <article
                      key={video._id}
                      className="group overflow-hidden rounded-2xl border border-[#eadfce] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >

                      {/* Video frame */}

                      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f5ede1]">

                        {youtube &&
                          embedUrl ? (

                          <iframe
                            src={embedUrl}
                            title={
                              displayTitle ||
                              "Maa Narmada Sanstha Video"
                            }
                            className="h-full w-full"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />

                        ) : (

                          <video
                            src={video.url}
                            controls
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-contain"
                          >
                            {
                              currentText.browserError
                            }
                          </video>

                        )}

                      </div>

                      {/* Card content */}

                      <div className="px-2 pb-2 pt-5">

                        {/* Type */}

                        <div className="mb-3">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${youtube
                                ? "bg-red-50 text-red-700"
                                : "bg-orange-50 text-orange-700"
                              }`}
                          >

                            {youtube ? (

                              <>

                                <Youtube className="h-3.5 w-3.5" />

                                {
                                  currentText.youtube
                                }

                              </>

                            ) : (

                              <>

                                <Upload className="h-3.5 w-3.5" />

                                {
                                  currentText.officialVideo
                                }

                              </>

                            )}

                          </span>

                        </div>

                        {/* Title */}

                        <h3 className="text-xl font-semibold leading-7 text-[#4d2d21]">

                          {displayTitle ||
                            currentText.heroTitle}

                        </h3>

                        {/* Description */}

                        {displayDescription && (

                          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#765d50]">

                            {displayDescription}

                          </p>

                        )}

                        {/* Open button */}

                        <div className="mt-5">

                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-[#e5cdb8] bg-white px-4 py-2.5 text-sm font-semibold text-[#704a38] transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                          >

                            <ExternalLink className="h-4 w-4" />

                            {youtube
                              ? currentText.youtubeWatch
                              : currentText.openVideo}

                          </a>

                        </div>

                      </div>

                    </article>

                  );
                })}

              </div>

            </>

          )}

      </section>

    </main>
  );
}

/* =========================================================
   ROUTE
========================================================= */

export const Route = createFileRoute("/videos")({
  component: VideosPage,
});