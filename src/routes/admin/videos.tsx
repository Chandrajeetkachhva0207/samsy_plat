import React, { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import {
  ExternalLink,
  Play,
  Plus,
  Trash2,
  Upload,
  Youtube,
} from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/videos")({
  head: () => ({
    meta: [{ title: "व्हिडिओ व्यवस्थापन — प्रशासकीय पॅनेल" }],
  }),
  component: AdminVideos,
});

type BilingualText = {
  mr: string;
  en: string;
};

interface VideoItem {
  _id: string;
  title: BilingualText | string;
  url: string;
  videoType?: "youtube" | "upload";
  cloudinaryPublicId?: string;
  description?: BilingualText | string;
  isActive?: boolean;
  createdAt?: string;
}

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

/* =========================================================
   HELPERS
========================================================= */

function getBilingualText(value: unknown): BilingualText {
  if (typeof value === "string") {
    return {
      mr: value,
      en: "",
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

function isYoutubeUrl(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "").trim();

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);

      if (parts[0] === "shorts" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }

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
   ADMIN VIDEOS
========================================================= */

function AdminVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [sourceType, setSourceType] = useState<"youtube" | "upload">(
    "youtube"
  );

  const [form, setForm] = useState({
    titleMr: "",
    titleEn: "",
    youtubeUrl: "",
    descriptionMr: "",
    descriptionEn: "",
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     LOAD VIDEOS
  ========================================================= */

  const loadVideos = async () => {
    setLoading(true);

    try {
      setError("");

      const response = await api.getVideos();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setVideos(data);
    } catch (err) {
      console.error("Failed to load videos:", err);

      setVideos([]);

      setError("व्हिडिओ लोड करताना समस्या आली.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setForm({
      titleMr: "",
      titleEn: "",
      youtubeUrl: "",
      descriptionMr: "",
      descriptionEn: "",
    });

    setVideoFile(null);

    setSourceType("youtube");

    const fileInput = document.getElementById(
      "video-file"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /* =========================================================
     OPEN MODAL
  ========================================================= */

  const openModal = () => {
    setError("");
    setSuccess("");

    resetForm();

    setShowModal(true);
  };

  /* =========================================================
     FILE CHANGE
  ========================================================= */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    setError("");
    setSuccess("");

    if (!file) {
      setVideoFile(null);
      return;
    }

    if (!file.type.startsWith("video/")) {
      setVideoFile(null);

      event.target.value = "";

      setError("कृपया फक्त video file निवडा.");

      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setVideoFile(null);

      event.target.value = "";

      setError("व्हिडिओचा कमाल आकार 100 MB असू शकतो.");

      return;
    }

    setVideoFile(file);
  };

  /* =========================================================
     ADD VIDEO
  ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* -----------------------------------------
       TITLE VALIDATION
    ----------------------------------------- */

    if (!form.titleMr.trim()) {
      setError("कृपया व्हिडिओचे नाव मराठीत भरा.");
      return;
    }

    if (!form.titleEn.trim()) {
      setError("कृपया व्हिडिओचे नाव English मध्ये भरा.");
      return;
    }

    /* -----------------------------------------
       DESCRIPTION VALIDATION
    ----------------------------------------- */

    if (!form.descriptionMr.trim()) {
      setError("कृपया व्हिडिओचे वर्णन मराठीत भरा.");
      return;
    }

    if (!form.descriptionEn.trim()) {
      setError("कृपया व्हिडिओचे वर्णन English मध्ये भरा.");
      return;
    }

    /* -----------------------------------------
       YOUTUBE VALIDATION
    ----------------------------------------- */

    if (sourceType === "youtube") {
      if (!form.youtubeUrl.trim()) {
        setError("कृपया YouTube URL भरा.");
        return;
      }

      if (!isYoutubeUrl(form.youtubeUrl.trim())) {
        setError("कृपया योग्य YouTube URL भरा.");
        return;
      }
    }

    /* -----------------------------------------
       UPLOAD VALIDATION
    ----------------------------------------- */

    if (sourceType === "upload") {
      if (!videoFile) {
        setError("कृपया व्हिडिओ file निवडा.");
        return;
      }

      if (videoFile.size > MAX_VIDEO_SIZE) {
        setError("व्हिडिओचा कमाल आकार 100 MB असू शकतो.");
        return;
      }
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      /* -----------------------------------------
         IMPORTANT:
         Marathi and English are stored separately.
         NO FALLBACK FROM MR -> EN.
      ----------------------------------------- */

      formData.append(
        "title",
        JSON.stringify({
          mr: form.titleMr.trim(),
          en: form.titleEn.trim(),
        })
      );

      formData.append(
        "description",
        JSON.stringify({
          mr: form.descriptionMr.trim(),
          en: form.descriptionEn.trim(),
        })
      );

      /* -----------------------------------------
         VIDEO SOURCE
      ----------------------------------------- */

      if (sourceType === "youtube") {
        formData.append(
          "url",
          form.youtubeUrl.trim()
        );

        formData.append(
          "videoType",
          "youtube"
        );
      } else {
        formData.append(
          "video",
          videoFile as File
        );

        formData.append(
          "videoType",
          "upload"
        );
      }

      /* -----------------------------------------
         API REQUEST
      ----------------------------------------- */

      await api.createVideo(formData);

      setSuccess(
        sourceType === "youtube"
          ? "YouTube व्हिडिओ यशस्वीपणे जोडला."
          : "व्हिडिओ यशस्वीपणे upload झाला."
      );

      setShowModal(false);

      resetForm();

      await loadVideos();
    } catch (err) {
      console.error("Video upload error:", err);

      setError(
        "व्हिडिओ जोडताना समस्या आली. कृपया पुन्हा प्रयत्न करा."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DELETE VIDEO
  ========================================================= */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "हा व्हिडिओ कायमचा हटवायचा आहे का?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      setError("");
      setSuccess("");

      await api.deleteVideo(id);

      setVideos((current) =>
        current.filter(
          (video) => video._id !== id
        )
      );

      setSuccess(
        "व्हिडिओ यशस्वीपणे हटवला."
      );
    } catch (err) {
      console.error("Delete video error:", err);

      setError(
        "व्हिडिओ हटवताना समस्या आली."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <AdminLayout
      title="व्हिडिओ व्यवस्थापन (Manage Videos)"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          संस्थेचे YouTube किंवा upload केलेले व्हिडिओ
          जोडा किंवा हटवा.
        </p>

        <button
          onClick={openModal}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />

          <span>
            नवीन व्हिडिओ जोडा
          </span>
        </button>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          व्हिडिओ लोड होत आहेत...
        </div>
      ) : videos.length === 0 ? (
        /* ===================================================
           EMPTY
        =================================================== */

        <Card className="p-8 text-center text-sm text-muted-foreground">
          <Play className="mx-auto mb-3 h-10 w-10 opacity-40" />

          सध्या कोणतेही व्हिडिओ उपलब्ध नाहीत.

          <br />

          व्हिडिओ जोडण्यासाठी वरील बटणावर क्लिक करा.
        </Card>
      ) : (
        /* ===================================================
           VIDEO GRID
        =================================================== */

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const title = getBilingualText(
              video.title
            );

            const description =
              getBilingualText(
                video.description
              );

            const youtube =
              video.videoType === "youtube" ||
              (!video.videoType &&
                isYoutubeUrl(video.url));

            const embedUrl = youtube
              ? getYoutubeEmbedUrl(video.url)
              : "";

            /*
             * Admin page shows Marathi title first.
             * English title is shown separately only
             * when it is actually different.
             */

            const displayTitle =
              title.mr ||
              title.en ||
              "Untitled Video";

            const displayEnglishTitle =
              title.en &&
              title.en !== title.mr
                ? title.en
                : "";

            return (
              <Card
                key={video._id}
                className="group overflow-hidden"
              >
                {/* =================================================
                    VIDEO PREVIEW
                ================================================= */}

                <div className="aspect-video bg-slate-100">
                  {youtube && embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={displayTitle}
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
                      आपल्या ब्राउझरमध्ये व्हिडिओ प्ले करता येत नाही.
                    </video>
                  )}
                </div>

                {/* =================================================
                    VIDEO DETAILS
                ================================================= */}

                <div className="border-t border-border bg-card p-3">

                  {/* TYPE */}

                  <div className="mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold ${
                        youtube
                          ? "bg-red-50 text-red-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {youtube ? (
                        <>
                          <Youtube className="h-3.5 w-3.5" />
                          YouTube
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          Uploaded Video
                        </>
                      )}
                    </span>
                  </div>

                  {/* MARATHI TITLE */}

                  <p className="truncate text-sm font-semibold text-foreground">
                    {displayTitle}
                  </p>

                  {/* ENGLISH TITLE */}

                  {displayEnglishTitle && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {displayEnglishTitle}
                    </p>
                  )}

                  {/* DESCRIPTION */}

                  {(description.mr ||
                    description.en) && (
                    <div className="mt-2 space-y-1">
                      {description.mr && (
                        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {description.mr}
                        </p>
                      )}

                      {description.en &&
                        description.en !==
                          description.mr && (
                          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {description.en}
                          </p>
                        )}
                    </div>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />

                      Open
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          video._id
                        )
                      }
                      disabled={
                        deletingId ===
                        video._id
                      }
                      className="flex items-center gap-1 text-xs text-red-600 hover:underline disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />

                      {deletingId ===
                      video._id
                        ? "Deleting..."
                        : "हटवा (Delete)"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* =====================================================
          ADD VIDEO MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-md overflow-y-auto p-6">

            {/* MODAL HEADER */}

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Play className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-maroon">
                  नवीन व्हिडिओ जोडणे
                </h2>

                <p className="text-xs text-muted-foreground">
                  Add Video
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 text-sm"
            >

              {/* =================================================
                  VIDEO TYPE
              ================================================= */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  व्हिडिओचा प्रकार (Video Type)
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* YOUTUBE */}

                  <button
                    type="button"
                    onClick={() => {
                      setSourceType("youtube");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                      sourceType === "youtube"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-border bg-background text-muted-foreground hover:border-red-200"
                    }`}
                  >
                    <Youtube className="h-4 w-4" />

                    YouTube
                  </button>

                  {/* UPLOAD */}

                  <button
                    type="button"
                    onClick={() => {
                      setSourceType("upload");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                      sourceType === "upload"
                        ? "border-orange-300 bg-orange-50 text-orange-700"
                        : "border-border bg-background text-muted-foreground hover:border-orange-200"
                    }`}
                  >
                    <Upload className="h-4 w-4" />

                    Upload
                  </button>
                </div>
              </div>

              {/* =================================================
                  VIDEO FILE
              ================================================= */}

              {sourceType === "upload" && (
                <div>
                  <label
                    htmlFor="video-file"
                    className="mb-1 block text-xs font-semibold"
                  >
                    व्हिडिओ निवडा (Select Video File)
                  </label>

                  <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50/50 p-3">

                    <input
                      id="video-file"
                      type="file"
                      accept="video/*"
                      onChange={
                        handleFileChange
                      }
                      className="w-full text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
                    />

                    <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                      Mobile किंवा laptop मधून
                      video निवडा.
                      <br />
                      Maximum size: 100 MB.
                    </p>

                    {videoFile && (
                      <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs">
                        <span className="font-semibold">
                          Selected:
                        </span>{" "}
                        {videoFile.name}

                        <br />

                        <span className="text-muted-foreground">
                          {(
                            videoFile.size /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =================================================
                  YOUTUBE URL
              ================================================= */}

              {sourceType === "youtube" && (
                <div>
                  <label
                    htmlFor="youtube-url"
                    className="mb-1 block text-xs font-semibold"
                  >
                    YouTube URL
                  </label>

                  <input
                    id="youtube-url"
                    type="url"
                    value={form.youtubeUrl}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        youtubeUrl:
                          e.target.value,
                      })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    YouTube video, Shorts किंवा
                    youtu.be URL वापरू शकता.
                  </p>
                </div>
              )}

              {/* =================================================
                  MARATHI TITLE
              ================================================= */}

              <div>
                <label
                  htmlFor="title-mr"
                  className="mb-1 block text-xs font-semibold"
                >
                  व्हिडिओचे नाव (मराठी) *
                </label>

                <input
                  id="title-mr"
                  type="text"
                  required
                  value={form.titleMr}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      titleMr:
                        e.target.value,
                    })
                  }
                  placeholder="व्हिडिओचे नाव"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* =================================================
                  ENGLISH TITLE
              ================================================= */}

              <div>
                <label
                  htmlFor="title-en"
                  className="mb-1 block text-xs font-semibold"
                >
                  Video Title (English) *
                </label>

                <input
                  id="title-en"
                  type="text"
                  required
                  value={form.titleEn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      titleEn:
                        e.target.value,
                    })
                  }
                  placeholder="Video title"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* =================================================
                  MARATHI DESCRIPTION
              ================================================= */}

              <div>
                <label
                  htmlFor="description-mr"
                  className="mb-1 block text-xs font-semibold"
                >
                  वर्णन (मराठी) *
                </label>

                <textarea
                  id="description-mr"
                  required
                  value={form.descriptionMr}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descriptionMr:
                        e.target.value,
                    })
                  }
                  placeholder="व्हिडिओबद्दल थोडक्यात माहिती"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* =================================================
                  ENGLISH DESCRIPTION
              ================================================= */}

              <div>
                <label
                  htmlFor="description-en"
                  className="mb-1 block text-xs font-semibold"
                >
                  Description (English) *
                </label>

                <textarea
                  id="description-en"
                  required
                  value={form.descriptionEn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descriptionEn:
                        e.target.value,
                    })
                  }
                  placeholder="Short video description"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex justify-end gap-3 pt-2">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                    setError("");
                  }}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                >
                  रद्द करा
                </button>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      {sourceType === "upload"
                        ? "अपलोड होत आहे..."
                        : "जोडत आहे..."}
                    </>
                  ) : (
                    <>
                      {sourceType === "upload" ? (
                        <Upload className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}

                      {sourceType === "upload"
                        ? "जोडा (Upload)"
                        : "जोडा (Add)"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}