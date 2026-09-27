import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  EditableNote,
  PageHeader,
  Section,
} from "@/components/ui";
import { useEffect, useState } from "react";
import { api, API_ORIGIN } from "@/lib/api";
import { useLang } from "@/lib/lang";


export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      {
        title:
          "कार्य अहवाल | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        name: "description",
        content:
          "संस्थेचे वार्षिक कार्य अहवाल — उपक्रम, शैक्षणिक व आध्यात्मिक कार्याची माहिती.",
      },
      {
        property: "og:title",
        content:
          "कार्य अहवाल | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        property: "og:description",
        content:
          "वार्षिक कार्य अहवाल पहा व डाउनलोड करा.",
      },
      {
        property: "og:url",
        content: "/reports",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/reports",
      },
    ],
  }),

  component: Reports,
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


function Reports() {

  const { t, lang } =
    useLang();


  const [reports, setReports] =
    useState<ReportItem[]>([]);


  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // REPORT CONTENT
  // =====================================================

  const contents = [
    {
      mr: "वर्षभरातील उपक्रम",
      en: "Activities during the year",
    },
    {
      mr: "विद्यार्थ्यांविषयी माहिती",
      en: "Information about students",
    },
    {
      mr: "शैक्षणिक कार्य",
      en: "Educational work",
    },
    {
      mr: "आध्यात्मिक कार्यक्रम",
      en: "Spiritual programmes",
    },
    {
      mr: "सामाजिक उपक्रम",
      en: "Social initiatives",
    },
    {
      mr: "छायाचित्रे",
      en: "Photos",
    },
    {
      mr: "पुढील योजना",
      en: "Plans ahead",
    },
  ];


  // =====================================================
  // LOAD REPORTS
  // =====================================================

  useEffect(() => {

    const loadReports = async () => {

      try {

        const res =
          await api.getReports();


        if (
          res.success &&
          Array.isArray(res.data)
        ) {

          const activeReports =
            res.data.filter(
              (report: ReportItem) =>
                report.isActive !== false
            );


          setReports(
            activeReports
          );

        }

      } catch (error) {

        console.error(
          "Failed to load annual reports:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadReports();

  }, []);


  // =====================================================
  // PDF URL
  // =====================================================

  const getPDFUrl = (
    pdf?: string
  ) => {

    if (!pdf) {
      return "";
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
  // GET BILINGUAL TEXT
  // =====================================================

  const getText = (
    value:
      | ReportText
      | string
      | undefined,
    language: "mr" | "en"
  ) => {

    if (!value) {
      return "";
    }


    if (
      typeof value === "string"
    ) {
      return value;
    }


    return value[language] || "";

  };


  return (
    <>

      <PageHeader
        title={{
          mr: "कार्य अहवाल",
          en: "Annual Reports",
        }}
        sub={{
          mr:
            "वार्षिक अहवाल PDF स्वरूपात पाहता व डाउनलोड करता येतील.",
          en:
            "Annual reports can be viewed and downloaded as PDF files.",
        }}
      />


      <Section>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <p className="py-10 text-center text-sm text-muted-foreground">

            {t({
              mr: "अहवाल लोड होत आहेत...",
              en: "Loading reports...",
            })}

          </p>


        ) : reports.length > 0 ? (

          /* =================================================
             REPORT LIST
          ================================================= */

          <div className="grid gap-4 sm:grid-cols-2">

            {reports.map((r) => {

              const fileUrl =
                getPDFUrl(r.pdf);


              return (

                <Card key={r._id}>

                  {/* YEAR */}

                  <p className="text-sm font-semibold text-primary">

                    {getText(
                      r.year,
                      lang
                    )}

                  </p>


                  {/* TITLE */}

                  <h2 className="mt-2 text-base font-semibold text-maroon">

                    {getText(
                      r.title,
                      lang
                    )}

                  </h2>


                  {/* DESCRIPTION */}

                  {r.description ? (

                    <p className="mt-2 text-sm text-muted-foreground">

                      {getText(
                        r.description,
                        lang
                      )}

                    </p>

                  ) : null}


                  {/* PDF BUTTONS */}

                  {fileUrl ? (

                    <div className="mt-4 flex flex-wrap gap-2">

                      {/* VIEW */}

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                      >

                        {t({
                          mr: "PDF पहा",
                          en: "View PDF",
                        })}

                      </a>


                      {/* DOWNLOAD */}

                      <a
                        href={fileUrl}
                        download
                        className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-card px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-accent"
                      >

                        ↓{" "}

                        {t({
                          mr: "डाउनलोड",
                          en: "Download",
                        })}

                      </a>

                    </div>

                  ) : (

                    <p className="mt-3 text-sm text-muted-foreground">

                      {t({
                        mr:
                          "अहवालाची PDF उपलब्ध नाही.",
                        en:
                          "Report PDF is not available.",
                      })}

                    </p>

                  )}

                </Card>

              );

            })}

          </div>


        ) : (

          /* =================================================
             NO REPORTS
          ================================================= */

          <Card className="p-8 text-center">

            <p className="text-sm text-muted-foreground">

              {t({
                mr:
                  "सध्या कोणतेही कार्य अहवाल उपलब्ध नाहीत.",
                en:
                  "No annual reports are currently available.",
              })}

            </p>

          </Card>

        )}


        {/* =================================================
            WHAT REPORTS CONTAIN
        ================================================= */}

        <Card className="mt-8">

          <h2 className="text-base">

            {t({
              mr: "अहवालात काय असते?",
              en: "What reports contain",
            })}

          </h2>


          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">

            {contents.map((c) => (

              <li
                key={c.en}
                className="flex gap-2"
              >

                <span aria-hidden="true">
                  •
                </span>

                {t(c)}

              </li>

            ))}

          </ul>

        </Card>


        <EditableNote />

      </Section>

    </>
  );
}