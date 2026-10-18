import React, { useEffect, useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Plus,
  Printer,
  RefreshCw,
  Search,
  User,
  Users,
  X,
} from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api, getGalleryImageUrl } from "@/lib/api";

export const Route = createFileRoute("/admin/students")({
  head: () => ({
    meta: [{ title: "विद्यार्थी व फी व्यवस्थापन — प्रशासकीय पॅनेल" }],
  }),
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    incomplete: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Selected student for drawer/modal
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentFees, setStudentFees] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<"verify" | "fees" | "payment">("verify");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Verification edit states
  const [editStatus, setEditStatus] = useState("Pending Verification");
  const [editStudentId, setEditStudentId] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");

  // Fee structure edit states
  const [feeTotal, setFeeTotal] = useState<number>(0);
  const [feeDueDate, setFeeDueDate] = useState("");
  const [feeNotes, setFeeNotes] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-2026");

  // Record payment form states
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [transactionRef, setTransactionRef] = useState("");
  const [receivedBy, setReceivedBy] = useState("Office Admin");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Printable receipt state
  const [printableReceipt, setPrintableReceipt] = useState<any | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetStudents({
        search,
        status: statusFilter,
      });

      if (res.success) {
        setStudents(res.students || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  // Open Student Modal & load full details
  const openStudentModal = async (student: any) => {
    setSelectedStudent(student);
    setModalTab("verify");
    setModalMessage(null);
    setModalLoading(true);

    setEditStatus(student.status || "Pending Verification");
    setEditStudentId(student.studentId || "");
    setEditAdminNotes(student.adminNotes || "");

    try {
      const res = await api.adminGetStudent(student._id);
      if (res.success) {
        setSelectedStudent(res.student);
        setStudentFees(res.fees);

        if (res.fees) {
          setFeeTotal(res.fees.totalFees || 0);
          setFeeDueDate(res.fees.nextDueDate || "");
          setFeeNotes(res.fees.feeScheduleNotes || "");
          setAcademicYear(res.fees.academicYear || "2025-2026");
        }
      }
    } catch (err: any) {
      setModalMessage({
        type: "error",
        text: err?.message || "विद्यार्थी तपशील लोड करता आले नाहीत",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Save Verification & Student ID
  const handleSaveVerification = async () => {
    if (!selectedStudent) return;
    setModalLoading(true);
    setModalMessage(null);

    try {
      const res = await api.adminVerifyStudent(selectedStudent._id, {
        status: editStatus,
        studentId: editStudentId,
        adminNotes: editAdminNotes,
      });

      if (res.success) {
        setModalMessage({
          type: "success",
          text: "विद्यार्थी पडताळणी व आयडी यशस्वीरीत्या अपडेट केली!",
        });
        setSelectedStudent(res.student);
        fetchStudents();
      }
    } catch (err: any) {
      setModalMessage({
        type: "error",
        text: err?.message || "अपडेट करण्यात त्रुटी आली",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Save Fee Structure
  const handleSaveFees = async () => {
    if (!selectedStudent) return;
    setModalLoading(true);
    setModalMessage(null);

    try {
      const res = await api.adminSetStudentFees(selectedStudent._id, {
        totalFees: feeTotal,
        nextDueDate: feeDueDate,
        feeScheduleNotes: feeNotes,
        academicYear,
      });

      if (res.success) {
        setModalMessage({
          type: "success",
          text: "शुल्क रचना यशस्वीरीत्या सेव्ह केली!",
        });
        setStudentFees(res.fees);
        fetchStudents();
      }
    } catch (err: any) {
      setModalMessage({
        type: "error",
        text: err?.message || "शुल्क सेव्ह करताना त्रुटी आली",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Record Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    if (!paymentAmount || paymentAmount <= 0) {
      setModalMessage({
        type: "error",
        text: "कृपया ० पेक्षा जास्त रक्कम प्रविष्ट करा",
      });
      return;
    }

    setModalLoading(true);
    setModalMessage(null);

    try {
      const res = await api.adminRecordFeePayment(selectedStudent._id, {
        amount: paymentAmount,
        paymentMode,
        paymentDate,
        transactionRef,
        receivedBy,
        notes: paymentNotes,
      });

      if (res.success) {
        setModalMessage({
          type: "success",
          text: `पेमेंट यशस्वीरीत्या जमा झाले! पावती क्र: ${res.payment.receiptNo}`,
        });
        setStudentFees(res.fees);
        setPaymentAmount(0);
        setTransactionRef("");
        setPaymentNotes("");
        fetchStudents();
      }
    } catch (err: any) {
      setModalMessage({
        type: "error",
        text: err?.message || "पेमेंट नोंदवताना त्रुटी आली",
      });
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <AdminLayout title="विद्यार्थी व फी व्यवस्थापन (Students & Fee Portal)">
      <div className="grid gap-6">
        {/* Top 4 Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                एकूण विद्यार्थी (Total)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.total}</p>
          </Card>

          <Card className="p-4 bg-card shadow-xs border-amber-300/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800">
                प्रलंबित पडताळणी (Pending)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-700">{stats.pending}</p>
          </Card>

          <Card className="p-4 bg-card shadow-xs border-emerald-300/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">
                अधिकृत विद्यार्थी (Verified)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{stats.verified}</p>
          </Card>

          <Card className="p-4 bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                अपूर्ण प्रोफाइल (Incomplete)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.incomplete}</p>
          </Card>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-xl border border-border bg-card p-3 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="नाव, Student ID, किंवा मोबाईलने शोधा..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-1.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/30"
            >
              <option value="ALL">सर्व स्थिती (All Status)</option>
              <option value="Pending Verification">पडताळणी प्रलंबित (Pending)</option>
              <option value="Verified">पडताळणी पूर्ण (Verified)</option>
              <option value="Incomplete">अपूर्ण (Incomplete)</option>
            </select>

            <button
              type="button"
              onClick={fetchStudents}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
              title="रिफ्रेश करा"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Students Table */}
        <Card className="overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              विद्यार्थी यादी लोड होत आहे...
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              कोणताही विद्यार्थी सापडला नाही.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-sand/40 font-semibold text-maroon">
                    <th className="py-3 px-4">विद्यार्थी (Student)</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">वर्ग / अभ्यासक्रम</th>
                    <th className="py-3 px-4">स्थिती (Status)</th>
                    <th className="py-3 px-4">शुल्क स्थिती (Fees)</th>
                    <th className="py-3 px-4 text-right">कृती (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-accent/40 transition-colors">
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {s.personal?.photo ? (
                            <img
                              src={getGalleryImageUrl(s.personal.photo)}
                              alt={s.personal.fullName}
                              className="h-10 w-10 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon/10 text-maroon font-bold text-sm">
                              {(s.personal?.fullName || s.user?.name || "S")[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-foreground">
                              {s.personal?.fullName || s.user?.name || "निनावी"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {s.personal?.mobile || s.user?.mobile || s.personal?.email || s.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3 px-4 font-mono font-bold text-maroon">
                        {s.studentId ? (
                          <span className="rounded-md bg-maroon/10 px-2 py-0.5 border border-maroon/20">
                            {s.studentId}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px] italic">वाटप नाही</span>
                        )}
                      </td>

                      {/* Class / Course */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{s.academic?.currentClass || "-"}</p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                          {s.academic?.course || "-"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {s.status === "Verified" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                        {s.status === "Pending Verification" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-semibold text-amber-800">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {s.status === "Incomplete" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 font-semibold text-gray-700">
                            <AlertCircle className="h-3 w-3" />
                            Incomplete
                          </span>
                        )}
                      </td>

                      {/* Fees */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-foreground">
                          ₹{Number(s.fees?.paidFees || 0).toLocaleString("en-IN")}{" "}
                          <span className="text-muted-foreground font-normal">
                            / ₹{Number(s.fees?.totalFees || 0).toLocaleString("en-IN")}
                          </span>
                        </p>
                        <p className="text-[11px] text-amber-700 font-medium">
                          बाकी: ₹{Number(s.fees?.remainingFees || 0).toLocaleString("en-IN")}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openStudentModal(s)}
                          className="rounded-lg bg-primary/10 hover:bg-primary/20 text-maroon px-3 py-1.5 text-xs font-semibold transition-colors"
                        >
                          व्यवस्थापन करा (Manage)
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

      {/* ---------------- STUDENT MANAGEMENT MODAL ---------------- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-card p-5 sm:p-6 shadow-2xl border border-border my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Close */}
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 border-b border-border/70 pb-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon/10 text-maroon font-bold text-lg">
                {(selectedStudent.personal?.fullName || "S")[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-maroon">
                  {selectedStudent.personal?.fullName || selectedStudent.user?.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  मोबाईल: {selectedStudent.personal?.mobile || selectedStudent.user?.mobile || "-"} •
                  ई-मेल: {selectedStudent.personal?.email || selectedStudent.user?.email || "-"}
                </p>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="mb-4 flex rounded-lg bg-sand/60 p-1 border border-border/60">
              <button
                type="button"
                onClick={() => setModalTab("verify")}
                className={`flex-1 rounded-md py-2 text-xs font-semibold transition-all ${
                  modalTab === "verify"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🔍 माहिती व पडताळणी (Verification)
              </button>

              <button
                type="button"
                onClick={() => setModalTab("fees")}
                className={`flex-1 rounded-md py-2 text-xs font-semibold transition-all ${
                  modalTab === "fees"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ⚙️ फी रचना (Fee Structure)
              </button>

              <button
                type="button"
                onClick={() => setModalTab("payment")}
                className={`flex-1 rounded-md py-2 text-xs font-semibold transition-all ${
                  modalTab === "payment"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                💵 पेमेंट नोंदणी (Record Payment)
              </button>
            </div>

            {/* Modal Alert Message */}
            {modalMessage && (
              <div
                className={`mb-4 rounded-lg p-3 text-xs border ${
                  modalMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {modalMessage.text}
              </div>
            )}

            {/* ================= TAB 1: VERIFICATION & PROFILE ================= */}
            {modalTab === "verify" && (
              <div className="grid gap-5 text-xs">
                {/* Status & Student ID Control */}
                <div className="rounded-xl border border-primary/30 bg-sand/30 p-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      प्रवेश स्थिती (Status) *
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="Pending Verification">पडताळणी प्रलंबित (Pending)</option>
                      <option value="Verified">मान्यता दिली (Verified)</option>
                      <option value="Incomplete">अपूर्ण (Incomplete)</option>
                      <option value="Rejected">नाकारले (Rejected)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      Student ID / नोंदणी क्रमांक
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. MNS-2026-001"
                      value={editStudentId}
                      onChange={(e) => setEditStudentId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      ॲडमिन शेरा (Admin Notes)
                    </label>
                    <input
                      type="text"
                      placeholder="कागदपत्रे तपासली / योग्य"
                      value={editAdminNotes}
                      onChange={(e) => setEditAdminNotes(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Uploaded Documents Links (All 8 Documents) */}
                <div className="rounded-xl border border-border p-4 bg-background">
                  <h3 className="font-bold text-maroon mb-2 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4" />
                    <span>विद्यार्थ्याने अपलोड केलेली सर्व ८ कागदपत्रे (Uploaded Documents)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { key: "aadhaar", label: "१. आधार कार्ड", icon: "🪪" },
                      { key: "panCard", label: "२. पॅन कार्ड", icon: "💳" },
                      { key: "birthCertificate", label: "३. जन्म दाखला", icon: "📜" },
                      { key: "schoolDocuments", fallback: "previousSchoolMarksheet", label: "४. शाळेची कागदपत्रे", icon: "🏫" },
                      { key: "leavingCertificate", label: "५. शाळा दाखला (LC)", icon: "🎓" },
                      { key: "photo", label: "६. विद्यार्थी फोटो", icon: "📷" },
                      { key: "parentDocuments", label: "७. पालक कागदपत्रे", icon: "👨‍👩‍👦" },
                      { key: "otherCertificates", fallback: "other", label: "८. इतर प्रमाणपत्रे", icon: "📑" },
                    ].map((doc) => {
                      const docPath =
                        selectedStudent.documents?.[doc.key] ||
                        (doc.fallback ? selectedStudent.documents?.[doc.fallback] : null);

                      return (
                        <div key={doc.key} className="p-2 border rounded-lg bg-accent/30 text-center flex flex-col justify-between">
                          <div>
                            <span className="block text-[11px] font-semibold text-foreground">
                              {doc.icon} {doc.label}
                            </span>
                          </div>
                          <div className="mt-1.5">
                            {docPath ? (
                              <a
                                href={getGalleryImageUrl(docPath)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-maroon/10 px-2 py-0.5 text-[10px] font-bold text-maroon hover:bg-maroon hover:text-white transition-colors"
                              >
                                <Eye className="h-3 w-3" /> पहा (View)
                              </a>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/80">अपलोड नाही</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Breakdown */}
                {/* Details Breakdown across all 5 sections */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-3 border rounded-xl bg-card">
                    <p className="font-bold text-maroon mb-1 border-b pb-1">१. वैयक्तिक माहिती</p>
                    <p>जन्म: {selectedStudent.personal?.dob || "-"}</p>
                    <p>रक्तगट: {selectedStudent.personal?.bloodGroup || "-"}</p>
                    <p>लिंग: {selectedStudent.personal?.gender || "-"}</p>
                    <p>मोबाईल: {selectedStudent.personal?.mobile || selectedStudent.user?.mobile || "-"}</p>
                  </div>

                  <div className="p-3 border rounded-xl bg-card">
                    <p className="font-bold text-maroon mb-1 border-b pb-1">२. पालक माहिती</p>
                    <p>पालक: {selectedStudent.personal?.parent?.parentName || selectedStudent.personal?.parent?.fatherName || "-"}</p>
                    <p>मोबाईल: {selectedStudent.personal?.parent?.parentMobile || "-"}</p>
                    <p>पर्यायी फोन: {selectedStudent.personal?.parent?.altMobile || "-"}</p>
                  </div>

                  <div className="p-3 border rounded-xl bg-card">
                    <p className="font-bold text-maroon mb-1 border-b pb-1">३. पत्ता माहिती</p>
                    <p>पत्ता: {selectedStudent.personal?.fullAddress || selectedStudent.personal?.currentAddress || "-"}</p>
                    <p>गाव: {selectedStudent.personal?.village || selectedStudent.personal?.city || "-"}</p>
                    <p>तालुका: {selectedStudent.personal?.taluka || "-"}</p>
                    <p>जिल्हा: {selectedStudent.personal?.district || "-"}</p>
                  </div>

                  <div className="p-3 border rounded-xl bg-card">
                    <p className="font-bold text-maroon mb-1 border-b pb-1">४. शैक्षणिक व प्रवेश</p>
                    <p>शाळा: {selectedStudent.academic?.schoolName || "-"}</p>
                    <p>वर्ग/कोर्स: {selectedStudent.academic?.currentClass || selectedStudent.academic?.course || "-"}</p>
                    <p>इतर माहिती: {selectedStudent.academic?.schoolInfo || selectedStudent.academic?.previousSchool || "-"}</p>
                    <p>प्रवेश तारीख: {selectedStudent.academic?.admissionDate || "-"}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveVerification}
                    disabled={modalLoading}
                    className="rounded-full bg-primary px-6 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {modalLoading ? "अपडेट होत आहे..." : "पडताळणी जतन करा (Save Verification)"}
                  </button>
                </div>
              </div>
            )}

            {/* ================= TAB 2: FEE STRUCTURE ================= */}
            {modalTab === "fees" && (
              <div className="grid gap-4 text-xs">
                <div className="rounded-xl border border-border p-4 bg-background grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold mb-1">
                      एकूण शैक्षणिक व निवास शुल्क (Total Fees ₹) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={feeTotal}
                      onChange={(e) => setFeeTotal(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">शैक्षणिक वर्ष</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">पुढील हप्ता देय तारीख (Next Due Date)</label>
                    <input
                      type="date"
                      value={feeDueDate}
                      onChange={(e) => setFeeDueDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">हप्ते / फी शेड्युल शेरा</label>
                    <input
                      type="text"
                      placeholder="उदा. २ समान हप्त्यांमध्ये भरणे"
                      value={feeNotes}
                      onChange={(e) => setFeeNotes(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Summary View */}
                {studentFees && (
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-sand/30 border text-center">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">एकूण फी</span>
                      <span className="font-bold text-sm">
                        ₹{Number(studentFees.totalFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">जमा रक्कम</span>
                      <span className="font-bold text-sm text-emerald-700">
                        ₹{Number(studentFees.paidFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">शिल्लक बाकी</span>
                      <span className="font-bold text-sm text-amber-800">
                        ₹{Number(studentFees.remainingFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveFees}
                    disabled={modalLoading}
                    className="rounded-full bg-primary px-6 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {modalLoading ? "सेव्ह होत आहे..." : "शुल्क रचना सेव्ह करा (Save Fees)"}
                  </button>
                </div>
              </div>
            )}

            {/* ================= TAB 3: RECORD PAYMENT ================= */}
            {modalTab === "payment" && (
              <div className="grid gap-5 text-xs">
                <form
                  onSubmit={handleRecordPayment}
                  className="rounded-xl border border-primary/30 bg-sand/20 p-4 grid gap-3 sm:grid-cols-2"
                >
                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      जमा रक्कम (Payment Amount ₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={paymentAmount || ""}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      placeholder="उदा. 5000"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      पेमेंट माध्यम (Mode) *
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="Cash">रोख (Cash)</option>
                      <option value="UPI">UPI / GPay / PhonePe</option>
                      <option value="Bank Transfer">बँक ट्रान्सफर (NEFT/RTGS)</option>
                      <option value="Cheque">धनादेश (Cheque)</option>
                      <option value="Online">ऑनलाईन पोर्टल</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">पेमेंट दिनांक</label>
                    <input
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      UPI Ref / Cheque No
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. UPI12345678"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      स्वीकारकर्ता (Received By)
                    </label>
                    <input
                      type="text"
                      value={receivedBy}
                      onChange={(e) => setReceivedBy(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">नोंद / पावती शेरा</label>
                    <input
                      type="text"
                      placeholder="उदा. प्रथम हप्ता"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {modalLoading
                        ? "नोंदणी होत आहे..."
                        : "पेमेंट जमा करा व पावती बनवा (Record Payment)"}
                    </button>
                  </div>
                </form>

                {/* History */}
                <div>
                  <h4 className="font-bold text-maroon mb-2">पेमेंट इतिहास (Payments Recorded)</h4>
                  {(!studentFees?.payments || studentFees.payments.length === 0) ? (
                    <p className="text-muted-foreground italic">अद्याप पेमेंट नोंद नाही.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-left">
                        <thead className="bg-sand/40 border-b font-semibold text-maroon">
                          <tr>
                            <th className="p-2">पावती क्र.</th>
                            <th className="p-2">तारीख</th>
                            <th className="p-2">रक्कम</th>
                            <th className="p-2">माध्यम</th>
                            <th className="p-2 text-right">पावती</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {studentFees.payments.map((p: any, idx: number) => (
                            <tr key={idx} className="hover:bg-accent/40">
                              <td className="p-2 font-mono font-bold text-maroon">{p.receiptNo}</td>
                              <td className="p-2">
                                {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-IN") : "-"}
                              </td>
                              <td className="p-2 font-bold text-emerald-700">
                                ₹{Number(p.amount).toLocaleString("en-IN")}
                              </td>
                              <td className="p-2">{p.paymentMode}</td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => setPrintableReceipt(p)}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-maroon hover:underline"
                                >
                                  <Printer className="h-3 w-3" /> पावती पहा
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- ADMIN PRINTABLE RECEIPT MODAL ---------------- */}
      {printableReceipt && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl text-black">
            <button
              type="button"
              onClick={() => setPrintableReceipt(null)}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-black print:hidden"
            >
              <X className="h-5 w-5" />
            </button>

            <div ref={receiptRef} className="print:p-6">
              <div className="text-center border-b-2 border-amber-600 pb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                  ॥ श्री नर्मदा प्रसन्न ॥
                </p>
                <h2 className="text-xl font-bold text-amber-900 mt-1 font-serif">
                  मा नर्मदा आध्यात्मिक शिक्षण संस्था, आळंदी देवाची
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  वडगाव रोड, आळंदी देवाची, ता. खेड, जि. पुणे — ४१२१०५
                </p>
                <p className="text-[11px] text-gray-500">
                  अधिकृत फी पावती (Official Fee Receipt)
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center text-xs border-b border-gray-200 pb-2">
                <div>
                  <span className="text-gray-500">पावती क्र: </span>
                  <span className="font-mono font-bold text-amber-950">
                    {printableReceipt.receiptNo}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">दिनांक: </span>
                  <span className="font-bold">
                    {printableReceipt.paymentDate
                      ? new Date(printableReceipt.paymentDate).toLocaleDateString("en-IN")
                      : new Date().toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs grid grid-cols-2 gap-2 bg-amber-50/50 p-3 rounded-lg border border-amber-200/60">
                <div>
                  <span className="text-gray-500 block">विद्यार्थ्याचे नाव:</span>
                  <span className="font-bold text-sm text-gray-900">
                    {selectedStudent.personal?.fullName || selectedStudent.user?.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Student ID:</span>
                  <span className="font-mono font-bold text-amber-900">
                    {selectedStudent.studentId || "MNS-2026-TEMP"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">वर्ग / अभ्यासक्रम:</span>
                  <span className="font-medium text-gray-800">
                    {selectedStudent.academic?.currentClass || "गुरुकुल शिक्षण वर्ग"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">पेमेंट माध्यम:</span>
                  <span className="font-medium text-gray-800">
                    {printableReceipt.paymentMode} {printableReceipt.transactionRef ? `(${printableReceipt.transactionRef})` : ""}
                  </span>
                </div>
              </div>

              <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="p-2 text-left">तपशील</th>
                      <th className="p-2 text-right">रक्कम</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5">
                        गुरुकुल शैक्षणिक व निवास शुल्क
                        {printableReceipt.notes && (
                          <span className="block text-[11px] text-gray-500">
                            नोंद: {printableReceipt.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-sm">
                        ₹{Number(printableReceipt.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr className="bg-amber-50/70 border-t border-gray-300 font-bold">
                      <td className="p-2.5">एकूण जमा रक्कम</td>
                      <td className="p-2.5 text-right text-base text-amber-950">
                        ₹{Number(printableReceipt.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-between items-end text-xs pt-4 border-t border-dashed border-gray-300">
                <div className="text-center">
                  <div className="h-10 w-24 border-b border-gray-400 mb-1" />
                  <span className="text-gray-500">पालक / विद्यार्थी स्वाक्षरी</span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 mb-1">
                    {printableReceipt.receivedBy || "अधीक्षक / प्रशासक"}
                  </p>
                  <span className="text-gray-500">मा नर्मदा संस्था अधिकृत स्वाक्षरी व शिक्का</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4 print:hidden">
              <button
                type="button"
                onClick={() => setPrintableReceipt(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                बंद करा
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800"
              >
                <Printer className="h-4 w-4" />
                <span>प्रिंट / PDF डाऊनलोड करा</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
