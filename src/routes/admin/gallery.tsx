import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api, getGalleryImageUrl } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [{ title: "फोटो गॅलरी व्यवस्थापन — प्रशासकीय पॅनेल" }],
  }),
  component: AdminGallery,
});

interface GalleryItem {
  _id: string;
  image?: string;
  imageUrl?: string;
  url?: string;
  caption?: {
    mr?: string;
    en?: string;
  } | string;
  category?: string;
  isActive?: boolean;
}

function AdminGallery() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    captionMr: "",
    captionEn: "",
    category: "general",
    imageUrl: "",
  });

  const [file, setFile] = useState<File | null>(null);

  // =====================================================
  // LOAD GALLERY
  // =====================================================

  const loadGallery = async () => {
    setLoading(true);

    try {
      const res = await api.getGallery();

      if (res.success && Array.isArray(res.data)) {
        console.log("Gallery data from backend:", res.data);
        setPhotos(res.data);
      } else {
        setPhotos([]);
      }
    } catch (err) {
      console.error("Failed to load gallery:", err);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  // =====================================================
  // DELETE PHOTO
  // =====================================================

  const handleDelete = async (id: string) => {
    if (!confirm("हा फोटो हटवायचा आहे का?")) return;

    try {
      await api.deleteGalleryItem(id);

      setPhotos((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (err: any) {
      alert(err.message || "हटवताना त्रुटी आली.");
    }
  };

  // =====================================================
  // ADD / UPLOAD PHOTO
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!file && !form.imageUrl.trim()) {
      alert(
        "कृपया फोटो निवडा किंवा Image URL द्या."
      );
      return;
    }

    if (!form.captionMr.trim()) {
      alert("कृपया फोटोचे कॅप्शन भरा.");
      return;
    }

    setSubmitting(true);

    try {
      // -------------------------------------------------
      // FILE UPLOAD
      // -------------------------------------------------

      if (file) {
        const formData = new FormData();

        formData.append("image", file);

        formData.append(
          "captionMr",
          form.captionMr.trim()
        );

        formData.append(
          "captionEn",
          form.captionEn.trim() ||
            form.captionMr.trim()
        );

        formData.append(
          "category",
          form.category
        );

        formData.append("isActive", "true");

        await api.createGalleryItem(formData);
      }

      // -------------------------------------------------
      // IMAGE URL
      // -------------------------------------------------

      else {
        const payload = {
          imageUrl: form.imageUrl.trim(),

          caption: {
            mr: form.captionMr.trim(),
            en:
              form.captionEn.trim() ||
              form.captionMr.trim(),
          },

          category: form.category,

          isActive: true,
        };

        await api.createGalleryItem(payload);
      }

      // -------------------------------------------------
      // RESET FORM
      // -------------------------------------------------

      setShowModal(false);

      setForm({
        captionMr: "",
        captionEn: "",
        category: "general",
        imageUrl: "",
      });

      setFile(null);

      // Reload gallery
      await loadGallery();
    } catch (err: any) {
      console.error(
        "Gallery upload error:",
        err
      );

      alert(
        err.message ||
          "फोटो अपलोड करताना त्रुटी आली."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <AdminLayout
      title="फोटो गॅलरी व्यवस्थापन (Manage Gallery)"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          गुरुकुलाच्या फोटो गॅलरीमध्ये नवीन फोटो
          अपलोड करा किंवा हटवा.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-xs"
        >
          <Plus className="h-4 w-4" />

          <span>नवीन फोटो जोडा</span>
        </button>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          फोटो लोड होत आहेत...
        </div>
      ) : photos.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          सध्या कोणतेही फोटो उपलब्ध नाहीत.
          <br />
          फोटो जोडण्यासाठी वरील बटणावर क्लिक करा.
        </Card>
      ) : (
        /* =================================================
           GALLERY GRID
        ================================================= */

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => {
            // Get actual image path returned by backend
            const imgSrc =
              p.image ||
              p.imageUrl ||
              p.url ||
              "";

            // Convert backend path into complete URL
            const finalImageUrl =
              getGalleryImageUrl(imgSrc);

            // Caption
            const captionStr =
              typeof p.caption === "string"
                ? p.caption
                : p.caption?.mr ||
                  p.caption?.en ||
                  "गॅलरी फोटो";

            return (
              <Card
                key={p._id}
                className="group relative overflow-hidden"
              >
                {/* =================================================
                    ACTUAL UPLOADED IMAGE
                ================================================= */}

                {finalImageUrl ? (
                  <img
                    src={finalImageUrl}
                    alt={captionStr}
                    className="aspect-square w-full object-cover"
                    onError={(e) => {
                      console.error(
                        "Gallery image failed to load:",
                        finalImageUrl
                      );

                      // Do NOT replace it with hero image.
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-sand text-xs text-muted-foreground">
                    फोटो उपलब्ध नाही
                  </div>
                )}

                {/* =================================================
                    PHOTO DETAILS
                ================================================= */}

                <div className="border-t border-border bg-card p-3">
                  <p className="truncate text-xs font-medium text-foreground">
                    {captionStr}
                  </p>

                  {/* Category */}
                  {p.category && (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {p.category}
                    </p>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() =>
                      handleDelete(p._id)
                    }
                    className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />

                    <span>
                      हटवा (Delete)
                    </span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* =====================================================
          ADD PHOTO MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-md overflow-y-auto p-6">
            <h2 className="mb-4 text-lg font-bold text-maroon">
              नवीन फोटो जोडणे (Add Photo)
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 text-sm"
            >
              {/* =================================================
                  IMAGE FILE
              ================================================= */}

              <div>
                <label className="mb-1 block text-xs font-semibold">
                  फोटो निवडा (Select Image File)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFile(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  className="w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
                />
              </div>

              {/* OR */}

              <div className="text-center text-xs font-semibold text-muted-foreground">
                किंवा (OR)
              </div>

              {/* =================================================
                  IMAGE URL
              ================================================= */}

              <div>
                <label className="mb-1 block text-xs font-semibold">
                  इमेज URL (Image URL path)
                </label>

                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      imageUrl:
                        e.target.value,
                    })
                  }
                  placeholder="/images/hero-gurukul.jpg"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* =================================================
                  MARATHI CAPTION
              ================================================= */}

              <div>
                <label className="mb-1 block text-xs font-semibold">
                  शीर्षक / कॅप्शन (Caption - Marathi)
                </label>

                <input
                  type="text"
                  required
                  value={form.captionMr}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      captionMr:
                        e.target.value,
                    })
                  }
                  placeholder="उदा. गुरुकुलातील विद्यार्थी अभ्यास करताना"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* =================================================
                  ENGLISH CAPTION
              ================================================= */}

              <div>
                <label className="mb-1 block text-xs font-semibold">
                  Caption (English)
                </label>

                <input
                  type="text"
                  value={form.captionEn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      captionEn:
                        e.target.value,
                    })
                  }
                  placeholder="Students studying at Gurukul"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div>
                <label className="mb-1 block text-xs font-semibold">
                  प्रकार (Category)
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="general">
                    सामान्य (General)
                  </option>

                  <option value="gurukul">
                    गुरुकुल (Gurukul)
                  </option>

                  <option value="students">
                    विद्यार्थी (Students)
                  </option>

                  <option value="kirtan">
                    कीर्तन (Kirtan)
                  </option>

                  <option value="warkari">
                    वारकरी कार्यक्रम (Warkari Programs)
                  </option>

                  <option value="bal-sanskar">
                    बाल संस्कार शिबिर (Bal Sanskar Camp)
                  </option>

                  <option value="religious">
                    धार्मिक कार्यक्रम (Religious)
                  </option>

                  <option value="cultural">
                    सांस्कृतिक कार्यक्रम (Cultural)
                  </option>

                  <option value="social">
                    सामाजिक उपक्रम (Social)
                  </option>

                  <option value="special">
                    विशेष कार्यक्रम (Special)
                  </option>
                </select>
              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                >
                  रद्द करा
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting
                    ? "अपलोड होत आहे..."
                    : "जोडा (Upload)"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}