import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";
import { Plus, Trash2, FileText, Download } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{ title: "अहवाल व्यवस्थापन — प्रशासकीय पॅनेल" }],
  }),
  component: AdminReports,
});

interface ReportItem {
  _id: string;
  year: { mr: string; en: string } | string;
  title: { mr: string; en: string } | string;
  pdfUrl?: string;
  fileUrl?: string;
}

function AdminReports() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    titleMr: "",
    titleEn: "",
    yearMr: "",
    yearEn: "",
    pdfUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.getReports();
      if (res.success && Array.isArray(res.data)) {
        setReports(res.data);
      }
    } catch (err) {
      console.error("Failed to load annual reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("हा अहवाल हटवायचा आहे का?")) return;
    try {
      await api.deleteReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      alert(err.message || "अहवाल हटवताना त्रुटी आली.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (file) {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("titleMr", form.titleMr);
        formData.append("titleEn", form.titleEn || form.titleMr);
        formData.append("yearMr", form.yearMr);
        formData.append("yearEn", form.yearEn || form.yearMr);
        await api.createReport(formData);
      } else {
        const payload = {
          title: { mr: form.titleMr, en: form.titleEn || form.titleMr },
          year: { mr: form.yearMr, en: form.yearEn || form.yearMr },
          pdfUrl: form.pdfUrl,
        };
        await api.createReport(payload);
      }

      setShowModal(false);
      setForm({ titleMr: "", titleEn: "", yearMr: "", yearEn: "", pdfUrl: "" });
      setFile(null);
      loadReports();
    } catch (err: any) {
      alert(err.message || "अहवाल जोडताना त्रुटी आली.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="वार्षिक कार्य अहवाल व्यवस्थापन (Annual Reports)">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          गुरुकुलाचे वार्षिक कार्य अहवाल व PDF दस्तऐवज जोडा किंवा हटवा.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>नवीन अहवाल जोडा</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">अहवाल लोड होत आहेत...</div>
      ) : reports.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          सध्या कोणतेही अहवाल जोडलेले नाहीत. अहवाल जोडण्यासाठी वरील बटणावर क्लिक करा.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((r) => {
            const titleStr = typeof r.title === "string" ? r.title : r.title?.mr || "कार्य अहवाल";
            const yearStr = typeof r.year === "string" ? r.year : r.year?.mr || "";
            const fileLink = r.pdfUrl || r.fileUrl || "#";

            return (
              <Card key={r._id} className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary">{yearStr}</span>
                    <h3 className="font-semibold text-maroon text-base leading-tight mt-0.5">{titleStr}</h3>
                    {fileLink !== "#" && (
                      <a
                        href={fileLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-maroon underline"
                      >
                        <Download className="h-3 w-3" />
                        <span>दस्तऐवज उघडा</span>
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-muted-foreground hover:text-red-600 p-1"
                  title="हटवा"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-maroon mb-4">नवीन कार्य अहवाल (Add Report)</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1">वर्ष (Year / Period)</label>
                <input
                  type="text"
                  required
                  value={form.yearMr}
                  onChange={(e) => setForm({ ...form, yearMr: e.target.value })}
                  placeholder="उदा. २०२४ - २०२५"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">अहवालाचे नाव (Title - Marathi)</label>
                <input
                  type="text"
                  required
                  value={form.titleMr}
                  onChange={(e) => setForm({ ...form, titleMr: e.target.value })}
                  placeholder="उदा. वार्षिक कार्य अहवाल २०२४"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">PDF फाइल निवडा (Select PDF Document)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
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
                  {submitting ? "जतन होत आहे..." : "जोडा (Save Report)"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
