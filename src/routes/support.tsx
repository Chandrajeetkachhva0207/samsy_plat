import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, PageHeader, Section, SectionTitle } from "@/components/ui";
import { bankDetails, org, supportTypes } from "@/content/site";
import { useLang } from "@/lib/lang";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  Building,
  Receipt,
  Download,
  Printer,
  Share2,
  X,
  Sparkles,
  RefreshCw,
  Edit2,
  CheckCircle2,
  History,
} from "lucide-react";


export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "सहकार्य करा | मा नर्मदा आध्यात्मिक गुरुकुल" },
      {
        name: "description",
        content:
          "गुरुकुलाच्या शैक्षणिक व आध्यात्मिक कार्यास सहकार्य करा — अधिकृत बँक तपशील, PhonePe QR स्कॅनर, अन्नदान व अधिकृत देणगी पावती (Receipt).",
      },
      { property: "og:title", content: "सहकार्य करा | मा नर्मदा आध्यात्मिक गुरुकुल" },
      { property: "og:description", content: "संस्थेच्या अधिकृत खात्यावरच देणगी स्वीकारली जाते." },
      { property: "og:url", content: "/support" },
    ],
    links: [{ rel: "canonical", href: "/support" }],
  }),
  component: Support,
});

const PROFESSIONS = [
  { mr: "नोकरी (Service / Employment)", en: "Service / Employment" },
  { mr: "व्यवसाय / उद्योग (Business / Self-Employed)", en: "Business / Self-Employed" },
  { mr: "शेतकरी / कृषी (Farmer / Agriculture)", en: "Farmer / Agriculture" },
  { mr: "शिक्षक / प्राध्यापक (Teacher / Academic)", en: "Teacher / Academic" },
  { mr: "व्यावसायिक (डॉक्टर / सीए / वकील / इंजिनिअर)", en: "Professional (Doctor / CA / Lawyer / Engineer)" },
  { mr: "गृहिणी (Homemaker)", en: "Homemaker" },
  { mr: "विद्यार्थी (Student)", en: "Student" },
  { mr: "निवृत्त (Retired)", en: "Retired" },
  { mr: "इतर (Other)", en: "Other" },
];

interface ReceiptData {
  receiptNumber: string;
  amount: number;
  donorName: string;
  profession?: string;
  paymentId: string;
  paymentMode: string;
  date: string;
}

function getAmountInWords(amount: number): { mr: string; en: string } {
  const map: Record<number, { mr: string; en: string }> = {
    101: { mr: "एकशे एक रुपये फक्त", en: "One Hundred and One Rupees Only" },
    251: { mr: "दोनशे एकावन्न रुपये फक्त", en: "Two Hundred and Fifty One Rupees Only" },
    501: { mr: "पाचशे एक रुपये फक्त", en: "Five Hundred and One Rupees Only" },
    1100: { mr: "एक हजार एकशे रुपये फक्त", en: "One Thousand One Hundred Rupees Only" },
    2100: { mr: "दोन हजार एकशे रुपये फक्त", en: "Two Thousand One Hundred Rupees Only" },
    5100: { mr: "पाच हजार एकशे रुपये फक्त", en: "Five Thousand One Hundred Rupees Only" },
    11000: { mr: "अकरा हजार रुपये फक्त", en: "Eleven Thousand Rupees Only" },
  };
  return map[amount] || {
    mr: `${amount.toLocaleString("en-IN")} रुपये फक्त`,
    en: `${amount.toLocaleString("en-IN")} Rupees Only`,
  };
}

function Support() {
  const { t } = useLang();
  const { user } = useAuth();

  // Copied state tracker for bank details
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Success Receipt State (resupat)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [isEditingReceiptName, setIsEditingReceiptName] = useState<boolean>(false);
  const [isEditingReceiptAmount, setIsEditingReceiptAmount] = useState<boolean>(false);
  const [isEditingReceiptTxn, setIsEditingReceiptTxn] = useState<boolean>(false);
  const [editAmountVal, setEditAmountVal] = useState<string>("");
  const [editTxnVal, setEditTxnVal] = useState<string>("");

  // PhonePe / Manual Receipt Request Modal State
  const [showQrReceiptModal, setShowQrReceiptModal] = useState<boolean>(false);
  const [receiptPaymentMode, setReceiptPaymentMode] = useState<string>("PhonePe / UPI QR");
  const [qrDonorName, setQrDonorName] = useState<string>("");
  const [qrAmount, setQrAmount] = useState<string>("");
  const [qrTransactionId, setQrTransactionId] = useState<string>("");
  const [qrProfession, setQrProfession] = useState<string>("नोकरी (Service / Employment)");

  // Persistent storage for donor names and past receipts
  const [savedDonorName, setSavedDonorName] = useState<string>("");
  const [savedReceipts, setSavedReceipts] = useState<ReceiptData[]>([]);
  const [showSavedReceiptsModal, setShowSavedReceiptsModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const last = localStorage.getItem("mng_last_donor_name");
        if (last) setSavedDonorName(last);
        const stored = localStorage.getItem("mng_saved_receipts");
        if (stored) {
          setSavedReceipts(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Storage load error:", e);
      }
    }
  }, []);

  // Helper to open receipt modal (leaves amount and transaction ID empty for user input)
  const openReceiptModal = (mode: string) => {
    setReceiptPaymentMode(mode);
    setQrAmount("");
    setQrTransactionId("");
    setShowQrReceiptModal(true);
  };

  // Handle Copy to clipboard
  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(
        t({
          mr: `${text} कॉपी केले!`,
          en: `Copied ${text} to clipboard!`,
        })
      );
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  // Generate Receipt for QR / PhonePe / Bank payment & Save permanently
  const handleGenerateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(qrAmount);
    if (!qrAmount.trim() || isNaN(numAmt) || numAmt < 1) {
      toast.error(
        t({
          mr: "कृपया भरलेली देणगी रक्कम (₹) प्रविष्ट करा!",
          en: "Please enter the Amount Paid (₹)!",
        })
      );
      return;
    }
    if (!qrTransactionId.trim()) {
      toast.error(
        t({
          mr: "कृपया कायमस्वरूपी नोंदीसाठी ट्रान्झॅक्शन आयडी किंवा UTR प्रविष्ट करा!",
          en: "Please enter Transaction ID / UTR for permanent record!",
        })
      );
      return;
    }
    const name = qrDonorName.trim() || user?.name || "भाविक देणगीदार";
    const today = new Date();
    const txn = qrTransactionId.trim();
    const rNumber = `MNG-${today.getFullYear()}-${Date.now().toString().slice(-6)}`;
    const formattedDate = today.toLocaleDateString("mr-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });



    const newReceipt: ReceiptData = {
      receiptNumber: rNumber,
      amount: numAmt,
      donorName: name,
      profession: qrProfession,
      paymentId: txn,
      paymentMode: receiptPaymentMode,
      date: formattedDate,
    };

    setReceiptData(newReceipt);
    setShowQrReceiptModal(false);
    setShowReceiptModal(true);

    // Save permanently in local storage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mng_last_donor_name", name);
        setSavedDonorName(name);
        const existing: ReceiptData[] = JSON.parse(
          localStorage.getItem("mng_saved_receipts") || "[]"
        );
        const updated = [
          newReceipt,
          ...existing.filter((r) => r.receiptNumber !== rNumber),
        ].slice(0, 15);
        localStorage.setItem("mng_saved_receipts", JSON.stringify(updated));
        setSavedReceipts(updated);
      } catch (err) {
        console.warn("Local storage save error:", err);
      }
    }

    // Save permanently in database backend
    try {
      await api.recordDonationReceipt({
        donorName: name,
        amount: numAmt,
        profession: qrProfession,
        paymentMode: receiptPaymentMode,
        paymentId: txn,
        receiptNumber: rNumber,
        notes: `Permanent Receipt generated via ${receiptPaymentMode}`,
      });
    } catch (err) {
      console.warn("Backend receipt save warning:", err);
    }

    toast.success(
      t({
        mr: "कायमस्वरूपी अधिकृत देणगी पावती तयार झाली आहे!",
        en: "Official permanent Donation Receipt generated and recorded successfully!",
      })
    );
  };

  // Share receipt on WhatsApp
  const handleShareReceiptWhatsApp = () => {
    if (!receiptData) return;
    const text = `*मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची*\n*अधिकृत देणगी पावती (Donation Receipt)*\nपावती क्र.: ${receiptData.receiptNumber}\nदेणगीदार: ${receiptData.donorName}\nरक्कम: ₹${receiptData.amount.toLocaleString("en-IN")}\nपद्धती: ${receiptData.paymentMode}\nव्यवहार आयडी: ${receiptData.paymentId}\nदिनांक: ${receiptData.date}\n\nज्ञानोबा-तुकाराम! 🙏`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };


  return (
    <>
      <PageHeader
        title={{ mr: "सहकार्य करा", en: "Support Us" }}
        sub={{
          mr: "आपले सहकार्य विद्यार्थ्यांच्या शिक्षण, संस्कार व वारकरी परंपरा संवर्धनासाठी समर्पित आहे.",
          en: "Your support is dedicated to the education, values, and preservation of sacred traditions.",
        }}
      />

      {/* OFFICIAL BANK DETAILS & PHONEPE QR SCANNER */}
      <Section tone="sand">
        <SectionTitle
          title={{ mr: "अधिकृत बँक तपशील व PhonePe QR", en: "Official Bank Details & PhonePe QR" }}
          sub={{
            mr: "देणगी केवळ संस्थेच्या अधिकृत खात्यावरच स्वीकारली जाते. वैयक्तिक खात्यावर पैसे पाठवू नयेत.",
            en: "Donations are accepted only in the institution's official account. Never send funds to any individual's personal account.",
          }}
        />

        <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-12">
          {/* Bank Accounts Card */}
          <div className="lg:col-span-7">
            <Card className="h-full flex flex-col justify-between rounded-2xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/60 p-6 shadow-md">
              <div>
                <div className="flex items-center gap-2 border-b border-amber-300/70 pb-3">
                  <Building className="h-5 w-5 text-amber-800" />
                  <h3 className="font-display text-lg font-bold text-amber-950">
                    {t({ mr: "संस्थेचे अधिकृत बँक खाते", en: "Trust Official Bank Account" })}
                  </h3>
                </div>

                <dl className="mt-4 divide-y divide-amber-200/70 text-sm">
                  {bankDetails.map((b) => (
                    <div
                      key={b.key}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 py-3"
                    >
                      <dt className="shrink-0 font-medium text-amber-900/80">{t(b.label)}</dt>
                      <dd className="flex items-center justify-between sm:justify-end gap-2">
                        <span className="font-bold text-amber-950 break-words text-left sm:text-right">{b.value}</span>
                        {b.copyable && (
                          <button
                            type="button"
                            onClick={() => handleCopy(b.value, b.key)}
                            title={t({ mr: "कॉपी करा", en: "Copy to clipboard" })}
                            className="shrink-0 inline-flex items-center gap-1 rounded-md border border-amber-300/80 bg-white/90 px-2.5 py-1 text-xs font-semibold text-amber-950 transition-colors hover:bg-amber-600 hover:text-white"
                          >
                            {copiedKey === b.key ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-green-600" />
                                <span>{t({ mr: "कॉपी झाले", en: "Copied" })}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>{t({ mr: "कॉपी", en: "Copy" })}</span>
                              </>
                            )}
                          </button>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 rounded-xl border border-amber-300/90 bg-white/80 p-4 text-xs leading-relaxed text-amber-950/80 shadow-2xs">
                  <p className="font-bold text-amber-950">
                    {t({ mr: "महत्त्वाची सूचना:", en: "Important Notice:" })}
                  </p>
                  <p className="mt-1">
                    {t({
                      mr: "बँक ट्रान्सफर (NEFT / IMPS / RTGS) द्वारे रक्कम पाठवल्यानंतर खालील बटनावर क्लिक करून आपण थेट आपली अधिकृत देणगी पावती तयार करू शकता. (टीप: बँकेच्या विलीनीकरणानुसार NEFT/IMPS साठी ALLA0213158 किंवा नवीन IDIB000B884 दोन्ही स्वीकारले जातात.)",
                      en: "After making a direct bank transfer, click the button below to generate your official donation receipt directly. (Note: Per bank merger, both ALLA0213158 and IDIB000B884 are valid for NEFT/IMPS.)",
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => openReceiptModal("बँक ट्रान्सफर (NEFT / IMPS)")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 px-4 py-3 text-xs font-bold text-white shadow-md transition-all hover:from-amber-700 hover:to-orange-800 sm:text-sm"
                >
                  <Receipt className="h-4 w-4" />
                  <span>{t({ mr: "बँक ट्रान्सफर केले? देणगी पावती मिळवा", en: "Transferred to Bank? Get Receipt" })}</span>
                </button>
              </div>
            </Card>
          </div>

          {/* PhonePe / UPI QR Code Card */}
          <div className="lg:col-span-5">
            <Card className="flex h-full flex-col items-center justify-between rounded-2xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/60 p-6 text-center shadow-md">
              <div className="w-full">
                <div className="flex items-center justify-center gap-2 border-b border-amber-300/70 pb-3">
                  <QrCode className="h-5 w-5 text-amber-800" />
                  <h3 className="font-display text-lg font-bold text-amber-950">
                    {t({ mr: "PhonePe / UPI QR स्कॅनर", en: "PhonePe / UPI QR Scanner" })}
                  </h3>
                </div>

                <p className="mt-3 text-xs text-amber-900/80 font-medium">
                  {t({
                    mr: "PhonePe, Google Pay, Paytm, BHIM द्वारे QR स्कॅन करा व पेमेंट करा",
                    en: "Scan & pay using PhonePe, GPay, Paytm or BHIM",
                  })}
                </p>

                {/* Official PhonePe Scanner Image */}
                <div className="mt-4 flex justify-center">
                  <div className="group relative overflow-hidden rounded-2xl border-4 border-amber-400/90 bg-white p-2.5 shadow-lg max-w-[260px]">
                    <img
                      src="/images/phonepe-qr.jpg"
                      alt="Mr SANTOSH GULABRAO PAWAR - PhonePe QR Code"
                      width={240}
                      height={420}
                      className="h-auto w-full rounded-xl object-contain shadow-xs transition-transform group-hover:scale-102"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <span className="block text-xs font-bold text-amber-950">
                    {t({ mr: "नाव: श्री संतोष गुलाबराव पवार", en: "Account: Mr SANTOSH GULABRAO PAWAR" })}
                  </span>
                  <span className="block text-[11px] text-amber-900/80">
                    {t({ mr: "(संस्थापक अध्यक्ष — मा नर्मदा आध्यात्मिक गुरुकुल)", en: "(Founder President — Maa Narmada Gurukul)" })}
                  </span>
                </div>
              </div>

              <div className="mt-5 w-full space-y-2.5">
                {/* Instant QR Receipt Button */}
                <button
                  type="button"
                  onClick={() => openReceiptModal("PhonePe / UPI QR")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-amber-700 hover:to-orange-800 sm:text-sm"
                >
                  <Receipt className="h-4 w-4" />
                  <span>{t({ mr: "QR पेमेंट केले? पावती मिळवा", en: "Paid via QR? Get Official Receipt" })}</span>
                </button>

                <div className="flex gap-2">
                  <a
                    href="/images/phonepe-qr.jpg"
                    download="PhonePe-QR-Maa-Narmada.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-400/80 bg-white/90 px-3 py-2 text-xs font-bold text-amber-950 transition-colors hover:bg-amber-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{t({ mr: "QR डाऊनलोड", en: "Download QR" })}</span>
                  </a>

                  {savedReceipts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSavedReceiptsModal(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-300/80 bg-white/90 px-3 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-100 transition-colors"
                      title={t({ mr: "मागील पावत्या पहा", en: "View Past Receipts" })}
                    >
                      <History className="h-3.5 w-3.5 text-amber-700" />
                      <span>{t({ mr: `पावत्या (${savedReceipts.length})`, en: `Receipts (${savedReceipts.length})` })}</span>
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </div>

        </div>
      </Section>

      {/* WAYS TO SUPPORT */}
      <Section>
        <SectionTitle
          title={{ mr: "सहकार्याचे इतर प्रकार", en: "Other Ways to Support" }}
          sub={{
            mr: "आर्थिक मदतीव्यतिरिक्त खालील प्रकारेही गुरुकुल सेवेत सहभागी होता येते.",
            en: "Apart from monetary donations, you can contribute through the following services.",
          }}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportTypes.map((s) => (
            <Card key={s.title.en} className="transition-all hover:border-primary/40 hover:shadow-md">
              <div className="text-3xl" aria-hidden="true">
                {s.icon}
              </div>
              <h3 className="mt-3 text-base font-bold text-maroon">{t(s.title)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(s.text)}</p>
            </Card>
          ))}
        </div>
      </Section>



      {/* RECEIPT INPUT MODAL */}
      {showQrReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border-2 border-primary/50 bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 my-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-maroon">
                  {t({ mr: `${receiptPaymentMode} पावती मिळवा`, en: `Get ${receiptPaymentMode} Receipt` })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQrReceiptModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-sand"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateReceipt} className="mt-4 space-y-4">
              {/* DONOR NAME */}
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  {t({ mr: "देणगीदाराचे नाव (नाव पावतीवर येईल)", en: "Donor Name (for Receipt)" })}
                </label>
                <input
                  type="text"
                  required
                  value={qrDonorName}
                  onChange={(e) => setQrDonorName(e.target.value)}
                  placeholder={t({ mr: "उदा. रमेश ज्ञानोबा पाटील", en: "e.g. Ramesh Dnyanoba Patil" })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* AMOUNT PAID (₹) */}
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  {t({
                    mr: "भरलेली देणगी रक्कम (₹)",
                    en: "Amount Paid (₹)",
                  })}
                </label>
                <div className="mt-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={qrAmount}
                    onChange={(e) => setQrAmount(e.target.value)}
                    placeholder=""
                    className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-sm font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
                {Number(qrAmount) > 0 && (
                  <div className="mt-1 text-[11px] italic text-muted-foreground">
                    अक्षरी: {getAmountInWords(Number(qrAmount)).mr}
                  </div>
                )}
              </div>

              {/* PROFESSION */}
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  {t({ mr: "व्यवसाय (Profession)", en: "Profession" })}
                </label>
                <select
                  value={qrProfession}
                  onChange={(e) => setQrProfession(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  {PROFESSIONS.map((p, idx) => (
                    <option key={idx} value={p.mr}>
                      {t(p)}
                    </option>
                  ))}
                </select>
              </div>

              {/* TRANSACTION ID / UTR */}
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  {t({
                    mr: "ट्रान्झॅक्शन आयडी / UTR (कायमस्वरूपी नोंद — आवश्यक)",
                    en: "Transaction ID / UTR (Permanent Record — Required)",
                  })}
                </label>
                <input
                  type="text"
                  required
                  value={qrTransactionId}
                  onChange={(e) => setQrTransactionId(e.target.value)}
                  placeholder={t({
                    mr: "उदा. T2409... किंवा 42819200...",
                    en: "e.g. T2409... or 42819200...",
                  })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0" />
                  <span>
                    {t({
                      mr: "पावती व प्रशासकीय नोंदीसाठी हा ट्रान्झॅक्शन आयडी कायमस्वरूपी नोंदवला जाईल.",
                      en: "This Transaction ID will be permanently recorded in official receipts and records.",
                    })}
                  </span>
                </p>
              </div>


              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t({ mr: "अधिकृत पावती तयार करा", en: "Generate Official Receipt" })}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrReceiptModal(false)}
                  className="rounded-full border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-sand"
                >
                  {t({ mr: "रद्द करा", en: "Cancel" })}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* OFFICIAL DONATION RECEIPT (resupat) MODAL */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 my-4">
            
            {/* PRINTABLE RECEIPT CARD CONTENT */}
            <div id="printable-receipt" className="p-6 sm:p-8 border-4 border-amber-800/60 rounded-xl m-2 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20">
              
              {/* Sacred Invocation Header */}
              <div className="text-center border-b-2 border-amber-900/30 pb-4">
                <div className="text-[11px] font-bold text-amber-900 tracking-wider">
                  ।। श्री गणेशाय नमः ।।  ।। श्री विठ्ठल-रखुमाई प्रसन्न ।।  ।। ज्ञानोबा-तुकाराम ।।
                </div>

                <div className="mt-2 flex items-center justify-center gap-3">
                  <img
                    src="/images/logo.jpg"
                    alt="Logo"
                    className="h-14 w-14 rounded-full border border-amber-700 object-cover"
                  />
                  <div>
                    <h2 className="font-display text-xl font-bold text-amber-950 sm:text-2xl leading-tight">
                      मा नर्मदा आध्यात्मिक शिक्षण संस्था
                    </h2>
                    <p className="text-xs font-semibold text-amber-900">
                      मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600">
                  <span className="font-bold text-amber-900">नोंदणी क्र. – 15 984 (बुलढाणा)</span>
                  <span>•</span>
                  <span>ता. खेड, जि. पुणे, महाराष्ट्र</span>
                </div>

                <div className="mx-auto mt-3 inline-block rounded-full bg-amber-800 px-4 py-1 text-xs font-bold text-white shadow-xs">
                  अधिकृत देणगी पावती (DONATION RECEIPT)
                </div>
              </div>

              {/* Receipt Body Details */}
              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between border-b border-dashed border-amber-300 py-1.5">
                  <span className="font-medium text-slate-600">पावती क्रमांक (Receipt No.):</span>
                  <span className="font-mono font-bold text-amber-950">{receiptData.receiptNumber}</span>
                </div>

                <div className="flex justify-between border-b border-dashed border-amber-300 py-1.5">
                  <span className="font-medium text-slate-600">दिनांक (Date):</span>
                  <span className="font-semibold text-slate-800">{receiptData.date}</span>
                </div>

                {/* Donor Name with Edit Option */}
                <div className="flex items-center justify-between border-b border-dashed border-amber-300 py-1.5">
                  <span className="font-medium text-slate-600">देणगीदाराचे नाव (Donor):</span>
                  {isEditingReceiptName ? (
                    <div className="flex items-center gap-1.5 no-print">
                      <input
                        type="text"
                        value={receiptData.donorName}
                        onChange={(e) => setReceiptData({ ...receiptData, donorName: e.target.value })}
                        className="rounded-lg border border-amber-400 bg-white px-2 py-0.5 text-xs font-bold text-amber-950 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingReceiptName(false)}
                        className="rounded bg-amber-800 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-amber-900"
                      >
                        सेव्ह
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-950">{receiptData.donorName}</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingReceiptName(true)}
                        className="no-print text-[11px] text-amber-800 underline hover:text-amber-950 font-medium"
                        title="पावतीवरील नाव बदला"
                      >
                        (नाव बदला)
                      </button>
                    </div>
                  )}
                </div>

                {receiptData.profession && (
                  <div className="flex justify-between border-b border-dashed border-amber-300 py-1.5">
                    <span className="font-medium text-slate-600">व्यवसाय (Profession):</span>
                    <span className="font-semibold text-slate-800">{receiptData.profession}</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-dashed border-amber-300 py-1.5">
                  <span className="font-medium text-slate-600">पेमेंट पद्धती (Mode):</span>
                  <span className="font-semibold text-slate-800">{receiptData.paymentMode}</span>
                </div>

                {/* Transaction ID with Edit & Copy Option */}
                <div className="flex items-center justify-between border-b border-dashed border-amber-300 py-1.5">
                  <span className="font-medium text-slate-600">व्यवहार आयडी (Txn / Payment ID):</span>
                  {isEditingReceiptTxn ? (
                    <div className="flex items-center gap-1.5 no-print">
                      <input
                        type="text"
                        value={editTxnVal}
                        onChange={(e) => setEditTxnVal(e.target.value)}
                        className="rounded-lg border border-amber-400 bg-white px-2 py-0.5 text-xs font-mono font-bold text-amber-950 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (receiptData && editTxnVal.trim()) {
                            setReceiptData({ ...receiptData, paymentId: editTxnVal.trim() });
                          }
                          setIsEditingReceiptTxn(false);
                        }}
                        className="rounded bg-amber-800 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-amber-900"
                      >
                        सेव्ह
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        {receiptData.paymentId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(receiptData.paymentId, "receipt-txn")}
                        className="no-print text-amber-800 hover:text-amber-950 inline-flex items-center"
                        title="कॉपी करा"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditTxnVal(receiptData.paymentId);
                          setIsEditingReceiptTxn(true);
                        }}
                        className="no-print text-[11px] text-amber-800 underline hover:text-amber-950 font-medium"
                      >
                        (आयडी बदला)
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between border-b border-dashed border-amber-300 py-1.5">
                  <span className="font-medium text-slate-600">उद्देश (Purpose):</span>
                  <span className="font-semibold text-slate-800">गुरुकुल विद्यार्थी शिक्षण, अन्नदान व संस्कार सेवा</span>
                </div>

                {/* Amount Paid (₹) Highlight Box */}
                <div className="mt-3 rounded-xl border-2 border-amber-700/60 bg-amber-100/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950">प्राप्त देणगी रक्कम (Amount Paid):</span>
                    {isEditingReceiptAmount ? (
                      <div className="flex items-center gap-1.5 no-print">
                        <span className="font-bold text-amber-950">₹</span>
                        <input
                          type="number"
                          min="1"
                          value={editAmountVal}
                          onChange={(e) => setEditAmountVal(e.target.value)}
                          className="w-24 rounded-lg border border-amber-400 bg-white px-2 py-0.5 text-sm font-bold text-amber-950 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const num = Number(editAmountVal);
                            if (receiptData && num > 0) {
                              setReceiptData({ ...receiptData, amount: num });
                            }
                            setIsEditingReceiptAmount(false);
                          }}
                          className="rounded bg-amber-800 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-amber-900"
                        >
                          सेव्ह
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-display text-2xl font-black text-amber-900">
                          ₹{receiptData.amount.toLocaleString("en-IN")}/-
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditAmountVal(String(receiptData.amount));
                            setIsEditingReceiptAmount(true);
                          }}
                          className="no-print text-[11px] text-amber-800 underline hover:text-amber-950 font-medium"
                          title="रक्कम बदला"
                        >
                          (रक्कम बदला)
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-amber-950 font-medium italic">
                    अक्षरी: {getAmountInWords(receiptData.amount).mr}
                  </div>
                </div>
              </div>


              {/* Seal & Signatures */}
              <div className="mt-6 flex items-center justify-between border-t-2 border-amber-900/30 pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-700 bg-green-50 text-green-700 font-bold text-[9px] text-center uppercase tracking-tight shadow-xs">
                    ✓ RECEIVED &amp; VERIFIED
                  </div>
                  <div className="text-[10px] text-slate-600">
                    <span className="block font-bold text-slate-800">अधिकृत ई-पावती</span>
                    <span>कायमस्वरूपी प्रणालीद्वारे सुरक्षित</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-bold text-amber-950">ह.भ.प. संतोष महाराज पवार</span>
                  <span className="block text-[11px] text-slate-600">संस्थापक अध्यक्ष</span>
                  <span className="block text-[10px] text-amber-900 font-medium">मा नर्मदा आध्यात्मिक शिक्षण संस्था</span>
                </div>
              </div>

              {/* Devotional Blessing Note */}
              <div className="mt-4 rounded-lg bg-amber-50 p-2.5 text-center text-xs text-amber-950 font-medium border border-amber-200">
                "आपल्या दातृत्वाबद्दल मनःपूर्वक धन्यवाद! भगवान श्री विठ्ठल व माऊली ज्ञानेश्वर महाराज आपणास उदंड आरोग्य व सुख-समृद्धी लाभो हीच प्रार्थना!"
              </div>
            </div>

            {/* Bottom Modal Actions (Hidden in Print) */}
            <div className="no-print border-t border-slate-200 bg-slate-50 p-4 rounded-b-2xl flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-amber-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-900 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>पावती प्रिंट करा / PDF सेव्ह करा</span>
              </button>

              <button
                type="button"
                onClick={handleShareReceiptWhatsApp}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-green-600 bg-green-50 px-4 py-2.5 text-xs font-bold text-green-700 hover:bg-green-100 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>व्हॉट्सॲपवर शेअर</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span>बंद करा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVED RECEIPTS MODAL */}
      {showSavedReceiptsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border-2 border-primary/50 bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-maroon">
                  {t({ mr: "मागील अधिकृत पावत्या (Saved Receipts)", en: "Saved Donation Receipts" })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSavedReceiptsModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-sand"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
              {savedReceipts.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  कोणतीही सेव्ह केलेली पावती उपलब्ध नाही.
                </p>
              ) : (
                savedReceipts.map((rcpt, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-card p-3.5 shadow-xs flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-maroon">
                          {rcpt.receiptNumber}
                        </span>
                        <span className="text-[11px] text-muted-foreground">• {rcpt.date}</span>
                      </div>
                      <div className="mt-1 text-sm font-semibold text-foreground">
                        {rcpt.donorName}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        UTR: {rcpt.paymentId}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className="font-display text-base font-bold text-amber-900">
                        ₹{rcpt.amount.toLocaleString("en-IN")}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptData(rcpt);
                          setShowSavedReceiptsModal(false);
                          setShowReceiptModal(true);
                        }}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        पावती पहा
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-border pt-3 text-right">
              <button
                type="button"
                onClick={() => setShowSavedReceiptsModal(false)}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-sand"
              >
                बंद करा
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}



