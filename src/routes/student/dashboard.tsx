import React, { useEffect, useState, useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  MapPin,
  Phone,
  Printer,
  ShieldAlert,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";

import { Container, Card } from "@/components/ui";
import { api, getGalleryImageUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [{ title: "विद्यार्थी डॅशबोर्ड — मा नर्मदा आध्यात्मिक शिक्षण संस्था" }],
  }),
  component: StudentDashboard,
});

interface PaymentItem {
  _id?: string;
  receiptNo: string;
  amount: number;
  paymentDate: string;
  paymentMode: string;
  transactionRef?: string;
  receivedBy?: string;
  notes?: string;
}

function StudentDashboard() {
  const { lang, t } = useLang();
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"profile" | "documents" | "fees">("profile");

  const [profile, setProfile] = useState<any>(null);
  const [fees, setFees] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Selected receipt for modal/printing
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentItem | null>(null);
  const receiptPrintRef = useRef<HTMLDivElement>(null);

  // Form states matching 5 key sections
  const [personal, setPersonal] = useState({
    fullName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    photo: "",
    mobile: "",
    email: "",
    fullAddress: "",
    currentAddress: "",
    village: "",
    city: "",
    taluka: "",
    district: "",
    parent: {
      parentName: "",
      fatherName: "",
      motherName: "",
      parentMobile: "",
      altMobile: "",
      occupation: "",
    },
  });

  const [academic, setAcademic] = useState({
    schoolName: "",
    schoolInfo: "",
    currentClass: "",
    course: "",
    admissionDate: "",
    previousSchool: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, authLoading, navigate]);

  // Load profile & fees
  const loadStudentData = async () => {
    setLoading(true);
    try {
      const res = await api.getStudentProfile();
      if (res.success) {
        setProfile(res.profile);
        setFees(res.fees);

        if (res.profile?.personal) {
          setPersonal((prev) => ({
            ...prev,
            ...res.profile.personal,
            fullAddress:
              res.profile.personal.fullAddress ||
              res.profile.personal.currentAddress ||
              "",
            village:
              res.profile.personal.village ||
              res.profile.personal.city ||
              "",
            taluka: res.profile.personal.taluka || "",
            district: res.profile.personal.district || "",
            parent: {
              ...prev.parent,
              parentName:
                res.profile.personal.parent?.parentName ||
                res.profile.personal.parent?.fatherName ||
                "",
              parentMobile: res.profile.personal.parent?.parentMobile || "",
              altMobile: res.profile.personal.parent?.altMobile || "",
              ...(res.profile.personal.parent || {}),
            },
          }));
        }

        if (res.profile?.academic) {
          setAcademic((prev) => ({
            ...prev,
            ...res.profile.academic,
            schoolName: res.profile.academic.schoolName || "",
            schoolInfo:
              res.profile.academic.schoolInfo ||
              res.profile.academic.previousSchool ||
              "",
            currentClass: res.profile.academic.currentClass || "",
            course: res.profile.academic.course || "",
            admissionDate: res.profile.academic.admissionDate || "",
          }));
        }
      }
    } catch (err: any) {
      console.error("Failed to load student profile:", err);
      setMessage({
        type: "error",
        text: err?.message || "विद्यार्थी माहिती लोड करताना त्रुटी आली",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  // Save Profile
  const handleSaveProfile = async (submitForVerification = false) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.updateStudentProfile({
        personal,
        academic,
        submitForVerification,
      });

      if (res.success) {
        setProfile(res.profile);
        setMessage({
          type: "success",
          text: submitForVerification
            ? lang === "mr"
              ? "माहिती जतन केली असून ॲडमिन पडताळणीसाठी सादर केली आहे!"
              : "Profile saved and submitted for Admin verification!"
            : lang === "mr"
              ? "माहिती यशस्वीरीत्या जतन केली!"
              : "Profile updated successfully!",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "माहिती सेव्ह करताना अडचण आली",
      });
    } finally {
      setSaving(false);
    }
  };

  // Upload Document
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docType);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    try {
      const res = await api.uploadStudentDocument(formData);
      if (res.success) {
        setProfile(res.profile);
        setMessage({
          type: "success",
          text:
            lang === "mr"
              ? "कागदपत्र यशस्वीरीत्या अपलोड झाले!"
              : "Document uploaded successfully!",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "कागदपत्र अपलोड करण्यात त्रुटी आली",
      });
    } finally {
      setUploadingDoc(null);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (authLoading || (loading && !profile)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="h-9 w-9 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-xs text-muted-foreground">
            {lang === "mr" ? "माहिती लोड होत आहे..." : "Loading student dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  const status = profile?.status || "Incomplete";
  const studentId = profile?.studentId;

  return (
    <div className="min-h-screen bg-sand/20 py-8">
      <Container className="max-w-5xl">
        {/* Top Header Card */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {profile?.personal?.photo ? (
                  <img
                    src={getGalleryImageUrl(profile.personal.photo)}
                    alt={personal.fullName || user?.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-primary shadow-sm"
                  />
                ) : (
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-maroon/10 text-maroon text-2xl font-bold">
                    {((personal.fullName || user?.name || "S").charAt(0) || "S").toUpperCase()}
                  </div>
                )}
                {status === "Verified" && (
                  <CheckCircle2 className="absolute -bottom-1 -right-1 h-6 w-6 text-emerald-600 bg-white rounded-full fill-emerald-100" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold text-maroon">
                    {personal.fullName || user?.name}
                  </h1>
                </div>

                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.email} {personal.mobile && `• ${personal.mobile}`}
                </p>

                {/* Student ID Banner */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {studentId ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-maroon/10 px-2.5 py-1 text-xs font-mono font-bold text-maroon border border-maroon/20">
                      <GraduationCap className="h-3.5 w-3.5" />
                      ID: {studentId}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200">
                      <Clock className="h-3 w-3" />
                      {lang === "mr" ? "पडताळणीनंतर आयडी दिला जाईल" : "Student ID pending verification"}
                    </span>
                  )}

                  {/* Status Badge */}
                  {status === "Verified" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {lang === "mr" ? "प्रवेश पडताळणी पूर्ण (Verified)" : "Verified Student"}
                    </span>
                  )}
                  {status === "Pending Verification" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      <Clock className="h-3.5 w-3.5" />
                      {lang === "mr" ? "पडताळणी प्रक्रियेत (Pending Verification)" : "Pending Verification"}
                    </span>
                  )}
                  {status === "Incomplete" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {lang === "mr" ? "माहिती अपूर्ण (Incomplete Profile)" : "Incomplete Profile"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-maroon transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{lang === "mr" ? "लॉगआउट" : "Logout"}</span>
              </button>
            </div>
          </div>

          {/* Pending verification advisory message */}
          {status === "Pending Verification" && (
            <div className="mt-4 rounded-xl bg-blue-50/80 p-3 text-xs text-blue-900 border border-blue-200">
              <p className="font-semibold">
                ℹ️ {lang === "mr" ? "आपला अर्ज प्रशासक पडताळणीसाठी सादर झाला आहे." : "Your application has been submitted for Admin verification."}
              </p>
              <p className="mt-0.5 text-blue-700">
                {lang === "mr"
                  ? "संस्थेचे प्रशासन आपले कागदपत्रे तपासून लवकरच आपला अधिकृत Student ID निश्चित करेल आणि फी रचना निश्चित करेल."
                  : "The administration will review your documents, assign your official Student ID, and set up your fee schedule shortly."}
              </p>
            </div>
          )}

          {status === "Incomplete" && (
            <div className="mt-4 rounded-xl bg-amber-50/80 p-3 text-xs text-amber-900 border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  ⚠️ {lang === "mr" ? "आपली प्रोफाइल अद्याप अपूर्ण आहे." : "Your profile is incomplete."}
                </p>
                <p className="mt-0.5 text-amber-800">
                  {lang === "mr"
                    ? "कृपया वैयक्तिक माहिती भरा आणि आधार कार्ड, जन्म दाखला कागदपत्रे अपलोड करून पडताळणीसाठी पाठवा."
                    : "Please fill out personal & academic details and upload required documents to request verification."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveProfile(true)}
                disabled={saving}
                className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
              >
                {lang === "mr" ? "पडताळणीसाठी पाठवा" : "Submit for Verification"}
              </button>
            </div>
          )}
        </div>

        {/* Global Alert Messages */}
        {message && (
          <div
            className={`mb-5 flex items-center gap-2 rounded-xl p-3.5 text-xs border ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tabs Switcher */}
        <div className="mb-6 flex overflow-x-auto rounded-xl bg-card border border-border p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex-1 min-w-[130px] rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            👤 {lang === "mr" ? "वैयक्तिक व शैक्षणिक माहिती" : "Profile Details"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`flex-1 min-w-[130px] rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "documents"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📑 {lang === "mr" ? "कागदपत्रे अपलोड" : "Documents"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fees")}
            className={`flex-1 min-w-[130px] rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "fees"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💳 {lang === "mr" ? "शुल्क व पावत्या (Fees & Receipts)" : "Fees & Receipts"}
          </button>
        </div>

        {/* ---------------- TAB 1: PROFILE DETAILS ---------------- */}
        {activeTab === "profile" && (
          <div className="grid gap-6">
            {/* 1. Personal Information */}
            <Card className="p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-bold text-maroon flex items-center gap-2 border-b border-border/70 pb-3 mb-4">
                <User className="h-4 w-4" />
                <span>{lang === "mr" ? "१. वैयक्तिक माहिती (Personal Information)" : "1. Personal Information"}</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "विद्यार्थ्याचे पूर्ण नाव (Full Name)" : "Full Name"} *
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. प्रथम नाव, वडिलांचे नाव, आडनाव"
                    value={personal.fullName}
                    onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "जन्मतारीख (Date of Birth)" : "Date of Birth"}
                  </label>
                  <input
                    type="date"
                    value={personal.dob}
                    onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "रक्तगट (Blood Group)" : "Blood Group"}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. O+, B+, A+, AB+"
                    value={personal.bloodGroup}
                    onChange={(e) => setPersonal({ ...personal, bloodGroup: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Gender (Optional) */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "लिंग (Gender) - पर्यायी" : "Gender (Optional)"}
                  </label>
                  <select
                    value={personal.gender}
                    onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">{lang === "mr" ? "-- निवडा (पर्यायी) --" : "-- Select (Optional) --"}</option>
                    <option value="Male">{lang === "mr" ? "पुरुष (Male)" : "Male"}</option>
                    <option value="Female">{lang === "mr" ? "स्त्री (Female)" : "Female"}</option>
                    <option value="Other">{lang === "mr" ? "इतर (Other)" : "Other"}</option>
                  </select>
                </div>

                {/* Student Photo Quick Action */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "विद्यार्थ्याचा फोटो (Student Photo)" : "Student Photo"}
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-accent px-3 py-2 text-xs font-medium hover:bg-accent/80 transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingDoc === "photo" ? "अपलोड होत आहे..." : "फोटो अपलोड करा"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "photo")}
                        disabled={uploadingDoc === "photo"}
                      />
                    </label>
                    {profile?.documents?.photo && (
                      <span className="text-[11px] font-semibold text-emerald-700">✓ सेव्ह आहे</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* 2. Parent / Guardian Information */}
            <Card className="p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-bold text-maroon flex items-center gap-2 border-b border-border/70 pb-3 mb-4">
                <Users className="h-4 w-4" />
                <span>{lang === "mr" ? "२. पालक / पालक माहिती (Parent / Guardian Information)" : "2. Parent / Guardian Information"}</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                {/* Parent's Name */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "पालकांचे नाव (Father’s / Mother’s Name)" : "Father’s / Mother’s Name"} *
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. आईचे किंवा वडिलांचे पूर्ण नाव"
                    value={personal.parent?.parentName || personal.parent?.fatherName || ""}
                    onChange={(e) =>
                      setPersonal({
                        ...personal,
                        parent: {
                          ...personal.parent,
                          parentName: e.target.value,
                          fatherName: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Parent's Mobile */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "पालकांचा मोबाईल नंबर (Parent’s Mobile)" : "Parent’s Mobile Number"} *
                  </label>
                  <input
                    type="tel"
                    placeholder="१० अंकी मोबाईल नंबर"
                    value={personal.parent?.parentMobile || ""}
                    onChange={(e) =>
                      setPersonal({
                        ...personal,
                        parent: { ...personal.parent, parentMobile: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Alternative Mobile Number */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "पर्यायी मोबाईल नंबर (Alternative Mobile)" : "Alternative Mobile Number"}
                  </label>
                  <input
                    type="tel"
                    placeholder="दुसरा संपर्क क्रमांक"
                    value={personal.parent?.altMobile || ""}
                    onChange={(e) =>
                      setPersonal({
                        ...personal,
                        parent: { ...personal.parent, altMobile: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </Card>

            {/* 3. Address Information */}
            <Card className="p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-bold text-maroon flex items-center gap-2 border-b border-border/70 pb-3 mb-4">
                <Home className="h-4 w-4" />
                <span>{lang === "mr" ? "३. पत्ता माहिती (Address Information)" : "3. Address Information"}</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                {/* Full Address */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "पूर्ण पत्ता (Full Address)" : "Full Address"}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="घर क्रमांक, गल्ली, एरिया / परिसर"
                    value={personal.fullAddress || personal.currentAddress || ""}
                    onChange={(e) =>
                      setPersonal({
                        ...personal,
                        fullAddress: e.target.value,
                        currentAddress: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Village */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "गाव (Village)" : "Village"}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. पिंपळनेर / ओंकारेश्वर"
                    value={personal.village || personal.city || ""}
                    onChange={(e) =>
                      setPersonal({
                        ...personal,
                        village: e.target.value,
                        city: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Taluka */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "तालुका (Taluka)" : "Taluka"}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. बडवाह / नेपानगर"
                    value={personal.taluka}
                    onChange={(e) => setPersonal({ ...personal, taluka: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "जिल्हा (District)" : "District"}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. खरगोन / खंडवा / पुणे"
                    value={personal.district}
                    onChange={(e) => setPersonal({ ...personal, district: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </Card>

            {/* 4. Educational Information */}
            <Card className="p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-bold text-maroon flex items-center gap-2 border-b border-border/70 pb-3 mb-4">
                <GraduationCap className="h-4 w-4" />
                <span>{lang === "mr" ? "४. शैक्षणिक माहिती (Educational Information)" : "4. Educational Information"}</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                {/* School Name */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "शाळेचे नाव (School Name)" : "School Name"}
                  </label>
                  <input
                    type="text"
                    placeholder="मागील किंवा सध्याच्या शाळेचे नाव"
                    value={academic.schoolName}
                    onChange={(e) => setAcademic({ ...academic, schoolName: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Class / Course */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "वर्ग किंवा अभ्यासक्रम (Class / Course)" : "Class / Course"}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. ५ वी / १० वी / गुरुकुल वेद वर्ग"
                    value={academic.currentClass || academic.course}
                    onChange={(e) =>
                      setAcademic({
                        ...academic,
                        currentClass: e.target.value,
                        course: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* School Information */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "शाळेची इतर माहिती (School Information)" : "School Information"}
                  </label>
                  <input
                    type="text"
                    placeholder="मागील वर्ग गुण, माध्यम किंवा इतर तपशील"
                    value={academic.schoolInfo || academic.previousSchool || ""}
                    onChange={(e) =>
                      setAcademic({
                        ...academic,
                        schoolInfo: e.target.value,
                        previousSchool: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </Card>

            {/* 5. Admission Information */}
            <Card className="p-5 sm:p-6 shadow-sm border-primary/30 bg-card">
              <h2 className="text-base font-bold text-maroon flex items-center gap-2 border-b border-border/70 pb-3 mb-4">
                <FileCheck className="h-4 w-4" />
                <span>{lang === "mr" ? "५. प्रवेश माहिती (Admission Information)" : "5. Admission Information"}</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                {/* Admission Date */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "प्रवेश दिनांक (Admission Date)" : "Admission Date"}
                  </label>
                  <input
                    type="date"
                    value={academic.admissionDate}
                    onChange={(e) => setAcademic({ ...academic, admissionDate: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {lang === "mr" ? "संस्थेत प्रवेश घेतलेली किंवा नोंदणीची तारीख" : "Date of admission to the institute"}
                  </p>
                </div>

                {/* Student ID / Admission Number */}
                <div>
                  <label className="block font-semibold mb-1">
                    {lang === "mr" ? "विद्यार्थी ID / प्रवेश क्रमांक (Student ID)" : "Student ID / Admission Number"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={studentId || (lang === "mr" ? "पडताळणीनंतर ॲडमिनद्वारे दिला जाईल" : "Assigned by Admin upon verification")}
                      className={`w-full rounded-lg border px-3 py-2 text-sm font-mono font-bold ${
                        studentId
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-border bg-muted/60 text-muted-foreground"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {lang === "mr"
                      ? "ℹ️ हा क्रमांक कागदपत्रांची तपासणी झाल्यानंतर ॲडमिनकडून अधिकृतपणे निश्चित केला जातो."
                      : "ℹ️ This official admission ID is assigned by the Admin after document verification."}
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSaveProfile(false)}
                disabled={saving}
                className="rounded-full border border-primary/40 bg-sand/60 px-5 py-2.5 text-xs font-semibold text-maroon hover:bg-sand transition-colors disabled:opacity-50"
              >
                {saving ? "जतन होत आहे..." : lang === "mr" ? "माहिती सेव्ह करा (Save Draft)" : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={() => handleSaveProfile(true)}
                disabled={saving}
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {saving
                  ? "सादर होत आहे..."
                  : lang === "mr"
                    ? "पडताळणीसाठी सादर करा (Submit for Verification)"
                    : "Submit for Verification"}
              </button>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: DOCUMENTS UPLOAD ---------------- */}
        {activeTab === "documents" && (
          <div className="grid gap-6">
            <Card className="p-5 sm:p-6 shadow-sm">
              <div className="border-b border-border/70 pb-3 mb-4">
                <h2 className="text-base font-bold text-maroon flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span>{lang === "mr" ? "माझी कागदपत्रे (My Documents)" : "My Documents"}</span>
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {lang === "mr"
                    ? "कृपया खालील सर्व ८ आवश्यक कागदपत्रे PDF किंवा JPG/PNG स्वरूपात सुरक्षित अपलोड करा (कमाल मर्यादा: १० MB)."
                    : "Please upload all 8 required documents in PDF or JPG/PNG format (Max size: 10MB each)."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    key: "aadhaar",
                    icon: "🪪",
                    titleMr: "१. आधार कार्ड (Aadhaar Card)",
                    titleEn: "1. Aadhaar Card",
                    descMr: "विद्यार्थ्याचे किंवा पालकांचे आधार कार्ड",
                    descEn: "Student or Parent Aadhaar Card",
                    accept: "image/*,application/pdf",
                  },
                  {
                    key: "panCard",
                    icon: "💳",
                    titleMr: "२. पॅन कार्ड (PAN Card)",
                    titleEn: "2. PAN Card",
                    descMr: "विद्यार्थ्याचे किंवा पालकांचे पॅन कार्ड",
                    descEn: "Student or Parent PAN Card",
                    accept: "image/*,application/pdf",
                  },
                  {
                    key: "birthCertificate",
                    icon: "📜",
                    titleMr: "३. जन्म प्रमाणपत्र (Birth Certificate)",
                    titleEn: "3. Birth Certificate",
                    descMr: "ग्रामपंचायत / नगरपरिषद / अधिकृत जन्म दाखला",
                    descEn: "Official government birth certificate",
                    accept: "image/*,application/pdf",
                  },
                  {
                    key: "schoolDocuments",
                    icon: "🏫",
                    titleMr: "४. शाळेची कागदपत्रे (School Documents)",
                    titleEn: "4. School Documents",
                    descMr: "मागील वर्गाची गुणपत्रिका / बोनाफाईड सर्टिफिकेट",
                    descEn: "Previous marksheet, bonafide or school records",
                    accept: "image/*,application/pdf",
                    fallbackKey: "previousSchoolMarksheet",
                  },
                  {
                    key: "leavingCertificate",
                    icon: "🎓",
                    titleMr: "५. मागील शाळेचा दाखला (Leaving Certificate - LC)",
                    titleEn: "5. Previous School Leaving Certificate (LC)",
                    descMr: "शाळा सोडल्याचा अधिकृत मूळ दाखला / TC",
                    descEn: "Original School Leaving / Transfer Certificate",
                    accept: "image/*,application/pdf",
                  },
                  {
                    key: "photo",
                    icon: "📷",
                    titleMr: "६. विद्यार्थ्याचा फोटो (Student Photo)",
                    titleEn: "6. Student Photo",
                    descMr: "पासपोर्ट आकाराचे ताजे रंगीत छायाचित्र",
                    descEn: "Recent passport-size photograph (JPG/PNG)",
                    accept: "image/*",
                  },
                  {
                    key: "parentDocuments",
                    icon: "👨‍👩‍👦",
                    titleMr: "७. पालकांची कागदपत्रे (Parent Documents)",
                    titleEn: "7. Parent Documents",
                    descMr: "आई किंवा वडिलांचे ओळखपत्र / पत्त्याचा पुरावा",
                    descEn: "Parent/Guardian ID or address proof",
                    accept: "image/*,application/pdf",
                  },
                  {
                    key: "otherCertificates",
                    icon: "📑",
                    titleMr: "८. इतर आवश्यक प्रमाणपत्रे (Other Certificates)",
                    titleEn: "8. Other Required Certificates",
                    descMr: "जात प्रमाणपत्र, उत्पन्न दाखला किंवा इतर कागदपत्रे",
                    descEn: "Caste certificate, income certificate or other documents",
                    accept: "image/*,application/pdf",
                    fallbackKey: "other",
                  },
                ].map((doc) => {
                  const docUrl =
                    (profile?.documents as any)?.[doc.key] ||
                    (doc.fallbackKey ? (profile?.documents as any)?.[doc.fallbackKey] : null);
                  const isUploaded = Boolean(docUrl);
                  const isUploading = uploadingDoc === doc.key;

                  return (
                    <div
                      key={doc.key}
                      className={`rounded-xl border p-4 bg-background transition-all flex flex-col justify-between ${
                        isUploaded ? "border-emerald-200 bg-emerald-50/20" : "border-border"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                              <span>{doc.icon}</span>
                              <span className="truncate">{lang === "mr" ? doc.titleMr : doc.titleEn}</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {lang === "mr" ? doc.descMr : doc.descEn}
                            </p>
                          </div>

                          {isUploaded ? (
                            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                              ✓ {lang === "mr" ? "अपलोड झाले" : "Uploaded"}
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200">
                              {lang === "mr" ? "प्रलंबित" : "Pending"}
                            </span>
                          )}
                        </div>

                        {/* View document link */}
                        {isUploaded && (
                          <div className="mt-3">
                            <a
                              href={getGalleryImageUrl(docUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-maroon hover:underline inline-flex items-center gap-1"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>{lang === "mr" ? "कागदपत्र पहा (View)" : "View Document"}</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-accent px-3 py-1.5 text-xs font-medium hover:bg-accent/80 transition-colors">
                          <Upload className="h-3.5 w-3.5" />
                          <span>
                            {isUploading
                              ? lang === "mr"
                                ? "अपलोड होत आहे..."
                                : "Uploading..."
                              : isUploaded
                                ? lang === "mr"
                                  ? "कागदपत्र बदला"
                                  : "Re-upload"
                                : lang === "mr"
                                  ? "अपलोड करा"
                                  : "Upload"}
                          </span>
                          <input
                            type="file"
                            accept={doc.accept}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, doc.key)}
                            disabled={isUploading}
                          />
                        </label>

                        <span className="text-[10px] text-muted-foreground">
                          {doc.accept.includes("pdf") ? "PDF / JPG / PNG" : "JPG / PNG"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ---------------- TAB 3: FEES SUMMARY & RECEIPTS ---------------- */}
        {activeTab === "fees" && (
          <div className="grid gap-6">
            {/* 4 Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5 shadow-xs border-primary/20 bg-card">
                <p className="text-xs font-semibold text-muted-foreground">
                  {lang === "mr" ? "एकूण शुल्क (Total Fees)" : "Total Fees"}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  ₹{Number(fees?.totalFees || 0).toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {fees?.academicYear ? `शैक्षणिक वर्ष: ${fees.academicYear}` : "चालू शैक्षणिक वर्ष"}
                </p>
              </Card>

              <Card className="p-5 shadow-xs border-emerald-500/20 bg-emerald-50/20">
                <p className="text-xs font-semibold text-emerald-800">
                  {lang === "mr" ? "भरलेले शुल्क (Paid Fees)" : "Paid Fees"}
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-700">
                  ₹{Number(fees?.paidFees || 0).toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-[11px] text-emerald-800/80">
                  {fees?.payments?.length || 0} {lang === "mr" ? "पेमेंट्स जमा" : "payments recorded"}
                </p>
              </Card>

              <Card className="p-5 shadow-xs border-amber-500/20 bg-amber-50/20">
                <p className="text-xs font-semibold text-amber-800">
                  {lang === "mr" ? "उर्वरित बाकी (Remaining Balance)" : "Remaining Balance"}
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-700">
                  ₹{Number(fees?.remainingFees || 0).toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-[11px] text-amber-800/80">
                  {fees?.remainingFees === 0
                    ? lang === "mr"
                      ? "सर्व फी पूर्ण भरली आहे"
                      : "All fees clear"
                    : lang === "mr"
                      ? "हप्त्यानुसार भरणे बाकी"
                      : "Pending installment"}
                </p>
              </Card>

              <Card className="p-5 shadow-xs border-blue-500/20 bg-blue-50/20">
                <p className="text-xs font-semibold text-blue-800">
                  {lang === "mr" ? "पुढील देय तारीख (Next Due Date)" : "Next Due Date"}
                </p>
                <p className="mt-2 text-xl font-bold text-blue-900">
                  {fees?.nextDueDate || (lang === "mr" ? "निश्चित नाही" : "Not set")}
                </p>
                <p className="mt-1 text-[11px] text-blue-800/80">
                  {fees?.feeScheduleNotes || (lang === "mr" ? "वेळेत फी भरावी" : "Due as per schedule")}
                </p>
              </Card>
            </div>

            {/* Payment History & Receipts Table */}
            <Card className="p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-maroon flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    <span>{lang === "mr" ? "पेमेंट इतिहास व अधिकृत पावती" : "Payment History & Receipts"}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "mr"
                      ? "प्रत्येक भरलेल्या फीची अधिकृत डिजिटल पावती येथे पाहू व डाऊनलोड करू शकता."
                      : "View and download official fee receipts for every payment."}
                  </p>
                </div>
              </div>

              {(!fees?.payments || fees.payments.length === 0) ? (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  <p className="font-medium text-sm">
                    {lang === "mr" ? "अद्याप कोणतीही पेमेंट नोंद नाही." : "No payment history found yet."}
                  </p>
                  <p className="mt-1">
                    {lang === "mr"
                      ? "ऑफिसमध्ये फी जमा केल्यानंतर ॲडमिन पावती येथे अपडेट करेल."
                      : "Receipt will appear here once payment is registered by the office administration."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-sand/40 font-semibold text-maroon">
                        <th className="py-2.5 px-3">पावती क्र. (Receipt No)</th>
                        <th className="py-2.5 px-3">तारीख (Date)</th>
                        <th className="py-2.5 px-3">रक्कम (Amount)</th>
                        <th className="py-2.5 px-3">माध्यम (Mode)</th>
                        <th className="py-2.5 px-3">नोंदणीकर्ता (Received By)</th>
                        <th className="py-2.5 px-3 text-right">कृती (Action)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {fees.payments.map((p: PaymentItem, idx: number) => (
                        <tr key={idx} className="hover:bg-accent/40 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-maroon">
                            {p.receiptNo}
                          </td>
                          <td className="py-3 px-3">
                            {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-IN") : "-"}
                          </td>
                          <td className="py-3 px-3 font-bold text-emerald-700">
                            ₹{Number(p.amount).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3">
                            <span className="rounded-md bg-sand px-2 py-0.5 font-medium">
                              {p.paymentMode}
                            </span>
                            {p.transactionRef && (
                              <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                                Ref: {p.transactionRef}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">
                            {p.receivedBy || "Office Admin"}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(p)}
                              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-maroon px-2.5 py-1 text-xs font-semibold transition-colors"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>{lang === "mr" ? "पावती पहा / डाऊनलोड" : "Receipt"}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </Container>

      {/* ---------------- OFFICIAL RECEIPT MODAL ---------------- */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl text-black">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-black print:hidden"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Printable Receipt Area */}
            <div ref={receiptPrintRef} className="print:p-6">
              {/* Trust & Gurukul Header */}
              <div className="text-center border-b-2 border-amber-600 pb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                  ॥ श्री नर्मदा प्रसन्न ॥
                </p>
                <h2 className="text-xl font-bold text-amber-900 mt-1 font-serif">
                  मा नर्मदा आध्यात्मिक शिक्षण संस्था, आळंदी देवाची
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  पत्ता: वडगाव रोड, आळंदी देवाची, ता. खेड, जि. पुणे, महाराष्ट्र — ४१२१०५
                </p>
                <p className="text-[11px] text-gray-500">
                  अधिकृत फी पावती (Official Fee Receipt)
                </p>
              </div>

              {/* Receipt Details Header */}
              <div className="mt-4 flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                <div>
                  <span className="text-gray-500">पावती क्रमांक: </span>
                  <span className="font-mono font-bold text-amber-950">
                    {selectedReceipt.receiptNo}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">दिनांक: </span>
                  <span className="font-bold">
                    {selectedReceipt.paymentDate
                      ? new Date(selectedReceipt.paymentDate).toLocaleDateString("en-IN")
                      : new Date().toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Student Info Table */}
              <div className="mt-3 text-xs grid grid-cols-2 gap-2 bg-amber-50/50 p-3 rounded-lg border border-amber-200/60">
                <div>
                  <span className="text-gray-500 block">विद्यार्थ्याचे नाव:</span>
                  <span className="font-bold text-sm text-gray-900">
                    {personal.fullName || user?.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">विद्यार्थी आयडी (Student ID):</span>
                  <span className="font-mono font-bold text-amber-900">
                    {studentId || "MNS-2026-TEMP"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">वर्ग / अभ्यासक्रम:</span>
                  <span className="font-medium text-gray-800">
                    {academic.currentClass || "गुरुकुल शिक्षण वर्ग"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">पेमेंट माध्यम (Payment Mode):</span>
                  <span className="font-medium text-gray-800">
                    {selectedReceipt.paymentMode} {selectedReceipt.transactionRef ? `(${selectedReceipt.transactionRef})` : ""}
                  </span>
                </div>
              </div>

              {/* Fee Amount Breakdown */}
              <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="p-2 text-left">तपशील (Particulars)</th>
                      <th className="p-2 text-right">रक्कम (Amount)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5">
                        गुरुकुल शैक्षणिक व निवास शुल्क (Gurukul Fees)
                        {selectedReceipt.notes && (
                          <span className="block text-[11px] text-gray-500">
                            नोंद: {selectedReceipt.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-sm">
                        ₹{Number(selectedReceipt.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr className="bg-amber-50/70 border-t border-gray-300 font-bold">
                      <td className="p-2.5">एकूण जमा रक्कम (Total Received)</td>
                      <td className="p-2.5 text-right text-base text-amber-950">
                        ₹{Number(selectedReceipt.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures & Stamp */}
              <div className="mt-8 flex justify-between items-end text-xs pt-4 border-t border-dashed border-gray-300">
                <div className="text-center">
                  <div className="h-10 w-24 border-b border-gray-400 mb-1" />
                  <span className="text-gray-500">पालक / विद्यार्थी स्वाक्षरी</span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 mb-1">
                    {selectedReceipt.receivedBy || "अधीक्षक / प्रशासक"}
                  </p>
                  <span className="text-gray-500">मा नर्मदा संस्था अधिकृत स्वाक्षरी व शिक्का</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4 print:hidden">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                बंद करा (Close)
              </button>
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800"
              >
                <Printer className="h-4 w-4" />
                <span>प्रिंट / PDF सेव्ह करा (Print Receipt)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
