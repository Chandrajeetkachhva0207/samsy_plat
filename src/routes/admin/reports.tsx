import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api, API_ORIGIN } from "@/lib/api";
import {
  Plus,
  Trash2,
  FileText,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      {
        title: "अहवाल व्यवस्थापन — प्रशासकीय पॅनेल",
      },
    ],
  }),
  component: AdminReports,
});


interface ReportText {
  mr: string;
  en: string;
}


interface ReportItem {
  _id: string;

  title:
    | ReportText
    | string;

  year:
    | ReportText
    | string;

  description?:
    | ReportText
    | string;

  pdf?: string;

  isActive?: boolean;
}


function AdminReports() {

  const [reports, setReports] =
    useState<ReportItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);


  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    yearMr: "",
    yearEn: "",

    titleMr: "",
    titleEn: "",

    descriptionMr: "",
    descriptionEn: "",
  });


  const [file, setFile] =
    useState<File | null>(null);


  // =====================================================
  // LOAD REPORTS
  // =====================================================

  const loadReports = async () => {

    setLoading(true);

    try {

      const res =
        await api.getReports();

      if (
        res.success &&
        Array.isArray(res.data)
      ) {
        setReports(res.data);
      }

    } catch (err) {

      console.error(
        "Failed to load annual reports",
        err
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadReports();
  }, []);


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    id: string
  ) => {

    if (
      !confirm(
        "हा अहवाल हटवायचा आहे का?"
      )
    ) {
      return;
    }


    try {

      await api.deleteReport(id);

      setReports((prev) =>
        prev.filter(
          (r) => r._id !== id
        )
      );

      alert(
        "अहवाल यशस्वीरित्या हटवला."
      );

    } catch (err: any) {

      alert(
        err.message ||
          "अहवाल हटवताना त्रुटी आली."
      );

    }
  };


  // =====================================================
  // ADD REPORT
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    if (!file) {

      alert(
        "कृपया PDF फाइल निवडा."
      );

      return;
    }


    if (
      !form.yearMr.trim() ||
      !form.yearEn.trim()
    ) {

      alert(
        "कृपया Marathi आणि English दोन्ही वर्ष भरा."
      );

      return;
    }


    if (
      !form.titleMr.trim() ||
      !form.titleEn.trim()
    ) {

      alert(
        "कृपया Marathi आणि English दोन्ही Report Title भरा."
      );

      return;
    }


    setSubmitting(true);


    try {

      const formData =
        new FormData();


      // YEAR

      formData.append(
        "yearMr",
        form.yearMr
      );

      formData.append(
        "yearEn",
        form.yearEn
      );


      // TITLE

      formData.append(
        "titleMr",
        form.titleMr
      );

      formData.append(
        "titleEn",
        form.titleEn
      );


      // DESCRIPTION

      formData.append(
        "descriptionMr",
        form.descriptionMr
      );

      formData.append(
        "descriptionEn",
        form.descriptionEn
      );


      // PDF

      formData.append(
        "pdf",
        file
      );


      // ACTIVE

      formData.append(
        "isActive",
        "true"
      );


      await api.createReport(
        formData
      );


      alert(
        "अहवाल यशस्वीरित्या जोडला."
      );


      // RESET MODAL

      setShowModal(false);

      setForm({
        yearMr: "",
        yearEn: "",

        titleMr: "",
        titleEn: "",

        descriptionMr: "",
        descriptionEn: "",
      });

      setFile(null);


      await loadReports();


    } catch (err: any) {

      alert(
        err.message ||
          "अहवाल जोडताना त्रुटी आली."
      );

    } finally {

      setSubmitting(false);

    }
  };


  // =====================================================
  // PDF URL
  // =====================================================

  const getPDFUrl = (
    pdf?: string
  ) => {

    if (!pdf) {
      return "#";
    }


    if (
      pdf.startsWith("http://") ||
      pdf.startsWith("https://")
    ) {
      return pdf;
    }


    if (
      pdf.startsWith("/uploads/")
    ) {
      return `${API_ORIGIN}${pdf}`;
    }


    return `${API_ORIGIN}/${pdf}`;
  };


  // =====================================================
  // GET TEXT
  // =====================================================

  const getText = (
    value:
      | ReportText
      | string
      | undefined,
    lang: "mr" | "en"
  ) => {

    if (!value) {
      return "";
    }


    if (
      typeof value === "string"
    ) {
      return value;
    }


    return value[lang] || "";
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <AdminLayout
      title="वार्षिक कार्य अहवाल व्यवस्थापन (Annual Reports)"
    >

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between gap-4">

        <p className="text-sm text-muted-foreground">
          गुरुकुलाचे वार्षिक कार्य अहवाल व PDF
          दस्तऐवज जोडा किंवा हटवा.
        </p>


        <button
          onClick={() =>
            setShowModal(true)
          }
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
        >

          <Plus className="h-4 w-4" />

          <span>
            नवीन अहवाल जोडा
          </span>

        </button>

      </div>


      {/* REPORT LIST */}

      {loading ? (

        <div className="py-12 text-center text-sm text-muted-foreground">
          अहवाल लोड होत आहेत...
        </div>

      ) : reports.length === 0 ? (

        <Card className="p-8 text-center text-sm text-muted-foreground">

          सध्या कोणतेही अहवाल जोडलेले नाहीत.

          <br />

          अहवाल जोडण्यासाठी वरील बटणावर क्लिक करा.

        </Card>

      ) : (

        <div className="grid gap-4 sm:grid-cols-2">

          {reports.map((r) => {

            const fileLink =
              getPDFUrl(r.pdf);


            return (

              <Card
                key={r._id}
                className="flex items-start justify-between gap-4 p-5"
              >

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">

                    <FileText className="h-5 w-5" />

                  </div>


                  <div>

                    <span className="text-xs font-semibold text-primary">

                      {getText(
                        r.year,
                        "mr"
                      )}

                    </span>


                    <p className="text-xs text-muted-foreground">

                      {getText(
                        r.year,
                        "en"
                      )}

                    </p>


                    <h3 className="mt-1 text-base font-semibold leading-tight text-maroon">

                      {getText(
                        r.title,
                        "mr"
                      )}

                    </h3>


                    <p className="mt-0.5 text-xs text-muted-foreground">

                      {getText(
                        r.title,
                        "en"
                      )}

                    </p>


                    {fileLink !== "#" && (

                      <a
                        href={fileLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground underline hover:text-maroon"
                      >

                        <Download className="h-3 w-3" />

                        <span>
                          दस्तऐवज उघडा
                        </span>

                      </a>

                    )}

                  </div>

                </div>


                <button
                  onClick={() =>
                    handleDelete(r._id)
                  }
                  className="p-1 text-muted-foreground hover:text-red-600"
                  title="हटवा"
                >

                  <Trash2 className="h-4 w-4" />

                </button>

              </Card>

            );

          })}

        </div>

      )}


      {/* =================================================
          ADD REPORT MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">

            <h2 className="mb-5 text-lg font-bold text-maroon">

              नवीन कार्य अहवाल (Add Report)

            </h2>


            <form
              onSubmit={handleSubmit}
              className="grid gap-4 text-sm"
            >


              {/* =================================================
                  YEAR MARATHI
              ================================================= */}

              <div>

                <label className="mb-1 block text-xs font-semibold">

                  वर्ष (मराठी)

                </label>


                <input
                  type="text"
                  required
                  value={form.yearMr}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      yearMr:
                        e.target.value,
                    })
                  }
                  placeholder="उदा. २०२४ - २०२५"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />

              </div>


              {/* =================================================
                  YEAR ENGLISH
              ================================================= */}

              <div>

                <label className="mb-1 block text-xs font-semibold">

                  Year (English)

                </label>


                <input
                  type="text"
                  required
                  value={form.yearEn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      yearEn:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. 2024 - 2025"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />

              </div>


              {/* =================================================
                  MARATHI TITLE
              ================================================= */}

              <div>

                <label className="mb-1 block text-xs font-semibold">

                  अहवालाचे नाव (मराठी)

                </label>


                <input
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
                  placeholder="उदा. वार्षिक कार्य अहवाल २०२४-२५"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />

              </div>


              {/* =================================================
                  ENGLISH TITLE
              ================================================= */}

              <div>

                <label className="mb-1 block text-xs font-semibold">

                  Report Title (English)

                </label>


                <input
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
                  placeholder="e.g. Annual Activity Report 2024-25"
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />

              </div>


              {/* =================================================
                  PDF
              ================================================= */}

              <div>

                <label className="mb-1 block text-xs font-semibold">

                  PDF फाइल निवडा (Select PDF Document)

                </label>


                <input
                  type="file"
                  required
                  accept="application/pdf"
                  onChange={(e) =>
                    setFile(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  className="w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
                />


                {file && (

                  <p className="mt-2 text-xs text-muted-foreground">

                    Selected: {file.name}

                  </p>

                )}

              </div>


              {/* =================================================
                  MARATHI DESCRIPTION
              ================================================= */}

              <div>

                <label className="mb-1 block text-xs font-semibold">

                  वर्णन (मराठी)

                </label>


                <textarea
                  rows={3}
                  value={
                    form.descriptionMr
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descriptionMr:
                        e.target.value,
                    })
                  }
                  placeholder="अहवालामध्ये वर्षभरातील उपक्रम, शैक्षणिक कार्य आणि आध्यात्मिक कार्यक्रमांची माहिती दिली आहे."
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />

              </div>


              {/* =================================================
                  ENGLISH DESCRIPTION
              ================================================= */}

              <div>

                <label className="mb-1 block text-xs font-semibold">

                  Description (English)

                </label>


                <textarea
                  rows={3}
                  value={
                    form.descriptionEn
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descriptionEn:
                        e.target.value,
                    })
                  }
                  placeholder="This report contains information about activities, educational work and spiritual programmes conducted during the year."
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {

                    setShowModal(false);

                    setFile(null);

                    setForm({
                      yearMr: "",
                      yearEn: "",

                      titleMr: "",
                      titleEn: "",

                      descriptionMr: "",
                      descriptionEn: "",
                    });

                  }}
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
                    ? "जतन होत आहे..."
                    : "जतन करा (Save Report)"}

                </button>

              </div>

            </form>

          </Card>

        </div>

      )}

    </AdminLayout>
  );
}