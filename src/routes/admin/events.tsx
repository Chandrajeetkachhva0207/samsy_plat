import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";
import { Plus, Trash2, Calendar, MapPin, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [{ title: "कार्यक्रम व्यवस्थापन — प्रशासकीय पॅनेल" }],
  }),
  component: AdminEvents,
});

interface EventItem {
  _id: string;
  title: { mr: string; en: string };
  description: { mr: string; en: string };
  date: string;
  venue: { mr: string; en: string };
  category?: string;
}

function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    titleMr: "",
    titleEn: "",
    descMr: "",
    descEn: "",
    date: "",
    venueMr: "",
    venueEn: "",
    category: "general",
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents();
      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("हा कार्यक्रम हटवायचा आहे का? (Are you sure you want to delete this event?)")) return;
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err: any) {
      alert(err.message || "हटवताना त्रुटी आली.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: { mr: form.titleMr, en: form.titleEn || form.titleMr },
      description: { mr: form.descMr, en: form.descEn || form.descMr },
      date: form.date,
      venue: { mr: form.venueMr, en: form.venueEn || form.venueMr },
      category: form.category,
    };

    try {
      const res = await api.createEvent(payload);
      if (res.success) {
        setShowModal(false);
        setForm({
          titleMr: "",
          titleEn: "",
          descMr: "",
          descEn: "",
          date: "",
          venueMr: "",
          venueEn: "",
          category: "general",
        });
        loadEvents();
      }
    } catch (err: any) {
      alert(err.message || "कार्यक्रम जोडताना त्रुटी आली.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="कार्यक्रम व्यवस्थापन (Manage Events)">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          गुरुकुलाचे आगामी व पार पडलेले कार्यक्रम येथे जोडा किंवा हटवा.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>नवीन कार्यक्रम जोडा</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">लोड होत आहे...</div>
      ) : events.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          सध्या कोणतेही कार्यक्रम जोडलेले नाहीत. नवीन कार्यक्रम जोडण्यासाठी वरील बटणावर क्लिक करा.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((ev) => (
            <Card key={ev._id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-maroon text-base">{ev.title?.mr || "अशीर्षक"}</h3>
                  <button
                    onClick={() => handleDelete(ev._id)}
                    className="text-muted-foreground hover:text-red-600 p-1"
                    title="हटवा"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">{ev.title?.en}</p>

                <div className="mt-3 space-y-1.5 text-xs text-foreground/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>{new Date(ev.date).toLocaleDateString("mr-IN", { dateStyle: "long" })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{ev.venue?.mr}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {ev.description?.mr}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-maroon mb-4">नवीन कार्यक्रम जोडा (Add Event)</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">कार्यक्रमाचे नाव (मराठी)</label>
                <input
                  type="text"
                  required
                  value={form.titleMr}
                  onChange={(e) => setForm({ ...form, titleMr: e.target.value })}
                  placeholder="उदा. श्री गुरुपौर्णिमा उत्सव"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Event Title (English)</label>
                <input
                  type="text"
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                  placeholder="e.g. Shri Guru Purnima Utsav"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">तारीख (Date)</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
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
                    <option value="general">सर्वसाधारण (General)</option>
                    <option value="cultural">सांस्कृतिक (Cultural)</option>
                    <option value="religious">धार्मिक / अध्यात्मिक (Religious)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">स्थळ (Venue - Marathi)</label>
                <input
                  type="text"
                  required
                  value={form.venueMr}
                  onChange={(e) => setForm({ ...form, venueMr: e.target.value })}
                  placeholder="उदा. मा नर्मदा गुरुकुल प्रांगण, आळंदी देवाची"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">तपशील (Description - Marathi)</label>
                <textarea
                  rows={3}
                  required
                  value={form.descMr}
                  onChange={(e) => setForm({ ...form, descMr: e.target.value })}
                  placeholder="कार्यक्रमाविषयी माहिती..."
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "जतन होत आहे..." : "जोडा (Save Event)"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
