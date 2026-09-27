import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";

import {
  Plus,
  Trash2,
  Video as VideoIcon,
  Youtube,
} from "lucide-react";

export const Route = createFileRoute("/admin/videos")({
  head: () => ({
    meta: [
      {
        title: "व्हिडिओ व्यवस्थापन — प्रशासकीय पॅनेल",
      },
    ],
  }),
  component: AdminVideos,
});

interface BilingualText {
  mr: string;
  en: string;
}

interface VideoItem {
  _id: string;
  title: BilingualText | string;
  url: string;
  date?: string;
  description?: BilingualText | string;
  isActive?: boolean;
}

function AdminVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  /* =========================================
     BILINGUAL FORM DATA
  ========================================= */

  const [titleMr, setTitleMr] = useState("");
  const [titleEn, setTitleEn] = useState("");

  const [url, setUrl] = useState("");
  const [date, setDate] = useState("");

  const [descriptionMr, setDescriptionMr] =
    useState("");

  const [descriptionEn, setDescriptionEn] =
    useState("");

  const [saving, setSaving] = useState(false);

  /* =========================================
     LOAD VIDEOS
  ========================================= */

  const loadVideos = async () => {
    try {
      setLoading(true);

      const res = await api.getVideos();

      if (res.success) {
        setVideos(res.data || []);
      }
    } catch (error) {
      console.error(
        "Failed to load videos:",
        error
      );

      alert(
        "व्हिडिओ लोड करण्यात अडचण आली."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  /* =========================================
     ADD VIDEO
  ========================================= */

  const handleAddVideo = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!titleMr.trim()) {
      alert(
        "कृपया व्हिडिओचे मराठी शीर्षक भरा."
      );
      return;
    }

    if (!titleEn.trim()) {
      alert(
        "Please enter the English video title."
      );
      return;
    }

    if (!url.trim()) {
      alert(
        "कृपया YouTube URL भरा."
      );
      return;
    }

    if (
      !url.includes("youtube.com") &&
      !url.includes("youtu.be")
    ) {
      alert(
        "कृपया योग्य YouTube URL द्या."
      );
      return;
    }

    try {
      setSaving(true);

      await api.createVideo({
        title: {
          mr: titleMr.trim(),
          en: titleEn.trim(),
        },

        url: url.trim(),

        date:
          date ||
          new Date().toISOString(),

        description: {
          mr: descriptionMr.trim(),
          en: descriptionEn.trim(),
        },

        isActive: true,
      });

      alert(
        "व्हिडिओ यशस्वीरित्या जोडला."
      );

      /* Reset form */

      setTitleMr("");
      setTitleEn("");

      setUrl("");
      setDate("");

      setDescriptionMr("");
      setDescriptionEn("");

      setShowForm(false);

      await loadVideos();
    } catch (error: any) {
      console.error(
        "Create video error:",
        error
      );

      alert(
        error?.message ||
          "व्हिडिओ जोडताना अडचण आली."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     DELETE VIDEO
  ========================================= */

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "हा व्हिडिओ हटवायचा आहे का?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteVideo(id);

      alert(
        "व्हिडिओ यशस्वीरित्या हटवला."
      );

      await loadVideos();
    } catch (error: any) {
      console.error(
        "Delete video error:",
        error
      );

      alert(
        error?.message ||
          "व्हिडिओ हटवताना अडचण आली."
      );
    }
  };

  /* =========================================
     GET BILINGUAL TEXT
  ========================================= */

  const getText = (
    value:
      | BilingualText
      | string
      | undefined,
    language: "mr" | "en"
  ) => {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    return (
      value[language] ||
      value.mr ||
      value.en ||
      ""
    );
  };

  return (
    <AdminLayout title="व्हिडिओ व्यवस्थापन (Manage Videos)">
      <div className="space-y-8">

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              संस्थेचे अधिकृत YouTube व्हिडिओ येथे जोडा किंवा हटवा.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowForm(!showForm)
            }
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />

            {showForm
              ? "फॉर्म बंद करा"
              : "नवीन व्हिडिओ जोडा"}
          </button>
        </div>

        {/* =========================================
            ADD VIDEO FORM
        ========================================= */}

        {showForm && (
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />

              <h2 className="text-lg font-bold text-maroon">
                नवीन व्हिडिओ जोडा
              </h2>
            </div>

            <form
              onSubmit={handleAddVideo}
              className="space-y-5"
            >

              {/* =====================================
                  MARATHI TITLE
              ===================================== */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  व्हिडिओ शीर्षक (मराठी)
                </label>

                <input
                  type="text"
                  value={titleMr}
                  onChange={(e) =>
                    setTitleMr(e.target.value)
                  }
                  placeholder="उदा. गुरुपौर्णिमा उत्सव"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* =====================================
                  ENGLISH TITLE
              ===================================== */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Video Title (English)
                </label>

                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) =>
                    setTitleEn(e.target.value)
                  }
                  placeholder="e.g. Guru Purnima Celebration"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* =====================================
                  YOUTUBE URL
              ===================================== */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  YouTube Video URL
                </label>

                <input
                  type="url"
                  value={url}
                  onChange={(e) =>
                    setUrl(e.target.value)
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />

                <p className="mt-1.5 text-xs text-muted-foreground">
                  YouTube video ची पूर्ण URL येथे paste करा.
                </p>
              </div>

              {/* =====================================
                  DATE
              ===================================== */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  दिनांक
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* =====================================
                  MARATHI DESCRIPTION
              ===================================== */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  वर्णन (मराठी)
                </label>

                <textarea
                  value={descriptionMr}
                  onChange={(e) =>
                    setDescriptionMr(
                      e.target.value
                    )
                  }
                  placeholder="व्हिडिओबद्दल मराठीत माहिती..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* =====================================
                  ENGLISH DESCRIPTION
              ===================================== */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Description (English)
                </label>

                <textarea
                  value={descriptionEn}
                  onChange={(e) =>
                    setDescriptionEn(
                      e.target.value
                    )
                  }
                  placeholder="Enter video description in English..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* =====================================
                  BUTTONS
              ===================================== */}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {saving
                    ? "जतन करत आहे..."
                    : "व्हिडिओ जतन करा"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
                >
                  रद्द करा
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* =========================================
            VIDEO LIST
        ========================================= */}

        <div>
          <div className="mb-4 flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-maroon" />

            <h2 className="text-lg font-bold text-maroon">
              जोडलेले व्हिडिओ
            </h2>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              व्हिडिओ लोड होत आहेत...
            </div>
          ) : videos.length === 0 ? (
            <Card className="p-8 text-center">
              <VideoIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                अजून कोणताही व्हिडिओ जोडलेला नाही.
              </p>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {videos.map((video) => (
                <Card
                  key={video._id}
                  className="overflow-hidden"
                >
                  {/* Video */}
                  <div className="aspect-video bg-sand">
                    <iframe
                      src={getYoutubeEmbedUrl(
                        video.url
                      )}
                      title={getText(
                        video.title,
                        "en"
                      )}
                      className="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">

                    {/* Marathi title */}
                    <h3 className="font-semibold text-maroon">
                      {getText(
                        video.title,
                        "mr"
                      )}
                    </h3>

                    {/* English title */}
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {getText(
                        video.title,
                        "en"
                      )}
                    </p>

                    {/* Marathi description */}
                    {getText(
                      video.description,
                      "mr"
                    ) && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {getText(
                          video.description,
                          "mr"
                        )}
                      </p>
                    )}

                    {/* English description */}
                    {getText(
                      video.description,
                      "en"
                    ) && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {getText(
                          video.description,
                          "en"
                        )}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-maroon underline underline-offset-4"
                      >
                        YouTube वर पहा
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            video._id
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />

                        हटवा
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

/* =====================================================
   YOUTUBE URL → EMBED URL
===================================================== */

function getYoutubeEmbedUrl(
  url: string
): string {
  try {
    const parsed = new URL(url);

    let videoId = "";

    if (
      parsed.hostname.includes(
        "youtu.be"
      )
    ) {
      videoId =
        parsed.pathname.slice(1);
    } else if (
      parsed.hostname.includes(
        "youtube.com"
      )
    ) {
      videoId =
        parsed.searchParams.get("v") ||
        "";

      if (
        !videoId &&
        parsed.pathname.startsWith(
          "/shorts/"
        )
      ) {
        videoId =
          parsed.pathname.split(
            "/shorts/"
          )[1];
      }

      if (
        !videoId &&
        parsed.pathname.startsWith(
          "/embed/"
        )
      ) {
        videoId =
          parsed.pathname.split(
            "/embed/"
          )[1];
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