import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  CreditCard,
  Briefcase,
  Award,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import { Card, PageHeader, Section } from "@/components/ui";
import {
  certificates,
  form10AC,
  panCardDetails,
  csrDetails,
  trustRegistrationDetails,
  type CertificateItem,
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

interface LightboxData {
  title: string;
  subtitle?: string | undefined;
  pages: { label: string; url: string }[];
  currentPage: number;
  pdfUrl?: string | undefined;
  pdfFileName?: string | undefined;
}

function Certificates() {
  const { t } = useLang();

  // Accordion preview states
  const [showTrustPreview, setShowTrustPreview] = useState(false);
  const [selectedTrustPage, setSelectedTrustPage] = useState<1 | 2>(1);
  const [trustPreviewMode, setTrustPreviewMode] = useState<"image" | "pdf">("image");

  const [showCsrPreview, setShowCsrPreview] = useState(false);
  const [csrPreviewMode, setCsrPreviewMode] = useState<"image" | "pdf">("image");

  const [showPanPreview, setShowPanPreview] = useState(false);
  const [panPreviewMode, setPanPreviewMode] = useState<"image" | "pdf">("image");

  const [showForm10ACPreview, setShowForm10ACPreview] = useState(false);
  const [selectedForm10ACPage, setSelectedForm10ACPage] = useState<1 | 2>(1);
  const [form10ACPreviewMode, setForm10ACPreviewMode] = useState<"image" | "pdf">("image");

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fullscreen Lightbox Modal state
  const [lightbox, setLightbox] = useState<LightboxData | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Lightbox handlers
  const openLightbox = (data: LightboxData) => {
    setLightbox(data);
    setLightboxZoom(1);
  };

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setLightboxZoom(1);
  }, []);

  const handleLightboxNext = useCallback(() => {
    if (!lightbox || lightbox.pages.length <= 1) return;
    setLightbox((prev) =>
      prev
        ? {
            ...prev,
            currentPage: (prev.currentPage + 1) % prev.pages.length,
          }
        : null
    );
    setLightboxZoom(1);
  }, [lightbox]);

  const handleLightboxPrev = useCallback(() => {
    if (!lightbox || lightbox.pages.length <= 1) return;
    setLightbox((prev) =>
      prev
        ? {
            ...prev,
            currentPage:
              (prev.currentPage - 1 + prev.pages.length) % prev.pages.length,
          }
        : null
    );
    setLightboxZoom(1);
  }, [lightbox]);

  // Lock body scroll and keyboard listener for Lightbox
  useEffect(() => {
    if (!lightbox) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        handleLightboxNext();
      } else if (e.key === "ArrowLeft") {
        handleLightboxPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox, closeLightbox, handleLightboxNext, handleLightboxPrev]);

  // Specific lightbox openers
  const openTrustLightbox = (initialPage: 1 | 2 = 1) => {
    openLightbox({
      title: t(trustRegistrationDetails.title),
      subtitle: `${trustRegistrationDetails.trustNumber} | ${trustRegistrationDetails.societyNumber}`,
      pages: [
        {
          label: t({ mr: "पान १ (विश्वस्त नोंदणी क्र. १५९८४)", en: "Page 1 (Trust Reg F-15984)" }),
          url: trustRegistrationDetails.page1Image,
        },
        {
          label: t({ mr: "पान २ (संस्था नोंदणी क्र. महा-६७/२०१४)", en: "Page 2 (Society Reg Maha-67/2014)" }),
          url: trustRegistrationDetails.page2Image,
        },
      ],
      currentPage: initialPage - 1,
      pdfUrl: trustRegistrationDetails.pdfUrl,
      pdfFileName: trustRegistrationDetails.pdfFileName,
    });
  };

  const openCsrLightbox = () => {
    openLightbox({
      title: t(csrDetails.title),
      subtitle: `${csrDetails.registrationNumber} | SRN: ${csrDetails.srn}`,
      pages: [
        {
          label: t({ mr: "CSR नोंदणी पत्र (ROC Delhi)", en: "CSR Approval Letter (ROC Delhi)" }),
          url: csrDetails.imageUrl,
        },
      ],
      currentPage: 0,
      pdfUrl: csrDetails.pdfUrl,
      pdfFileName: csrDetails.pdfFileName,
    });
  };

  const openPanLightbox = () => {
    openLightbox({
      title: t(panCardDetails.title),
      subtitle: `PAN: ${panCardDetails.panNumber}`,
      pages: [
        {
          label: t({ mr: "आयकर पॅन कार्ड (PAN Card)", en: "Income Tax PAN Card" }),
          url: panCardDetails.imageUrl,
        },
      ],
      currentPage: 0,
      pdfUrl: panCardDetails.pdfUrl,
      pdfFileName: panCardDetails.pdfFileName,
    });
  };

  const openForm10ACLightbox = (initialPage: 1 | 2 = 1) => {
    openLightbox({
      title: t(form10AC.title),
      subtitle: `URN: ${form10AC.urn} | ${form10AC.approvalDate}`,
      pages: [
        {
          label: t({ mr: "पान १ (80G तात्पुरती मंजुरी आदेश)", en: "Page 1 (80G Approval Order)" }),
          url: form10AC.page1Image,
        },
        {
          label: t({ mr: "पान २ (अटी व शर्ती)", en: "Page 2 (Conditions & Sanction)" }),
          url: form10AC.page2Image,
        },
      ],
      currentPage: initialPage - 1,
      pdfUrl: form10AC.pdfUrl,
      pdfFileName: form10AC.pdfFileName,
    });
  };

  const openCertificateItemLightbox = (item: CertificateItem) => {
    if (!item.image) return;
    openLightbox({
      title: t(item.name),
      subtitle: item.number,
      pages: [
        {
          label: t(item.name),
          url: item.image,
        },
      ],
      currentPage: 0,
      pdfUrl: item.pdf,
      pdfFileName: item.pdfName,
    });
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

  const quickNavItems = [
    { id: "trust-cert", label: { mr: "१. विश्वस्त नोंदणी (15 984)", en: "1. Trust Reg (15 984)" } },
    { id: "csr-cert", label: { mr: "२. CSR नोंदणी (CSR-1)", en: "2. CSR Reg (CSR-1)" } },
    { id: "pan-cert", label: { mr: "३. पॅन कार्ड (PAN)", en: "3. PAN Card" } },
    { id: "form10ac-cert", label: { mr: "४. 80G मंजुरी (Form 10AC)", en: "4. 80G Form 10AC" } },
    { id: "all-certs", label: { mr: "५. सर्व प्रमाणपत्रे सूची", en: "5. All Certificates" } },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
        {/* Mobile Quick Navigation Chips */}
        <div className="mb-6 -mt-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mr-1 shrink-0">
              <Smartphone className="h-3.5 w-3.5 text-primary" />
              {t({ mr: "त्वरित विभाग:", en: "Jump to:" })}
            </span>
            {quickNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:border-primary/50 hover:bg-sand/60 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {t(item.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile View Notice Banner */}
        <div className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 sm:p-4 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold">
              {t({ mr: "मोबाईल व्ह्यू अनुकूलता:", en: "Mobile Optimized View:" })}
            </strong>{" "}
            {t({
              mr: "सर्व प्रमाणपत्रे मोबाईलवर स्पष्ट वाचता येण्यासाठी हाय-डेफिनिशन (HD) फॉरमॅटमध्ये उपलब्ध आहेत. कोणत्याही प्रमाणपत्राच्या फोटोवर टॅप करून तुम्ही ते पूर्ण पडद्यावर (Fullscreen) झूम करू शकता.",
              en: "All certificates are available in high-definition (HD) format for crisp viewing on mobile screens. Tap on any certificate image to inspect and zoom in full screen.",
            })}
          </div>
        </div>

        {/* =========================================================
            FEATURED CARD 1: TRUST REGISTRATION CERTIFICATE (15 984)
           ========================================================= */}
        <div
          id="trust-cert"
          className="relative mb-10 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-4 sm:p-6 md:p-8 shadow-md transition-all scroll-mt-24"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Award className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {t({ mr: "पडताळणीकृत नोंदणी", en: "Verified Registration" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-maroon">
                    {t({ mr: "धर्मादाय आयुक्त कार्यालय", en: "Charity Commissioner" })}
                  </span>
                </div>
                <h2 className="mt-1 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-maroon leading-tight break-words">
                  {t(trustRegistrationDetails.title)} — {trustRegistrationDetails.trustNumber}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(trustRegistrationDetails.subTitle)}</p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
              <span className="rounded-lg border border-border bg-sand px-2.5 py-1 font-mono font-medium">
                Trust No: <strong className="text-foreground">{trustRegistrationDetails.trustNumber}</strong>
              </span>
              <span className="rounded-lg border border-border bg-sand px-2.5 py-1 font-mono font-medium">
                Society No: <strong className="text-foreground">{trustRegistrationDetails.societyNumber}</strong>
              </span>
            </div>
          </div>

          {/* Body: Picture + Key Details */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* Visual Certificate Picture Display */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-sand/30 p-2.5 shadow-sm transition-all hover:shadow-md">
                {/* Page Switcher Tabs */}
                <div className="mb-2.5 flex items-center justify-between gap-1.5 border-b border-border/60 pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTrustPage(1)}
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center justify-center text-center ${
                      selectedTrustPage === 1
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {t({ mr: "पान १ (विश्वस्त नोंदणी)", en: "Page 1 (Trust Reg)" })}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTrustPage(2)}
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center justify-center text-center ${
                      selectedTrustPage === 2
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {t({ mr: "पान २ (संस्था नोंदणी)", en: "Page 2 (Society Reg)" })}
                  </button>
                </div>

                {/* Picture Container with Tap-to-Zoom */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openTrustLightbox(selectedTrustPage)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openTrustLightbox(selectedTrustPage);
                  }}
                  className="relative group overflow-hidden rounded-xl border border-border bg-white cursor-pointer select-none"
                  title={t({ mr: "मोठ्या आकारात पाहण्यासाठी टॅप करा", en: "Tap to view in full screen" })}
                >
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

                  {/* Tap-to-Zoom Overlay Badge */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm shadow-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-3.5 w-3.5 text-amber-300" />
                      <span>{t({ mr: "झूम करण्यासाठी टॅप करा", en: "Tap to Zoom" })}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                    {selectedTrustPage === 1 ? "पान १ (F-15984)" : "पान २ (Maha-67/2014)"}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium truncate">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {selectedTrustPage === 1
                        ? t({ mr: "नोंदणीचे प्रमाणपत्र (अधिनियम १९५०)", en: "Trust Certificate (Act 1950)" })
                        : t({ mr: "नोंदणी प्रमाणपत्र (अधिनियम १८६०)", en: "Society Certificate (Act 1860)" })}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => openTrustLightbox(selectedTrustPage)}
                    className="text-primary font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    {t({ mr: "झूम करा", en: "Zoom" })}
                  </button>
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
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95 transition-all cursor-pointer min-h-[28px]"
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
              <div className="rounded-xl border border-border/70 bg-sand/40 p-3.5 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
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
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 border-t border-border/80 pt-5">
            {/* View PDF */}
            <a
              href={trustRegistrationDetails.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>{t({ mr: "अधिकृत नोंदणी PDF उघडा", en: "Open Official Trust PDF" })}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80 shrink-0" />
            </a>

            {/* Download PDF */}
            <a
              href={trustRegistrationDetails.pdfUrl}
              download={trustRegistrationDetails.pdfFileName}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-card px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-accent transition-all active:scale-[0.98] min-h-[44px]"
            >
              <Download className="h-4 w-4 text-primary shrink-0" />
              <span>{t({ mr: "नोंदणी PDF डाउनलोड करा", en: "Download Trust PDF" })}</span>
            </a>

            {/* Toggle Preview */}
            <button
              type="button"
              onClick={() => setShowTrustPreview(!showTrustPreview)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer min-h-[44px]"
            >
              <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>
                {showTrustPreview
                  ? t({ mr: "पूर्वावलोकन बंद करा", en: "Close Preview" })
                  : t({ mr: "प्रमाणपत्र २ पाने पूर्वावलोकन पहा", en: "Preview 2-Page Certificate" })}
              </span>
              {showTrustPreview ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </button>
          </div>

          {/* Mobile-Friendly Document Preview Accordion */}
          {showTrustPreview && (
            <div className="mt-6 rounded-2xl border border-border bg-sand/30 p-3 sm:p-5">
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Award className="h-4 w-4 text-primary shrink-0" />
                  {t({
                    mr: "धर्मादाय आयुक्त कार्यालय — २ पानांचे अधिकृत नोंदणी प्रमाणपत्र दस्तऐवज",
                    en: "Office of Charity Commissioner — 2-Page Official Registration Certificate",
                  })}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {/* View mode toggle on tablet/desktop */}
                  <div className="hidden sm:inline-flex rounded-lg border border-border bg-card p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setTrustPreviewMode("image")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        trustPreviewMode === "image"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t({ mr: "HD दस्तऐवज", en: "HD Image" })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrustPreviewMode("pdf")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        trustPreviewMode === "pdf"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t({ mr: "PDF व्ह्यू", en: "PDF View" })}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => openTrustLightbox(selectedTrustPage)}
                    className="flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    {t({ mr: "पूर्ण पडद्यावर झूम करा", en: "Fullscreen Zoom" })}
                  </button>
                </div>
              </div>

              {/* Document Image View (Reliable on all mobile devices) */}
              {trustPreviewMode === "image" ? (
                <div className="space-y-3">
                  {/* Page switcher tabs in preview */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTrustPage(1)}
                      className={`rounded-full px-4 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                        selectedTrustPage === 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {t({ mr: "पान १ (F-15984)", en: "Page 1 (F-15984)" })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTrustPage(2)}
                      className={`rounded-full px-4 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                        selectedTrustPage === 2
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {t({ mr: "पान २ (Maha-67/2014)", en: "Page 2 (Maha-67/2014)" })}
                    </button>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openTrustLightbox(selectedTrustPage)}
                    className="overflow-hidden rounded-xl border border-border bg-white shadow-inner cursor-pointer"
                  >
                    <img
                      src={
                        selectedTrustPage === 1
                          ? trustRegistrationDetails.page1Image
                          : trustRegistrationDetails.page2Image
                      }
                      alt="Trust Certificate Preview"
                      className="mx-auto max-h-[70vh] w-auto object-contain"
                    />
                  </div>

                  <div className="text-center text-xs text-muted-foreground">
                    {t({
                      mr: "💡 अधिक स्पष्ट वाचण्यासाठी प्रमाणपत्रावर टॅप करा किंवा 'पूर्ण पडद्यावर झूम करा' दाबा.",
                      en: "💡 Tap image or click 'Fullscreen Zoom' to inspect text in ultra high-definition.",
                    })}
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                  <iframe
                    src={`${trustRegistrationDetails.pdfUrl}#toolbar=1&navpanes=0`}
                    title="Trust Registration Certificate PDF Preview"
                    className="h-[600px] w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================
            FEATURED CARD 2: CSR REGISTRATION (CSR_Registration)
           ========================================================= */}
        <div
          id="csr-cert"
          className="relative mb-10 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-4 sm:p-6 md:p-8 shadow-md transition-all scroll-mt-24"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Briefcase className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {t({ mr: "कॉर्पोरेट व्यवहार मंत्रालय मान्यता", en: "Ministry of Corporate Affairs Approved" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-maroon">
                    {t({ mr: "CSR उपक्रमांसाठी अधिकृत", en: "Approved for CSR Activities" })}
                  </span>
                </div>
                <h2 className="mt-1 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-maroon leading-tight break-words">
                  {t(csrDetails.title)} — {csrDetails.registrationNumber}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(csrDetails.subTitle)}</p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
              <span className="rounded-lg border border-border bg-sand px-2.5 py-1 font-mono font-medium">
                CSR Reg No: <strong className="text-foreground">{csrDetails.registrationNumber}</strong>
              </span>
              <span className="rounded-lg border border-border bg-sand px-2.5 py-1 font-mono font-medium">
                SRN: <strong className="text-foreground">{csrDetails.srn}</strong>
              </span>
            </div>
          </div>

          {/* Body: Picture + Key Details */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* Visual Certificate Picture Display for CSR */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-sand/30 p-2.5 shadow-sm transition-all hover:shadow-md">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openCsrLightbox}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openCsrLightbox();
                  }}
                  className="relative group overflow-hidden rounded-xl border border-border bg-white cursor-pointer select-none"
                  title={t({ mr: "मोठ्या आकारात पाहण्यासाठी टॅप करा", en: "Tap to view in full screen" })}
                >
                  <img
                    src={csrDetails.imageUrl}
                    alt="Official CSR Registration Certificate"
                    className="aspect-[613/872] w-full rounded-lg object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />

                  {/* Tap-to-Zoom Overlay Badge */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm shadow-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-3.5 w-3.5 text-amber-300" />
                      <span>{t({ mr: "झूम करण्यासाठी टॅप करा", en: "Tap to Zoom" })}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                    CSR-1 (MCA)
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium truncate">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {t({ mr: "कंपनी निबंधक (ROC Delhi) अधिकृत पत्र", en: "ROC Delhi Official Letter" })}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={openCsrLightbox}
                    className="text-primary font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    {t({ mr: "झूम करा", en: "Zoom" })}
                  </button>
                </div>
              </div>
            </div>

            {/* Structured Details */}
            <div className="space-y-3 lg:col-span-7">
              {/* Institution Notice Box */}
              <div className="rounded-xl border border-border/80 bg-sand/40 p-3.5 sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t({ mr: "नोंदणीकृत संस्थेचे नाव", en: "Registered Entity Name" })}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-foreground break-words">{csrDetails.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t({ mr: "मंजुरी दिनांक व प्राधिकारी", en: "Approval Date & Authority" })}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        दि. {csrDetails.approvalDate} — {t(csrDetails.authority)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid gap-2.5 sm:grid-cols-2">
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
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95 transition-all cursor-pointer min-h-[28px]"
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
            </div>
          </div>

          {/* Call to Actions for CSR PDF */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 border-t border-border/80 pt-5">
            {/* View CSR PDF */}
            <a
              href={csrDetails.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>{t({ mr: "अधिकृत CSR PDF उघडा", en: "Open Official CSR PDF" })}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80 shrink-0" />
            </a>

            {/* Download CSR PDF */}
            <a
              href={csrDetails.pdfUrl}
              download={csrDetails.pdfFileName}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-card px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-accent transition-all active:scale-[0.98] min-h-[44px]"
            >
              <Download className="h-4 w-4 text-primary shrink-0" />
              <span>{t({ mr: "CSR PDF डाउनलोड करा", en: "Download CSR PDF" })}</span>
            </a>

            {/* Toggle CSR Preview */}
            <button
              type="button"
              onClick={() => setShowCsrPreview(!showCsrPreview)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer min-h-[44px]"
            >
              <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>
                {showCsrPreview
                  ? t({ mr: "पूर्वावलोकन बंद करा", en: "Close Preview" })
                  : t({ mr: "CSR दस्तऐवज पूर्वावलोकन पहा", en: "Preview CSR Document" })}
              </span>
              {showCsrPreview ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </button>
          </div>

          {/* Interactive CSR Document Preview */}
          {showCsrPreview && (
            <div className="mt-6 rounded-2xl border border-border bg-sand/30 p-3 sm:p-5">
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Briefcase className="h-4 w-4 text-primary shrink-0" />
                  {t({
                    mr: "कंपनी निबंधक (ROC Delhi) — अधिकृत स्वाक्षरीकृत CSR नोंदणी पत्र",
                    en: "Registrar of Companies (ROC Delhi) — Official Signed CSR Approval Letter",
                  })}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:inline-flex rounded-lg border border-border bg-card p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setCsrPreviewMode("image")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        csrPreviewMode === "image"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t({ mr: "HD दस्तऐवज", en: "HD Image" })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCsrPreviewMode("pdf")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        csrPreviewMode === "pdf"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t({ mr: "PDF व्ह्यू", en: "PDF View" })}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={openCsrLightbox}
                    className="flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    {t({ mr: "पूर्ण पडद्यावर झूम करा", en: "Fullscreen Zoom" })}
                  </button>
                </div>
              </div>

              {csrPreviewMode === "image" ? (
                <div className="space-y-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={openCsrLightbox}
                    className="overflow-hidden rounded-xl border border-border bg-white shadow-inner cursor-pointer"
                  >
                    <img
                      src={csrDetails.imageUrl}
                      alt="CSR Registration Certificate Preview"
                      className="mx-auto max-h-[70vh] w-auto object-contain"
                    />
                  </div>

                  <div className="text-center text-xs text-muted-foreground">
                    {t({
                      mr: "💡 अधिक स्पष्ट वाचण्यासाठी प्रमाणपत्रावर टॅप करा किंवा 'पूर्ण पडद्यावर झूम करा' दाबा.",
                      en: "💡 Tap image or click 'Fullscreen Zoom' to inspect text in ultra high-definition.",
                    })}
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                  <iframe
                    src={`${csrDetails.pdfUrl}#toolbar=1&navpanes=0`}
                    title="CSR Registration PDF Preview"
                    className="h-[600px] w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================
            FEATURED CARD 3: PAN CARD (स्थायी लेखा संख्या कार्ड)
           ========================================================= */}
        <div
          id="pan-cert"
          className="relative mb-10 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-4 sm:p-6 md:p-8 shadow-md transition-all scroll-mt-24"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <CreditCard className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {t({ mr: "अधिकृत पॅन कार्ड", en: "Official PAN Card" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-maroon">
                    {t({ mr: "कायमस्वरूपी वैधता", en: "Permanent Validity" })}
                  </span>
                </div>
                <h2 className="mt-1 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-maroon leading-tight break-words">
                  {t(panCardDetails.title)} — {panCardDetails.panNumber}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(panCardDetails.authority)}</p>
              </div>
            </div>

            {/* Quick PAN Badge */}
            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="rounded-lg border border-border bg-sand px-2.5 py-1 font-mono font-medium">
                PAN: <strong className="text-foreground">{panCardDetails.panNumber}</strong>
              </span>
            </div>
          </div>

          {/* Body: Card Image + Key Information */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Visual PAN Card Preview */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-sand/30 p-2.5 shadow-sm transition-all hover:shadow-md">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openPanLightbox}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openPanLightbox();
                  }}
                  className="relative group overflow-hidden rounded-xl border border-border bg-white cursor-pointer select-none"
                  title={t({ mr: "मोठ्या आकारात पाहण्यासाठी टॅप करा", en: "Tap to view in full screen" })}
                >
                  <img
                    src={panCardDetails.imageUrl}
                    alt="Official PAN Card - Maa Narmada Adhyatmik Sanstha"
                    className="aspect-[595/375] w-full rounded-xl object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />

                  {/* Tap-to-Zoom Overlay Badge */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm shadow-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-3.5 w-3.5 text-amber-300" />
                      <span>{t({ mr: "झूम करण्यासाठी टॅप करा", en: "Tap to Zoom" })}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {t({ mr: "डिजिटल कार्ड प्रत", en: "Digital Card Copy" })}
                  </span>
                  <button
                    type="button"
                    onClick={openPanLightbox}
                    className="text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    {t({ mr: "झूम करा", en: "Zoom" })}
                  </button>
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
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95 transition-all cursor-pointer min-h-[28px]"
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
              <div className="rounded-xl border border-border/70 bg-sand/40 p-3.5 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">
                  {t({ mr: "नोंदणीकृत पत्ता:", en: "Registered Address:" })}
                </span>{" "}
                AT-Ajispur Po - Nandra Koli, Buldana H.O, Buldana, Maharashtra - 443001
              </div>
            </div>
          </div>

          {/* Call to Actions for PAN PDF */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 border-t border-border/80 pt-5">
            {/* View PAN PDF */}
            <a
              href={panCardDetails.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>{t({ mr: "PAN अधिकृत PDF उघडा", en: "Open Official PAN PDF" })}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80 shrink-0" />
            </a>

            {/* Download PAN PDF */}
            <a
              href={panCardDetails.pdfUrl}
              download={panCardDetails.pdfFileName}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-card px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-accent transition-all active:scale-[0.98] min-h-[44px]"
            >
              <Download className="h-4 w-4 text-primary shrink-0" />
              <span>{t({ mr: "PAN PDF डाउनलोड करा", en: "Download PAN PDF" })}</span>
            </a>

            {/* Toggle PAN Preview */}
            <button
              type="button"
              onClick={() => setShowPanPreview(!showPanPreview)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer min-h-[44px]"
            >
              <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>
                {showPanPreview
                  ? t({ mr: "पूर्वावलोकन बंद करा", en: "Close Preview" })
                  : t({ mr: "PDF पूर्वावलोकन पहा", en: "Preview PAN PDF" })}
              </span>
              {showPanPreview ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </button>
          </div>

          {/* Interactive PAN PDF Preview */}
          {showPanPreview && (
            <div className="mt-6 rounded-2xl border border-border bg-sand/30 p-3 sm:p-5">
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <CreditCard className="h-4 w-4 text-primary shrink-0" />
                  {t({
                    mr: "पॅन कार्ड अधिकृत PDF दस्तऐवज",
                    en: "Official PAN Card PDF Document",
                  })}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:inline-flex rounded-lg border border-border bg-card p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setPanPreviewMode("image")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        panPreviewMode === "image"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t({ mr: "HD दस्तऐवज", en: "HD Image" })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPanPreviewMode("pdf")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        panPreviewMode === "pdf"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t({ mr: "PDF व्ह्यू", en: "PDF View" })}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={openPanLightbox}
                    className="flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    {t({ mr: "पूर्ण पडद्यावर झूम करा", en: "Fullscreen Zoom" })}
                  </button>
                </div>
              </div>

              {panPreviewMode === "image" ? (
                <div className="space-y-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={openPanLightbox}
                    className="overflow-hidden rounded-xl border border-border bg-white shadow-inner cursor-pointer"
                  >
                    <img
                      src={panCardDetails.imageUrl}
                      alt="PAN Card Preview"
                      className="mx-auto max-h-[60vh] w-auto object-contain"
                    />
                  </div>

                  <div className="text-center text-xs text-muted-foreground">
                    {t({
                      mr: "💡 अधिक स्पष्ट वाचण्यासाठी प्रमाणपत्रावर टॅप करा किंवा 'पूर्ण पडद्यावर झूम करा' दाबा.",
                      en: "💡 Tap image or click 'Fullscreen Zoom' to inspect text in ultra high-definition.",
                    })}
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                  <iframe
                    src={`${panCardDetails.pdfUrl}#toolbar=1&navpanes=0`}
                    title="PAN Card PDF Preview"
                    className="h-[480px] w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================
            FEATURED CARD 4: FORM NO. 10AC (80G APPROVAL ORDER)
           ========================================================= */}
        <div
          id="form10ac-cert"
          className="relative mb-12 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-4 sm:p-6 md:p-8 shadow-md transition-all scroll-mt-24"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {t({ mr: "अधिकृत आयकर आदेश", en: "Official IT Order" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-maroon">
                    {t({ mr: "कलम 80G तात्पुरती मंजुरी", en: "Section 80G Approval" })}
                  </span>
                </div>
                <h2 className="mt-1 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-maroon leading-tight break-words">
                  {t(form10AC.title)}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(form10AC.subRule)}</p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
              <span className="rounded-lg border border-border bg-sand px-2.5 py-1 font-mono font-medium">
                PAN: <strong className="text-foreground">{form10AC.pan}</strong>
              </span>
              <span className="rounded-lg border border-border bg-sand px-2.5 py-1 font-mono font-medium">
                URN: <strong className="text-foreground">{form10AC.urn}</strong>
              </span>
            </div>
          </div>

          {/* Body: Picture + Key Details */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* Visual Certificate Picture Display for Form 10AC */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-sand/30 p-2.5 shadow-sm transition-all hover:shadow-md">
                {/* Page Switcher Tabs */}
                <div className="mb-2.5 flex items-center justify-between gap-1.5 border-b border-border/60 pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedForm10ACPage(1)}
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center justify-center text-center ${
                      selectedForm10ACPage === 1
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {t({ mr: "पान १ (मंजुरी आदेश)", en: "Page 1 (Approval Order)" })}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedForm10ACPage(2)}
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer min-h-[36px] flex items-center justify-center text-center ${
                      selectedForm10ACPage === 2
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {t({ mr: "पान २ (अटी व शर्ती)", en: "Page 2 (Conditions)" })}
                  </button>
                </div>

                {/* Picture Container with Tap-to-Zoom */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openForm10ACLightbox(selectedForm10ACPage)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openForm10ACLightbox(selectedForm10ACPage);
                  }}
                  className="relative group overflow-hidden rounded-xl border border-border bg-white cursor-pointer select-none"
                  title={t({ mr: "मोठ्या आकारात पाहण्यासाठी टॅप करा", en: "Tap to view in full screen" })}
                >
                  <img
                    src={
                      selectedForm10ACPage === 1
                        ? form10AC.page1Image
                        : form10AC.page2Image
                    }
                    alt="Official Form 10AC Section 80G Approval Certificate"
                    className="aspect-[613/872] w-full rounded-lg object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />

                  {/* Tap-to-Zoom Overlay Badge */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm shadow-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-3.5 w-3.5 text-amber-300" />
                      <span>{t({ mr: "झूम करण्यासाठी टॅप करा", en: "Tap to Zoom" })}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                    {selectedForm10ACPage === 1 ? "पान १ (Form 10AC)" : "पान २ (Conditions)"}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium truncate">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {t({ mr: "आयकर विभाग कलम 80G मंजुरी", en: "Income Tax 80G Approval" })}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => openForm10ACLightbox(selectedForm10ACPage)}
                    className="text-primary font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    {t({ mr: "झूम करा", en: "Zoom" })}
                  </button>
                </div>
              </div>
            </div>

            {/* Structured Details */}
            <div className="space-y-3 lg:col-span-7">
              {/* Entity Summary */}
              <div className="rounded-xl border border-border/80 bg-sand/40 p-3.5 sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t({ mr: "संस्थेचे अधिकृत नाव", en: "Registered Institution Name" })}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-foreground break-words">{form10AC.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t({ mr: "मंजुरी कालावधी व दिनांक", en: "Approval Period & Date" })}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">
                        {t(form10AC.assessmentYears)} (दि. {form10AC.approvalDate})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                {formDetails.map((item) => (
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
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95 transition-all cursor-pointer min-h-[28px]"
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
            </div>
          </div>

          {/* Call to Actions for Form 10AC PDF */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 border-t border-border/80 pt-5">
            {/* View PDF */}
            <a
              href={form10AC.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>{t({ mr: "अधिकृत फॉर्म १०AC PDF उघडा", en: "Open Official Form 10AC PDF" })}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80 shrink-0" />
            </a>

            {/* Download PDF */}
            <a
              href={form10AC.pdfUrl}
              download={form10AC.pdfFileName}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-card px-5 py-2.5 text-sm font-semibold text-maroon hover:bg-accent transition-all active:scale-[0.98] min-h-[44px]"
            >
              <Download className="h-4 w-4 text-primary shrink-0" />
              <span>{t({ mr: "फॉर्म १०AC डाउनलोड करा", en: "Download Form 10AC PDF" })}</span>
            </a>

            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setShowForm10ACPreview(!showForm10ACPreview)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer min-h-[44px]"
            >
              <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>
                {showForm10ACPreview
                  ? t({ mr: "पूर्वावलोकन बंद करा", en: "Close Preview" })
                  : t({ mr: "दस्तऐवज पूर्वावलोकन पहा", en: "Preview Document" })}
              </span>
              {showForm10ACPreview ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </button>
          </div>

          {/* Interactive Form 10AC Document Preview */}
          {showForm10ACPreview && (
            <div className="mt-6 rounded-2xl border border-border bg-sand/30 p-3 sm:p-5">
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  {t({
                    mr: "फॉर्म क्र. १०AC — २ पानांचे अधिकृत स्वाक्षरीकृत दस्तऐवज",
                    en: "Form No. 10AC — 2-Page Official Digitally Signed Document",
                  })}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:inline-flex rounded-lg border border-border bg-card p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setForm10ACPreviewMode("image")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        form10ACPreviewMode === "image"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t({ mr: "HD दस्तऐवज", en: "HD Image" })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm10ACPreviewMode("pdf")}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        form10ACPreviewMode === "pdf"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t({ mr: "PDF व्ह्यू", en: "PDF View" })}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => openForm10ACLightbox(selectedForm10ACPage)}
                    className="flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    {t({ mr: "पूर्ण पडद्यावर झूम करा", en: "Fullscreen Zoom" })}
                  </button>
                </div>
              </div>

              {form10ACPreviewMode === "image" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedForm10ACPage(1)}
                      className={`rounded-full px-4 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                        selectedForm10ACPage === 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {t({ mr: "पान १ (मंजुरी आदेश)", en: "Page 1 (Approval Order)" })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedForm10ACPage(2)}
                      className={`rounded-full px-4 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                        selectedForm10ACPage === 2
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {t({ mr: "पान २ (अटी व शर्ती)", en: "Page 2 (Conditions)" })}
                    </button>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openForm10ACLightbox(selectedForm10ACPage)}
                    className="overflow-hidden rounded-xl border border-border bg-white shadow-inner cursor-pointer"
                  >
                    <img
                      src={
                        selectedForm10ACPage === 1
                          ? form10AC.page1Image
                          : form10AC.page2Image
                      }
                      alt="Form 10AC Certificate Preview"
                      className="mx-auto max-h-[70vh] w-auto object-contain"
                    />
                  </div>

                  <div className="text-center text-xs text-muted-foreground">
                    {t({
                      mr: "💡 अधिक स्पष्ट वाचण्यासाठी प्रमाणपत्रावर टॅप करा किंवा 'पूर्ण पडद्यावर झूम करा' दाबा.",
                      en: "💡 Tap image or click 'Fullscreen Zoom' to inspect text in ultra high-definition.",
                    })}
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-white shadow-inner">
                  <iframe
                    src={`${form10AC.pdfUrl}#toolbar=1&navpanes=0`}
                    title="Form No. 10AC PDF Preview"
                    className="h-[600px] w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================
            ALL CERTIFICATES SUMMARY GRID
           ========================================================= */}
        <div id="all-certs" className="mb-8 scroll-mt-24">
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
                className="flex flex-col justify-between border border-border/80 transition-shadow hover:shadow-md p-4 sm:p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-maroon leading-tight">{t(c.name)}</h4>
                    {c.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="h-3 w-3" />
                        {t({ mr: "पडताळणीकृत", en: "Verified" })}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 shrink-0">
                        <Clock className="h-3 w-3" />
                        {t({ mr: "प्रक्रियेत", en: "In Process" })}
                      </span>
                    )}
                  </div>

                  {c.subTitle && (
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t(c.subTitle)}</p>
                  )}

                  {/* Certificate picture thumbnail */}
                  {c.image && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openCertificateItemLightbox(c)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") openCertificateItemLightbox(c);
                      }}
                      className="mt-3 group relative overflow-hidden rounded-xl border border-border/70 bg-sand/20 cursor-pointer select-none"
                      title={t({ mr: "मोठ्या आकारात पाहण्यासाठी टॅप करा", en: "Tap to view in full screen" })}
                    >
                      <img
                        src={c.image}
                        alt={t(c.name)}
                        className="h-40 w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-2.5">
                        <span className="text-[11px] text-white font-semibold flex items-center gap-1.5 drop-shadow-sm">
                          <Eye className="h-3.5 w-3.5 text-amber-300" />
                          {t({ mr: "प्रमाणपत्र प्रत पहा (झूम)", en: "View Certificate (Zoom)" })}
                        </span>
                      </div>
                    </div>
                  )}

                  <dl className="mt-4 space-y-2 text-xs sm:text-sm">
                    {c.number && (
                      <div className="flex justify-between gap-2 border-b border-border/40 pb-1.5">
                        <dt className="text-muted-foreground">
                          {c.numberLabel ? t(c.numberLabel) : t({ mr: "क्रमांक", en: "Number" })}
                        </dt>
                        <dd className="font-mono font-semibold text-foreground break-all text-right">{c.number}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">
                        {t({ mr: "वैधता / स्थिती", en: "Validity / Status" })}
                      </dt>
                      <dd className="font-medium text-foreground text-right">{c.validity}</dd>
                    </div>
                  </dl>
                </div>

                {/* Card PDF & Picture actions */}
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                  {c.pdf && (
                    <>
                      <a
                        href={c.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-maroon hover:bg-primary/20 transition-colors min-h-[36px]"
                      >
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        {t({ mr: "PDF पहा", en: "View PDF" })}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                      <a
                        href={c.pdf}
                        download={c.pdfName || "Certificate.pdf"}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors min-h-[36px]"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {t({ mr: "डाउनलोड", en: "Download" })}
                      </a>
                    </>
                  )}
                  {c.image && (
                    <button
                      type="button"
                      onClick={() => openCertificateItemLightbox(c)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer min-h-[36px]"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      {t({ mr: "फोटो पहा", en: "View Picture" })}
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Note on Transparency & Documentation */}
        <div className="rounded-xl border border-border/70 bg-sand/40 p-4 text-center text-xs text-muted-foreground sm:p-5 leading-relaxed">
          <p>
            {t({
              mr: "📌 मा नर्मदा आध्यात्मिक संस्थेकडून धर्मादाय आयुक्त, आयकर विभाग, कॉर्पोरेट व्यवहार मंत्रालय (MCA) व इतर सक्षम प्राधिकरणांकडून मिळालेली अधिकृत कागदपत्रेच पारदर्शकतेसाठी येथे प्रसिद्ध करण्यात आली आहेत.",
              en: "📌 Only verified official documents received by Maa Narmada Adhyatmik Sanstha from the Charity Commissioner, Income Tax Department, Ministry of Corporate Affairs (MCA) and competent authorities are published here for transparency.",
            })}
          </p>
        </div>
      </Section>

      {/* =========================================================
          FULLSCREEN INTERACTIVE LIGHTBOX MODAL (MOBILE & DESKTOP)
         ========================================================= */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white backdrop-blur-md animate-in fade-in duration-200"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-3 border-b border-white/15 px-3 py-2.5 sm:px-6 sm:py-3 bg-black/40">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {lightbox.title}
              </h3>
              {lightbox.subtitle && (
                <p className="text-[11px] sm:text-xs text-white/70 truncate">
                  {lightbox.subtitle}
                </p>
              )}
            </div>

            {/* Middle Zoom & Reset controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.25))}
                disabled={lightboxZoom <= 1}
                title="Zoom Out"
                className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(1)}
                title="Reset Zoom"
                className="rounded-lg bg-white/10 px-2 py-1 text-xs font-mono text-white hover:bg-white/20 transition-colors cursor-pointer min-h-[36px] flex items-center justify-center"
              >
                {Math.round(lightboxZoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.25))}
                disabled={lightboxZoom >= 3}
                title="Zoom In"
                className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeLightbox}
                title="Close"
                className="ml-2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 active:scale-95 transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Central Image Viewer */}
          <div
            className="relative flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center touch-pinch-zoom"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            {/* Previous Page Arrow (if multiple pages) */}
            {lightbox.pages.length > 1 && (
              <button
                type="button"
                onClick={handleLightboxPrev}
                className="absolute left-2 sm:left-4 z-10 rounded-full bg-black/60 p-2 sm:p-3 text-white backdrop-blur-sm hover:bg-black/80 active:scale-95 transition-all cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Document Image */}
            <div
              className="max-h-full max-w-full transition-transform duration-150 ease-out flex items-center justify-center"
              style={{
                transform: `scale(${lightboxZoom})`,
                transformOrigin: "center center",
              }}
              onDoubleClick={() => setLightboxZoom((z) => (z > 1 ? 1 : 2))}
            >
              <img
                src={lightbox.pages[lightbox.currentPage]?.url}
                alt={lightbox.pages[lightbox.currentPage]?.label || lightbox.title}
                className="max-h-[82vh] max-w-[95vw] rounded-lg object-contain shadow-2xl bg-white"
              />
            </div>

            {/* Next Page Arrow (if multiple pages) */}
            {lightbox.pages.length > 1 && (
              <button
                type="button"
                onClick={handleLightboxNext}
                className="absolute right-2 sm:right-4 z-10 rounded-full bg-black/60 p-2 sm:p-3 text-white backdrop-blur-sm hover:bg-black/80 active:scale-95 transition-all cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Pages Selector + Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-white/15 px-3 py-2.5 sm:px-6 sm:py-3 bg-black/60">
            {/* Page switcher tabs if multi-page */}
            {lightbox.pages.length > 1 ? (
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                {lightbox.pages.map((p, idx) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => {
                      setLightbox((prev) => (prev ? { ...prev, currentPage: idx } : null));
                      setLightboxZoom(1);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                      lightbox.currentPage === idx
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-white/70">
                {lightbox.pages[0]?.label}
              </div>
            )}

            {/* Download and External Links */}
            <div className="flex items-center gap-2">
              {lightbox.pdfUrl && (
                <a
                  href={lightbox.pdfUrl}
                  download={lightbox.pdfFileName || "Certificate.pdf"}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{t({ mr: "PDF डाउनलोड", en: "Download PDF" })}</span>
                </a>
              )}

              <a
                href={lightbox.pages[lightbox.currentPage]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition-all"
              >
                <span>{t({ mr: "मूळ प्रतिमा उघडा", en: "Open Raw" })}</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
