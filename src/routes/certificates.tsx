import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  Hash,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  CreditCard,
  Briefcase,
  Award,
  Image as ImageIcon,
} from "lucide-react";
import { Card, PageHeader, Section } from "@/components/ui";
import {
  certificates,
  form10AC,
  panCardDetails,
  csrDetails,
  trustRegistrationDetails,
} from "@/content/site";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      {
        title:
          "संस्था नोंदणी (15 984 बुलढाणा), CSR नोंदणी, पॅन कार्ड व 80G | मा नर्मदा आध्यात्मिक गुरुकुल",
      },
      {
        name: "description",
        content:
          "मा नर्मदा आध्यात्मिक संस्थेची अधिकृत विश्वस्त नोंदणी (क्र. १५ ९८४ बुलढाणा), CSR नोंदणी (CSR00101084), स्थायी लेखा संख्या (PAN AAWAM9501F), आयकर विभाग फॉर्म क्र. १०AC (80G) व अधिकृत PDF प्रमाणपत्रे.",
      },
      {
        property: "og:title",
        content: "संस्था नोंदणी, CSR नोंदणी, पॅन कार्ड व प्रमाणपत्रे | अधिकृत PDF",
      },
      {
        property: "og:description",
        content:
          "धर्मादाय आयुक्त संस्था नोंदणी प्रमाणपत्र, CSR नोंदणी, आयकर विभाग PAN कार्ड व कलम 80G तात्पुरती मंजुरी (फॉर्म १०AC) अधिकृत PDF सह पहा व डाउनलोड करा.",
      },
      { property: "og:url", content: "/certificates" },
    ],
    links: [{ rel: "canonical", href: "/certificates" }],
  }),
  component: Certificates,
});

function Certificates() {
  const { t } = useLang();
  const [showTrustPreview, setShowTrustPreview] = useState(false);
  const [selectedTrustPage, setSelectedTrustPage] = useState<1 | 2>(1);
  const [showPanPreview, setShowPanPreview] = useState(false);
  const [showForm10ACPreview, setShowForm10ACPreview] = useState(false);
  const [showCsrPreview, setShowCsrPreview] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const trustDetailsList = [
    {
      label: { mr: "विश्वस्त नोंदणी क्रमांक (Trust Reg No)", en: "Trust Registration Number" },
      value: trustRegistrationDetails.trustNumber,
      copyable: true,
      key: "trust_reg_no",
    },
    {
      label: { mr: "संस्था नोंदणी क्रमांक (Society Reg No)", en: "Society Registration Number" },
      value: trustRegistrationDetails.societyNumber,
      copyable: true,
      key: "society_reg_no",
    },
    {
      label: { mr: "नोंदणी दिनांक (धर्मादाय आयुक्त)", en: "Trust Registration Date" },
      value: trustRegistrationDetails.trustRegDate,
      copyable: false,
      key: "trust_date",
    },
    {
      label: { mr: "संस्था स्थापना दिनांक (निबंधक)", en: "Society Formation Date" },
      value: trustRegistrationDetails.societyRegDate,
      copyable: false,
      key: "society_date",
    },
    {
      label: { mr: "नोंदणीकृत संस्थेचे नाव", en: "Registered Entity" },
      value: trustRegistrationDetails.name,
      copyable: false,
      key: "trust_name",
    },
    {
      label: { mr: "प्रमाणपत्र धारक / अध्यक्ष", en: "Certificate Recipient / President" },
      value: trustRegistrationDetails.president,
      copyable: false,
      key: "trust_president",
    },
    {
      label: { mr: "सक्षम नोंदणी प्राधिकारी", en: "Approving Authority" },
      value: t(trustRegistrationDetails.authority),
      copyable: false,
      key: "trust_authority",
    },
    {
      label: { mr: "नोंदणी स्थिती / वैधता", en: "Registration Status" },
      value: t(trustRegistrationDetails.validity),
      copyable: false,
      key: "trust_validity",
    },
  ];

  const formDetails = [
    {
      label: { mr: "युनिक नोंदणी क्रमांक (URN)", en: "Unique Registration No. (URN)" },
      value: form10AC.urn,
      copyable: true,
      key: "urn",
    },
    {
      label: { mr: "दस्तऐवज ओळख क्रमांक (DIN)", en: "Document Identification No. (DIN)" },
      value: form10AC.din,
      copyable: true,
      key: "din",
    },
    {
      label: { mr: "पॅन क्रमांक (PAN)", en: "PAN Number" },
      value: form10AC.pan,
      copyable: true,
      key: "pan",
    },
    {
      label: { mr: "अर्ज क्रमांक (Application No.)", en: "Application Number" },
      value: form10AC.applicationNumber,
      copyable: true,
      key: "app_no",
    },
    {
      label: { mr: "मंजूर कलम (Approval Section)", en: "Approval Section" },
      value: "80G (Sub-clause (A) of clause (iv) of 1st proviso to sub-section (5) of Sec 80G)",
      copyable: false,
      key: "section",
    },
    {
      label: { mr: "तात्पुरती मंजुरी दिनांक", en: "Date of Provisional Approval" },
      value: form10AC.approvalDate,
      copyable: false,
      key: "date",
    },
    {
      label: { mr: "कर निर्धारण वर्षे (Assessment Years)", en: "Assessment Years (AY)" },
      value: t(form10AC.assessmentYears),
      copyable: false,
      key: "ay",
    },
    {
      label: { mr: "नोंदणीकृत संस्थेचे नाव", en: "Registered Name" },
      value: form10AC.name,
      copyable: false,
      key: "name",
    },
    {
      label: { mr: "उपक्रमांचे स्वरूप", en: "Nature of Activities" },
      value: t(form10AC.activities),
      copyable: false,
      key: "nature",
    },
    {
      label: { mr: "मंजुरी देणारे प्राधिकारी", en: "Approving Authority" },
      value: t(form10AC.authority),
      copyable: false,
      key: "authority",
    },
  ];

  const panDetailsList = [
    {
      label: { mr: "स्थायी लेखा संख्या (PAN)", en: "Permanent Account Number (PAN)" },
      value: panCardDetails.panNumber,
      copyable: true,
      key: "pan_card_no",
    },
    {
      label: { mr: "नोंदणीकृत नाव", en: "Registered Name" },
      value: panCardDetails.name,
      copyable: false,
      key: "pan_name",
    },
    {
      label: { mr: "निगमन / गठन तारीख", en: "Date of Incorporation / Formation" },
      value: panCardDetails.incorporationDate,
      copyable: false,
      key: "pan_date",
    },
    {
      label: { mr: "जारीकर्ता प्राधिकारी", en: "Issuing Authority" },
      value: t(panCardDetails.authority),
      copyable: false,
      key: "pan_authority",
    },
    {
      label: { mr: "वैधता", en: "Validity" },
      value: t(panCardDetails.validity),
      copyable: false,
      key: "pan_validity",
    },
  ];

  const csrDetailsList = [
    {
      label: { mr: "CSR नोंदणी क्रमांक (Registration No.)", en: "CSR Registration Number" },
      value: csrDetails.registrationNumber,
      copyable: true,
      key: "csr_reg_no",
    },
    {
      label: { mr: "सेवा विनंती क्रमांक (SRN)", en: "Service Request Number (SRN)" },
      value: csrDetails.srn,
      copyable: true,
      key: "csr_srn",
    },
    {
      label: { mr: "पॅन क्रमांक (PAN)", en: "PAN Number" },
      value: csrDetails.pan,
      copyable: true,
      key: "csr_pan",
    },
    {
      label: { mr: "मंजुरी दिनांक (Approval Date)", en: "Approval Date" },
      value: csrDetails.approvalDate,
      copyable: false,
      key: "csr_date",
    },
    {
      label: { mr: "अर्ज दिनांक (Application Date)", en: "Application Date" },
      value: csrDetails.applicationDate,
      copyable: false,
      key: "csr_app_date",
    },
    {
      label: { mr: "सक्षम प्राधिकारी (Authority)", en: "Approving Authority" },
      value: t(csrDetails.authority),
      copyable: false,
      key: "csr_authority",
    },
    {
      label: { mr: "नोंदणीकृत संस्था", en: "Registered Entity" },
      value: csrDetails.name,
      copyable: false,
      key: "csr_name",
    },
    {
      label: { mr: "नोंदणी स्थिती", en: "Registration Status" },
      value: t(csrDetails.validity),
      copyable: false,
      key: "csr_validity",
    },
  ];

  return (
    <>
      <PageHeader
        title={{ mr: "संस्था नोंदणी व प्रमाणपत्रे", en: "Registration & Certificates" }}
        sub={{
          mr: "संस्थेची अधिकृत विश्वस्त नोंदणी (15 984 बुलढाणा), CSR नोंदणी (CSR-1), स्थायी लेखा संख्या (PAN Card), आयकर विभाग 80G मान्यता (फॉर्म १०AC) व अधिकृत कागदपत्रांची पडताळणीकृत माहिती.",
          en: "Official verified details of Trust Registration (15 984 Buldhana), CSR Registration (CSR-1), Permanent Account Number (PAN Card), Income Tax 80G Approval (Form 10AC) and certificates.",
        }}
      />

      <Section>
        {/* =========================================================
            FEATURED CARD 1: TRUST REGISTRATION CERTIFICATE (15 984)
           ========================================================= */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-md transition-all sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t({ mr: "पडताळणीकृत नोंदणी", en: "Verified Registration" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-maroon">
                    {t({ mr: "धर्मादाय आयुक्त कार्यालय", en: "Charity Commissioner" })}
                  </span>
                </div>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-maroon sm:text-2xl">
                  {t(trustRegistrationDetails.title)} — {trustRegistrationDetails.trustNumber}
                </h2>
                <p className="text-xs text-muted-foreground">{t(trustRegistrationDetails.subTitle)}</p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-lg border border-border bg-sand px-3 py-1 font-mono font-medium">
                Trust No: <strong className="text-foreground">{trustRegistrationDetails.trustNumber}</strong>
              </span>
              <span className="rounded-lg border border-border bg-sand px-3 py-1 font-mono font-medium">
                Society No: <strong className="text-foreground">{trustRegistrationDetails.societyNumber}</strong>
              </span>
            </div>
          </div>

          {/* Body: Picture + Key Details */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* Visual Certificate Picture Display */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-sand/30 p-2 shadow-sm transition-all hover:shadow-md">
                {/* Page Switcher Tabs */}
                <div className="mb-2 flex items-center justify-between gap-1 border-b border-border/60 pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrustPage(1)}
                    className={`flex-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      selectedTrustPage === 1
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {t({ mr: "पान १ (विश्वस्त नोंदणी)", en: "Page 1 (Trust Reg)" })}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTrustPage(2)}
                    className={`flex-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      selectedTrustPage === 2
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {t({ mr: "पान २ (संस्था नोंदणी)", en: "Page 2 (Society Reg)" })}
                  </button>
                </div>

                {/* Picture Container */}
                <div className="relative group overflow-hidden rounded-xl border border-border bg-white">
                  <img
                    src={
                      selectedTrustPage === 1
                        ? trustRegistrationDetails.page1Image
                        : trustRegistrationDetails.page2Image
                    }
                    alt="Official Trust Registration Certificate"
                    className="aspect-[613/872] w-full rounded-lg object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                    {selectedTrustPage === 1 ? "पान १ (F-15984)" : "पान २ (Maha-67/2014)"}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {selectedTrustPage === 1
                      ? t({ mr: "नोंदणीचे प्रमाणपत्र (अधिनियम १९५०)", en: "Trust Certificate (Act 1950)" })
                      : t({ mr: "नोंदणी प्रमाणपत्र (अधिनियम १८६०)", en: "Society Certificate (Act 1860)" })}
                  </span>
                  <a
                    href={
                      selectedTrustPage === 1
                        ? trustRegistrationDetails.page1Image
                        : trustRegistrationDetails.page2Image
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline flex items-center gap-0.5"
                  >
                    {t({ mr: "फोटो झूम करा", en: "Zoom Picture" })}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Structured Details */}
            <div className="space-y-3 lg:col-span-7">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {trustDetailsList.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs text-muted-foreground">{t(item.label)}</span>
                      {item.copyable && (
                        <button
                          type="button"
                          onClick={() => handleCopy(item.value, item.key)}
                          title={t({ mr: "कॉपी करा", en: "Copy" })}
                          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          {copiedKey === item.key ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">
                                {t({ mr: "कॉपी झाले", en: "Copied" })}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>{t({ mr: "कॉपी", en: "Copy" })}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="mt-1 break-words font-mono text-xs font-semibold text-foreground sm:text-sm">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Legal Act Reference Box */}
              <div className="rounded-xl border border-border/70 bg-sand/40 p-3.5 text-xs text-muted-foreground space-y-1.5">
                <p>
                  <strong className="text-foreground">
                    {t({ mr: "१. विश्वस्त नोंदणी:", en: "1. Public Trust Registration:" })}
                  </strong>{" "}
                  मुंबई सार्वजनिक विश्वस्तव्यवस्था अधिनियम, १९५० (सन १९५० चा मुंबई अधिनियम क्रमांक २९) — नोंदणी क्र.{" "}
                  <strong className="text-foreground">एफ-१५९८४ बुलडाणा</strong> (दिनांक ०५.०५.२०१४).
                </p>
                <p>
                  <strong className="text-foreground">
                    {t({ mr: "२. संस्था नोंदणी:", en: "2. Society Registration:" })}
                  </strong>{" "}
                  संस्था नोंदणी अधिनियम, १८६० (सन १८६० चा अधिनियम २१) — नोंदणी क्र.{" "}
                  <strong className="text-foreground">महा-६७/२०१४ (बुलढाणा विभाग)</strong> (दिनांक ०१.०२.२०१४).
                </p>
              </div>
            </div>
          </div>

          {/* Call to Actions for Trust Certificate */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/80 pt-6">
            {/* View PDF */}
            <a
              href={trustRegistrationDetails.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <FileText className="h-4 w-4" />
              <span>{t({ mr: "अधिकृत नोंदणी PDF उघडा", en: "Open Official Trust PDF" })}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            {/* Download PDF */}
            <a
              href={trustRegistrationDetails.pdfUrl}
              download={trustRegistrationDetails.pdfFileName}
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-card px-6 py-2.5 text-sm font-semibold text-maroon hover:bg-accent transition-all active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-primary" />
              <span>{t({ mr: "नोंदणी PDF डाउनलोड करा", en: "Download Trust PDF" })}</span>
            </a>

            {/* Toggle Preview */}
            <button
              type="button"
              onClick={() => setShowTrustPreview(!showTrustPreview)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>
                {showTrustPreview
                  ? t({ mr: "पूर्वावलोकन बंद करा", en: "Close Preview" })
                  : t({ mr: "प्रमाणपत्र २ पाने पूर्वावलोकन पहा", en: "Preview 2-Page Certificate" })}
              </span>
              {showTrustPreview ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Interactive Document Preview */}
          {showTrustPreview && (
            <div className="mt-6 rounded-2xl border border-border bg-sand/30 p-3 sm:p-5">
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Award className="h-4 w-4 text-primary" />
                  {t({
                    mr: "धर्मादाय आयुक्त कार्यालय — २ पानांचे अधिकृत नोंदणी प्रमाणपत्र दस्तऐवज",
                    en: "Office of Charity Commissioner — 2-Page Official Registration Certificate",
                  })}
                </span>
                <a
                  href={trustRegistrationDetails.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  {t({ mr: "पूर्ण पडद्यावर उघडा", en: "Open Fullscreen" })}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                <iframe
                  src={`${trustRegistrationDetails.pdfUrl}#toolbar=1&navpanes=0`}
                  title="Trust Registration Certificate PDF Preview"
                  className="h-[650px] w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            FEATURED CARD 2: CSR REGISTRATION (CSR_Registration)
           ========================================================= */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-md transition-all sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t({ mr: "कॉर्पोरेट व्यवहार मंत्रालय मान्यता", en: "Ministry of Corporate Affairs Approved" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-maroon">
                    {t({ mr: "CSR उपक्रमांसाठी अधिकृत", en: "Approved for CSR Activities" })}
                  </span>
                </div>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-maroon sm:text-2xl">
                  {t(csrDetails.title)} — {csrDetails.registrationNumber}
                </h2>
                <p className="text-xs text-muted-foreground">{t(csrDetails.subTitle)}</p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-lg border border-border bg-sand px-3 py-1 font-mono font-medium">
                CSR Reg No: <strong className="text-foreground">{csrDetails.registrationNumber}</strong>
              </span>
              <span className="rounded-lg border border-border bg-sand px-3 py-1 font-mono font-medium">
                SRN: <strong className="text-foreground">{csrDetails.srn}</strong>
              </span>
            </div>
          </div>

          {/* Institution Notice Box */}
          <div className="mt-6 rounded-xl border border-border/80 bg-sand/40 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <Building2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t({ mr: "नोंदणीकृत संस्थेचे नाव", en: "Registered Entity Name" })}
                  </p>
                  <p className="text-sm font-bold text-foreground">{csrDetails.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t({ mr: "मंजुरी दिनांक व प्राधिकारी", en: "Approval Date & Authority" })}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    दि. {csrDetails.approvalDate} — {t(csrDetails.authority)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {csrDetailsList.map((item) => (
              <div
                key={item.key}
                className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs text-muted-foreground">{t(item.label)}</span>
                  {item.copyable && (
                    <button
                      type="button"
                      onClick={() => handleCopy(item.value, item.key)}
                      title={t({ mr: "कॉपी करा", en: "Copy" })}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {copiedKey === item.key ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">
                            {t({ mr: "कॉपी झाले", en: "Copied" })}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>{t({ mr: "कॉपी", en: "Copy" })}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="mt-1 break-words font-mono text-xs font-semibold text-foreground sm:text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Actions for CSR PDF */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/80 pt-6">
            {/* View CSR PDF */}
            <a
              href={csrDetails.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <FileText className="h-4 w-4" />
              <span>{t({ mr: "अधिकृत CSR PDF उघडा", en: "Open Official CSR PDF" })}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            {/* Download CSR PDF */}
            <a
              href={csrDetails.pdfUrl}
              download={csrDetails.pdfFileName}
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-card px-6 py-2.5 text-sm font-semibold text-maroon hover:bg-accent transition-all active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-primary" />
              <span>{t({ mr: "CSR PDF डाउनलोड करा", en: "Download CSR PDF" })}</span>
            </a>

            {/* Toggle CSR Preview */}
            <button
              type="button"
              onClick={() => setShowCsrPreview(!showCsrPreview)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>
                {showCsrPreview
                  ? t({ mr: "पूर्वावलोकन बंद करा", en: "Close Preview" })
                  : t({ mr: "CSR दस्तऐवज पूर्वावलोकन पहा", en: "Preview CSR Document" })}
              </span>
              {showCsrPreview ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Interactive CSR Document Preview */}
          {showCsrPreview && (
            <div className="mt-6 rounded-2xl border border-border bg-sand/30 p-3 sm:p-5">
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {t({
                    mr: "कंपनी निबंधक (ROC Delhi) — अधिकृत स्वाक्षरीकृत CSR नोंदणी पत्र",
                    en: "Registrar of Companies (ROC Delhi) — Official Signed CSR Approval Letter",
                  })}
                </span>
                <a
                  href={csrDetails.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  {t({ mr: "पूर्ण पडद्यावर उघडा", en: "Open Fullscreen" })}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                <iframe
                  src={`${csrDetails.pdfUrl}#toolbar=1&navpanes=0`}
                  title="CSR Registration PDF Preview"
                  className="h-[600px] w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            FEATURED CARD 3: PAN CARD (स्थायी लेखा संख्या कार्ड)
           ========================================================= */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-md transition-all sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t({ mr: "अधिकृत पॅन कार्ड", en: "Official PAN Card" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-maroon">
                    {t({ mr: "कायमस्वरूपी वैधता", en: "Permanent Validity" })}
                  </span>
                </div>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-maroon sm:text-2xl">
                  {t(panCardDetails.title)} — {panCardDetails.panNumber}
                </h2>
                <p className="text-xs text-muted-foreground">{t(panCardDetails.authority)}</p>
              </div>
            </div>

            {/* Quick PAN Badge */}
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-lg border border-border bg-sand px-3 py-1 font-mono font-medium">
                PAN: <strong className="text-foreground">{panCardDetails.panNumber}</strong>
              </span>
            </div>
          </div>

          {/* Body: 2 Columns on Desktop (Card Image + Key Information) */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Visual PAN Card Preview */}
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-sand/30 p-2 shadow-sm transition-all hover:shadow-md">
                <img
                  src={panCardDetails.imageUrl}
                  alt="Official PAN Card - Maa Narmada Adhyatmik Sanstha"
                  className="aspect-[595/375] w-full rounded-xl object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                />
                <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {t({ mr: "डिजिटल कार्ड प्रत", en: "Digital Card Copy" })}
                  </span>
                  <span className="font-mono text-foreground font-semibold">
                    {panCardDetails.panNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Structured PAN Details */}
            <div className="space-y-3 lg:col-span-7">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {panDetailsList.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs text-muted-foreground">{t(item.label)}</span>
                      {item.copyable && (
                        <button
                          type="button"
                          onClick={() => handleCopy(item.value, item.key)}
                          title={t({ mr: "कॉपी करा", en: "Copy" })}
                          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          {copiedKey === item.key ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">
                                {t({ mr: "कॉपी झाले", en: "Copied" })}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>{t({ mr: "कॉपी", en: "Copy" })}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="mt-1 break-words font-mono text-xs font-semibold text-foreground sm:text-sm">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Institution Address Notice */}
              <div className="rounded-xl border border-border/70 bg-sand/40 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {t({ mr: "नोंदणीकृत पत्ता:", en: "Registered Address:" })}
                </span>{" "}
                AT-Ajispur Po - Nandra Koli, Buldana H.O, Buldana, Maharashtra - 443001
              </div>
            </div>
          </div>

          {/* Call to Actions for PAN PDF */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/80 pt-6">
            {/* View PAN PDF */}
            <a
              href={panCardDetails.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <FileText className="h-4 w-4" />
              <span>{t({ mr: "PAN अधिकृत PDF उघडा", en: "Open Official PAN PDF" })}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            {/* Download PAN PDF */}
            <a
              href={panCardDetails.pdfUrl}
              download={panCardDetails.pdfFileName}
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-card px-6 py-2.5 text-sm font-semibold text-maroon hover:bg-accent transition-all active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-primary" />
              <span>{t({ mr: "PAN PDF डाउनलोड करा", en: "Download PAN PDF" })}</span>
            </a>

            {/* Toggle PAN Preview */}
            <button
              type="button"
              onClick={() => setShowPanPreview(!showPanPreview)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>
                {showPanPreview
                  ? t({ mr: "पूर्वावलोकन बंद करा", en: "Close Preview" })
                  : t({ mr: "PDF पूर्वावलोकन पहा", en: "Preview PAN PDF" })}
              </span>
              {showPanPreview ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Interactive PAN PDF Preview */}
          {showPanPreview && (
            <div className="mt-6 rounded-2xl border border-border bg-sand/30 p-3 sm:p-5">
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  {t({
                    mr: "पॅन कार्ड अधिकृत PDF दस्तऐवज",
                    en: "Official PAN Card PDF Document",
                  })}
                </span>
                <a
                  href={panCardDetails.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  {t({ mr: "पूर्ण पडद्यावर उघडा", en: "Open Fullscreen" })}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                <iframe
                  src={`${panCardDetails.pdfUrl}#toolbar=1&navpanes=0`}
                  title="PAN Card PDF Preview"
                  className="h-[480px] w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            FEATURED CARD 4: FORM NO. 10AC (80G APPROVAL ORDER)
           ========================================================= */}
        <div className="relative mb-12 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-md transition-all sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t({ mr: "अधिकृत आयकर आदेश", en: "Official IT Order" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-maroon">
                    {t({ mr: "कलम 80G तात्पुरती मंजुरी", en: "Section 80G Approval" })}
                  </span>
                </div>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-maroon sm:text-2xl">
                  {t(form10AC.title)}
                </h2>
                <p className="text-xs text-muted-foreground">{t(form10AC.subRule)}</p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-lg border border-border bg-sand px-3 py-1 font-mono font-medium">
                PAN: <strong className="text-foreground">{form10AC.pan}</strong>
              </span>
              <span className="rounded-lg border border-border bg-sand px-3 py-1 font-mono font-medium">
                URN: <strong className="text-foreground">{form10AC.urn}</strong>
              </span>
            </div>
          </div>

          {/* Entity Summary */}
          <div className="mt-6 rounded-xl border border-border/80 bg-sand/40 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <Building2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t({ mr: "संस्थेचे अधिकृत नाव", en: "Registered Institution Name" })}
                  </p>
                  <p className="text-sm font-bold text-foreground">{form10AC.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t({ mr: "मंजुरी कालावधी व दिनांक", en: "Approval Period & Date" })}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {t(form10AC.assessmentYears)} (दि. {form10AC.approvalDate})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {formDetails.map((item) => (
              <div
                key={item.key}
                className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs text-muted-foreground">{t(item.label)}</span>
                  {item.copyable && (
                    <button
                      type="button"
                      onClick={() => handleCopy(item.value, item.key)}
                      title={t({ mr: "कॉपी करा", en: "Copy" })}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {copiedKey === item.key ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">
                            {t({ mr: "कॉपी झाले", en: "Copied" })}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>{t({ mr: "कॉपी", en: "Copy" })}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="mt-1 break-words font-mono text-xs font-semibold text-foreground sm:text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Actions for Form 10AC PDF */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/80 pt-6">
            {/* View PDF */}
            <a
              href={form10AC.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <FileText className="h-4 w-4" />
              <span>{t({ mr: "अधिकृत फॉर्म १०AC PDF उघडा", en: "Open Official Form 10AC PDF" })}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            {/* Download PDF */}
            <a
              href={form10AC.pdfUrl}
              download={form10AC.pdfFileName}
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-card px-6 py-2.5 text-sm font-semibold text-maroon hover:bg-accent transition-all active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-primary" />
              <span>{t({ mr: "फॉर्म १०AC डाउनलोड करा", en: "Download Form 10AC PDF" })}</span>
            </a>

            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setShowForm10ACPreview(!showForm10ACPreview)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>
                {showForm10ACPreview
                  ? t({ mr: "पूर्वावलोकन बंद करा", en: "Close Preview" })
                  : t({ mr: "दस्तऐवज पूर्वावलोकन पहा", en: "Preview Document" })}
              </span>
              {showForm10ACPreview ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Interactive Form 10AC Document Preview */}
          {showForm10ACPreview && (
            <div className="mt-6 rounded-2xl border border-border bg-sand/30 p-3 sm:p-5">
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  {t({
                    mr: "फॉर्म क्र. १०AC — २ पानांचे अधिकृत स्वाक्षरीकृत दस्तऐवज",
                    en: "Form No. 10AC — 2-Page Official Digitally Signed Document",
                  })}
                </span>
                <a
                  href={form10AC.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  {t({ mr: "पूर्ण पडद्यावर पहा", en: "View Fullscreen" })}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                <iframe
                  src={`${form10AC.pdfUrl}#toolbar=1&navpanes=0`}
                  title="Form No. 10AC PDF Preview"
                  className="h-[650px] w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            ALL CERTIFICATES SUMMARY GRID
           ========================================================= */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-maroon sm:text-xl">
              {t({ mr: "सर्व नोंदणी व प्रमाणपत्रे सूची", en: "All Registration & Certificates" })}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t({
                mr: "संस्थेकडे उपलब्ध असलेल्या अधिकृत नोंदी व प्रमाणपत्रांची सद्यस्थिती.",
                en: "Current status of official records and certificates available with the institution.",
              })}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((c) => (
              <Card
                key={c.name.en}
                className="flex flex-col justify-between border border-border/80 transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-maroon">{t(c.name)}</h4>
                    {c.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {t({ mr: "पडताळणीकृत", en: "Verified" })}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <Clock className="h-3 w-3" />
                        {t({ mr: "प्रक्रियेत", en: "In Process" })}
                      </span>
                    )}
                  </div>

                  {c.subTitle && (
                    <p className="mt-1 text-xs text-muted-foreground">{t(c.subTitle)}</p>
                  )}

                  {/* Certificate picture thumbnail if available */}
                  {c.image && (
                    <div className="mt-3 group relative overflow-hidden rounded-xl border border-border/70 bg-sand/20">
                      <img
                        src={c.image}
                        alt={t(c.name)}
                        className="h-36 w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[11px] text-white font-medium flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {t({ mr: "प्रमाणपत्र प्रत", en: "Certificate Copy" })}
                        </span>
                      </div>
                    </div>
                  )}

                  <dl className="mt-4 space-y-2 text-sm">
                    {c.number && (
                      <div className="flex justify-between gap-2 border-b border-border/40 pb-1.5">
                        <dt className="text-muted-foreground">
                          {c.numberLabel ? t(c.numberLabel) : t({ mr: "क्रमांक", en: "Number" })}
                        </dt>
                        <dd className="font-mono font-semibold text-foreground">{c.number}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">
                        {t({ mr: "वैधता / स्थिती", en: "Validity / Status" })}
                      </dt>
                      <dd className="font-medium text-foreground">{c.validity}</dd>
                    </div>
                  </dl>
                </div>

                {/* Card PDF & Picture actions if available */}
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                  {c.pdf && (
                    <>
                      <a
                        href={c.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-maroon hover:bg-primary/20 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        {t({ mr: "PDF पहा", en: "View PDF" })}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                      <a
                        href={c.pdf}
                        download={c.pdfName || "Certificate.pdf"}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {t({ mr: "डाउनलोड", en: "Download" })}
                      </a>
                    </>
                  )}
                  {c.image && (
                    <a
                      href={c.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      {t({ mr: "फोटो पहा", en: "View Picture" })}
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Note on Transparency & Documentation */}
        <div className="rounded-xl border border-border/70 bg-sand/40 p-4 text-center text-xs text-muted-foreground sm:p-5">
          <p>
            {t({
              mr: "📌 मा नर्मदा आध्यात्मिक संस्थेकडून धर्मादाय आयुक्त, आयकर विभाग, कॉर्पोरेट व्यवहार मंत्रालय (MCA) व इतर सक्षम प्राधिकरणांकडून मिळालेली अधिकृत कागदपत्रेच पारदर्शकतेसाठी येथे प्रसिद्ध करण्यात आली आहेत.",
              en: "📌 Only verified official documents received by Maa Narmada Adhyatmik Sanstha from the Charity Commissioner, Income Tax Department, Ministry of Corporate Affairs (MCA) and competent authorities are published here for transparency.",
            })}
          </p>
        </div>
      </Section>
    </>
  );
}
