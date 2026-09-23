import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";
import { Plus, Trash2, Image as ImageIcon, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [{ title: "फोटो गॅलरी व्यवस्थापन — प्रशासकीय पॅनेल" }],
  }),
  component: AdminGallery,
});

interface GalleryItem {
  _id: string;
  imageUrl?: string;
  url?: string;
  caption?: { mr?: string; en?: string } | string;
  category?: string;
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

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await api.getGallery();
      if (res.success && Array.isArray(res.data)) {
        setPhotos(res.data);
      }
    } catch (err) {
      console.error("Failed to load gallery", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("हा फोटो हटवायचा आहे का?")) return;
    try {
      await api.deleteGalleryItem(id);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.message || "हटवताना त्रुटी आली.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("captionMr", form.captionMr);
        formData.append("captionEn", form.captionEn || form.captionMr);
        formData.append("category", form.category);
        await api.createGalleryItem(formData);
      } else {
        const payload = {
          imageUrl: form.imageUrl,
          caption: { mr: form.captionMr, en: form.captionEn || form.captionMr },
          category: form.category,
        };
        await api.createGalleryItem(payload);
      }

      setShowModal(false);
      setForm({ captionMr: "", captionEn: "", category: "general", imageUrl: "" });
      setFile(null);
      loadGallery();
    } catch (err: any) {
      alert(err.message || "फोटो अपलोड करताना त्रुटी आली.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="फोटो गॅलरी व्यवस्थापन (Manage Gallery)">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          गुरुकुलाच्या फोटो गॅलरीमध्ये नवीन फोटो अपलोड करा किंवा हटवा.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>नवीन फोटो जोडा</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">फोटो लोड होत आहेत...</div>
      ) : photos.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          सध्या कोणतेही फोटो उपलब्ध नाहीत. फोटो जोडण्यासाठी वरील बटणावर क्लिक करा.
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => {
            const imgSrc = p.imageUrl || p.url || "/images/hero-gurukul.jpg";
            const captionStr =
              typeof p.caption === "string" ? p.caption : p.caption?.mr || "गॅलरी फोटो";

            return (
              <Card key={p._id} className="overflow-hidden group relative">
                <img
                  src={imgSrc.startsWith("http") || imgSrc.startsWith("/") ? imgSrc : `http://localhost:5000${imgSrc}`}
                  alt={captionStr}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-3 bg-card border-t border-border">
                  <p className="text-xs font-medium text-foreground truncate">{captionStr}</p>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>हटवा (Delete)</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-maroon mb-4">नवीन फोटो जोडणे (Add Photo)</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">फोटो निवडा (Select Image File)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <div className="text-center text-xs text-muted-foreground font-semibold">किंवा (OR)</div>

              <div>
                <label className="block text-xs font-semibold mb-1">इमेज URL (Image URL path)</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/images/hero-gurukul.jpg"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">शीर्षक / कॅप्शन (Caption - Marathi)</label>
                <input
                  type="text"
                  required
                  value={form.captionMr}
                  onChange={(e) => setForm({ ...form, captionMr: e.target.value })}
                  placeholder="उदा. गुरुकुलातील विद्यार्थी अभ्यास करताना"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">प्रकार (Category)</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background"
                >
                  <option value="general">सामान्य (General)</option>
                  <option value="students">विद्यार्थी (Students)</option>
                  <option value="events">कार्यक्रम (Events)</option>
                  <option value="facilities">सुविधा (Facilities)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "अपलोड होत आहे..." : "जोडा (Upload)"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
