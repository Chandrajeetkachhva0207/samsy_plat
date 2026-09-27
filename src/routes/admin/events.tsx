import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";
import {
  Plus,
  Trash2,
  Pencil,
  Calendar,
  MapPin,
  Tag,
} from "lucide-react";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [{ title: "कार्यक्रम व्यवस्थापन — प्रशासकीय पॅनेल" }],
  }),
  component: AdminEvents,
});

interface EventItem {
  _id: string;
  title: {
    mr: string;
    en: string;
  };
  description: {
    mr: string;
    en: string;
  };
  date: string;
  venue: {
    mr: string;
    en: string;
  };
  category?: string;
}

interface EventForm {
  titleMr: string;
  titleEn: string;
  descMr: string;
  descEn: string;
  date: string;
  venueMr: string;
  venueEn: string;
  category: string;
}

const emptyForm: EventForm = {
  titleMr: "",
  titleEn: "",
  descMr: "",
  descEn: "",
  date: "",
  venueMr: "",
  venueEn: "",
  category: "general",
};

function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // null = Add mode
  // event object = Edit mode
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [form, setForm] = useState<EventForm>(emptyForm);

  // --------------------------------------------------
  // LOAD EVENTS
  // --------------------------------------------------

  const loadEvents = async () => {
    setLoading(true);

    try {
      const res = await api.getEvents();

      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
      alert("कार्यक्रम लोड करताना त्रुटी आली.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // --------------------------------------------------
  // OPEN ADD MODAL
  // --------------------------------------------------

  const openAddModal = () => {
    setEditingEvent(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  // --------------------------------------------------
  // OPEN EDIT MODAL
  // --------------------------------------------------

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);

    setForm({
      titleMr: event.title?.mr || "",
      titleEn: event.title?.en || "",
      descMr: event.description?.mr || "",
      descEn: event.description?.en || "",
      date: event.date ? event.date.substring(0, 10) : "",
      venueMr: event.venue?.mr || "",
      venueEn: event.venue?.en || "",
      category: event.category || "general",
    });

    setShowModal(true);
  };

  // --------------------------------------------------
  // CLOSE MODAL
  // --------------------------------------------------

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingEvent(null);
    setForm({ ...emptyForm });
  };

  // --------------------------------------------------
  // DELETE EVENT
  // --------------------------------------------------

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "हा कार्यक्रम हटवायचा आहे का?\n\nAre you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await api.deleteEvent(id);

      setEvents((prev) => prev.filter((event) => event._id !== id));

      alert("कार्यक्रम यशस्वीरित्या हटवला.");
    } catch (err: any) {
      console.error("Delete event error:", err);
      alert(err.message || "कार्यक्रम हटवताना त्रुटी आली.");
    }
  };

  // --------------------------------------------------
  // FORM SUBMIT
  // CREATE OR UPDATE
  // --------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.titleMr.trim()) {
      alert("कृपया कार्यक्रमाचे नाव भरा.");
      return;
    }

    if (!form.date) {
      alert("कृपया तारीख निवडा.");
      return;
    }

    if (!form.venueMr.trim()) {
      alert("कृपया स्थळ भरा.");
      return;
    }

    if (!form.descMr.trim()) {
      alert("कृपया कार्यक्रमाचा तपशील भरा.");
      return;
    }

    setSubmitting(true);

    const payload = {
      title: {
        mr: form.titleMr.trim(),
        en: form.titleEn.trim() || form.titleMr.trim(),
      },

      eventName: form.titleMr.trim(),

      description: {
        mr: form.descMr.trim(),
        en: form.descEn.trim() || form.descMr.trim(),
      },

      date: form.date,

      venue: {
        mr: form.venueMr.trim(),
        en: form.venueEn.trim() || form.venueMr.trim(),
      },

      location: form.venueMr.trim(),

      category: form.category,
    };

    try {
      // -----------------------------------------------
      // EDIT EXISTING EVENT
      // -----------------------------------------------

      if (editingEvent) {
        const res = await api.updateEvent(editingEvent._id, payload);

        if (res.success) {
          alert("कार्यक्रम यशस्वीरित्या अपडेट केला.");

          closeModal();
          await loadEvents();
        }
      }

      // -----------------------------------------------
      // CREATE NEW EVENT
      // -----------------------------------------------

      else {
        const res = await api.createEvent(payload);

        if (res.success) {
          alert("कार्यक्रम यशस्वीरित्या जोडला.");

          closeModal();
          await loadEvents();
        }
      }
    } catch (err: any) {
      console.error("Save event error:", err);

      alert(
        err.message ||
          (editingEvent
            ? "कार्यक्रम अपडेट करताना त्रुटी आली."
            : "कार्यक्रम जोडताना त्रुटी आली.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // CATEGORY LABEL
  // --------------------------------------------------

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "cultural":
        return "सांस्कृतिक";

      case "religious":
        return "धार्मिक / अध्यात्मिक";

      default:
        return "सर्वसाधारण";
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AdminLayout title="कार्यक्रम व्यवस्थापन (Manage Events)">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          गुरुकुलाचे आगामी व पार पडलेले कार्यक्रम येथे जोडा, संपादित करा किंवा
          हटवा.
        </p>

        <button
          type="button"
          onClick={openAddModal}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span>नवीन कार्यक्रम जोडा</span>
        </button>
      </div>

      {/* EVENTS LIST */}
      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          कार्यक्रम लोड होत आहेत...
        </div>
      ) : events.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          सध्या कोणतेही कार्यक्रम जोडलेले नाहीत.
          <br />
          नवीन कार्यक्रम जोडण्यासाठी वरील बटणावर क्लिक करा.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <Card
              key={event._id}
              className="flex flex-col justify-between p-5"
            >
              <div>
                {/* TITLE + ACTION BUTTONS */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-maroon">
                      {event.title?.mr || "अशीर्षक"}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.title?.en}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {/* EDIT */}
                    <button
                      type="button"
                      onClick={() => openEditModal(event)}
                      className="rounded-md p-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                      title="संपादित करा"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => handleDelete(event._id)}
                      className="rounded-md p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
                      title="हटवा"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* EVENT INFO */}
                <div className="mt-4 space-y-2 text-xs text-foreground/80">
                  {/* DATE */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" />

                    <span>
                      {event.date
                        ? new Date(event.date).toLocaleDateString("mr-IN", {
                            dateStyle: "long",
                          })
                        : "तारीख उपलब्ध नाही"}
                    </span>
                  </div>

                  {/* CATEGORY */}
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-primary" />

                    <span>{getCategoryLabel(event.category)}</span>
                  </div>

                  {/* VENUE */}
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

                    <span>{event.venue?.mr || "स्थळ उपलब्ध नाही"}</span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {event.description?.mr}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <h2 className="mb-5 text-lg font-bold text-maroon">
              {editingEvent
                ? "कार्यक्रम संपादित करा (Edit Event)"
                : "नवीन कार्यक्रम जोडा (Add Event)"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
              {/* MARATHI TITLE */}
              <div>
                <label className="mb-1 block text-xs font-semibold">
                  कार्यक्रमाचे नाव (मराठी)
                </label>

                <input
                  type="text"
                  required
                  value={form.titleMr}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      titleMr: e.target.value,
                    })
                  }
                  placeholder="उदा. श्री गुरुपौर्णिमा उत्सव"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* ENGLISH TITLE */}
              <div>
                <label className="mb-1 block text-xs font-semibold">
                  Event Title (English)
                </label>

                <input
                  type="text"
                  value={form.titleEn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      titleEn: e.target.value,
                    })
                  }
                  placeholder="e.g. Shri Guru Purnima Utsav"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* DATE + CATEGORY */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    तारीख (Date)
                  </label>

                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    प्रकार (Category)
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="general">
                      सर्वसाधारण (General)
                    </option>

                    <option value="cultural">
                      सांस्कृतिक (Cultural)
                    </option>

                    <option value="religious">
                      धार्मिक / अध्यात्मिक (Religious)
                    </option>
                  </select>
                </div>
              </div>

              {/* VENUE MARATHI */}
              <div>
                <label className="mb-1 block text-xs font-semibold">
                  स्थळ (Venue - Marathi)
                </label>

                <input
                  type="text"
                  required
                  value={form.venueMr}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      venueMr: e.target.value,
                    })
                  }
                  placeholder="उदा. मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* VENUE ENGLISH */}
              <div>
                <label className="mb-1 block text-xs font-semibold">
                  Venue (English)
                </label>

                <input
                  type="text"
                  value={form.venueEn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      venueEn: e.target.value,
                    })
                  }
                  placeholder="e.g. Maa Narmada Adhyatmik Gurukul, Alandi Devachi"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* DESCRIPTION MARATHI */}
              <div>
                <label className="mb-1 block text-xs font-semibold">
                  तपशील (Description - Marathi)
                </label>

                <textarea
                  rows={4}
                  required
                  value={form.descMr}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descMr: e.target.value,
                    })
                  }
                  placeholder="कार्यक्रमाविषयी माहिती..."
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* DESCRIPTION ENGLISH */}
              <div>
                <label className="mb-1 block text-xs font-semibold">
                  Description (English)
                </label>

                <textarea
                  rows={3}
                  value={form.descEn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descEn: e.target.value,
                    })
                  }
                  placeholder="Event description..."
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50"
                >
                  रद्द करा (Cancel)
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting
                    ? "जतन होत आहे..."
                    : editingEvent
                    ? "बदल जतन करा (Update)"
                    : "जोडा (Save Event)"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}