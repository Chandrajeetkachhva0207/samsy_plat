import React, { useEffect, useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  History,
  IndianRupee,
  Percent,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Trash2,
  AlertTriangle,
  User,
  Users,
  Wallet,
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
  const [coursesList, setCoursesList] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    incomplete: 0,
    totalFees: 0,
    totalPaid: 0,
    totalRemaining: 0,
    collectionPercentage: 0,
    totalReceipts: 0,
    paidStudents: 0,
    partialStudents: 0,
    pendingStudents: 0,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [onlyPendingFilter, setOnlyPendingFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  // Selected student for drawer/modal
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentFees, setStudentFees] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<"verify" | "fees" | "payment" | "receipts">("verify");
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
  const [showDeleteFeeConfirm, setShowDeleteFeeConfirm] = useState(false);
  const [deleteFeeReason, setDeleteFeeReason] = useState("");

  // Record payment form states
  const [installmentName, setInstallmentName] = useState("हप्ता १ (1st Installment)");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [transactionRef, setTransactionRef] = useState("");
  const [receivedBy, setReceivedBy] = useState("Office Admin");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Printable receipt state
  const [printableReceipt, setPrintableReceipt] = useState<any | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Fetch students with all filters
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetStudents({
        search,
        status: statusFilter,
        course: courseFilter !== "ALL" ? courseFilter : undefined,
        paymentStatus: paymentStatusFilter !== "ALL" ? paymentStatusFilter : undefined,
        onlyPending: onlyPendingFilter ? true : undefined,
      });

      if (res.success) {
        setStudents(res.students || []);
        if (res.coursesList) setCoursesList(res.coursesList);
        if (res.stats) {
          setStats({
            total: res.stats.total || 0,
            pending: res.stats.pending || 0,
            verified: res.stats.verified || 0,
            incomplete: res.stats.incomplete || 0,
            totalFees: res.stats.totalFees || 0,
            totalPaid: res.stats.totalPaid || 0,
            totalRemaining: res.stats.totalRemaining || 0,
            collectionPercentage: res.stats.collectionPercentage || 0,
            totalReceipts: res.stats.totalReceipts || 0,
            paidStudents: res.stats.paidStudents || 0,
            partialStudents: res.stats.partialStudents || 0,
            pendingStudents: res.stats.pendingStudents || 0,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [statusFilter, courseFilter, paymentStatusFilter, onlyPendingFilter]);

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

          // Pre-fill installment name based on past payment count
          const nextCount = (res.fees.payments?.length || 0) + 1;
          setInstallmentName(`हप्ता ${nextCount} (${nextCount}${nextCount === 1 ? "st" : nextCount === 2 ? "nd" : nextCount === 3 ? "rd" : "th"} Installment)`);
          // Default payment amount to remaining fee if small or positive
          if (res.fees.remainingFees > 0) {
            setPaymentAmount(Math.min(res.fees.remainingFees, 5000));
          } else {
            setPaymentAmount(0);
          }
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

  // Delete / Reset Fee Structure
  const handleDeleteFees = async () => {
    if (!selectedStudent) return;
    setModalLoading(true);
    setModalMessage(null);

    try {
      const res = await api.adminDeleteStudentFees(
        selectedStudent._id,
        deleteFeeReason || "फी रचना ॲडमिनद्वारे डिलीट / रीसेट केली"
      );

      if (res.success) {
        setModalMessage({
          type: "success",
          text: "विद्यार्थ्याची फी रचना यशस्वीरीत्या डिलीट / रीसेट केली!",
        });
        setStudentFees(res.fees);
        setFeeTotal(0);
        setFeeDueDate("");
        setFeeNotes("");
        setShowDeleteFeeConfirm(false);
        setDeleteFeeReason("");
        fetchStudents();
      }
    } catch (err: any) {
      setModalMessage({
        type: "error",
        text: err?.message || "शुल्क रचना डिलीट करताना त्रुटी आली",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Specific Payment Installment
  const handleDeletePayment = async (paymentId: string) => {
    if (!selectedStudent || !paymentId) return;
    if (
      !window.confirm(
        "तुम्हाला खात्री आहे का? ही भरलेली पावती कायमची डिलीट केली जाईल आणि हिशेब पुन्हा मोजला जाईल."
      )
    ) {
      return;
    }

    setModalLoading(true);
    setModalMessage(null);

    try {
      const res = await api.adminDeleteFeePayment(selectedStudent._id, paymentId);
      if (res.success) {
        setModalMessage({
          type: "success",
          text: res.message || "पेमेंट पावती यशस्वीरीत्या डिलीट केली!",
        });
        setStudentFees(res.fees);
        fetchStudents();
      }
    } catch (err: any) {
      setModalMessage({
        type: "error",
        text: err?.message || "पेमेंट डिलीट करताना त्रुटी आली",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Delete Entire Student Record
  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!studentId) return;
    const isConfirmed = window.confirm(
      `तुम्हाला खात्री आहे का? विद्यार्थी "${studentName}" आणि त्याचे संपूर्ण फी व शैक्षणिक रेकॉर्ड कायमचे डिलीट केले जाईल.`
    );
    if (!isConfirmed) return;

    try {
      const res = await api.adminDeleteStudent(studentId);
      if (res.success) {
        if (selectedStudent && selectedStudent._id === studentId) {
          setSelectedStudent(null);
        }
        fetchStudents();
      } else {
        alert(res.message || "विद्यार्थी डिलीट करताना अडचण आली");
      }
    } catch (err: any) {
      alert(err?.message || "विद्यार्थी डिलीट करताना अडचण आली");
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
        installmentName,
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
        // Refresh student in modal and table
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
    <AdminLayout title="विद्यार्थी व फी व्यवस्थापन (Student & Fee Management)">
      <div className="grid gap-6">

        {/* =========================================================
            SECTION 1: FINANCIAL OVERVIEW KPI CARDS
        ========================================================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Course Fees */}
          <Card className="p-4 bg-card shadow-xs border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                एकूण अभ्यासक्रम फी (Total Course Fees)
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-maroon">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              ₹{Number(stats.totalFees || 0).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              एकूण {stats.total} विद्यार्थ्यांची नोंदणी
            </p>
          </Card>

          {/* Total Collected Revenue */}
          <Card className="p-4 bg-card shadow-xs border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">
                एकूण जमा महसूल (Collected Revenue)
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              ₹{Number(stats.totalPaid || 0).toLocaleString("en-IN")}
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
              <span>{stats.totalReceipts} पावत्या जारी</span>
              <span>{stats.paidStudents} पूर्ण फी जमा</span>
            </div>
          </Card>

          {/* Total Pending Balance */}
          <Card className="p-4 bg-card shadow-xs border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800">
                एकूण थकीत / प्रलंबित फी (Pending Fees)
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-700">
              ₹{Number(stats.totalRemaining || 0).toLocaleString("en-IN")}
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px] text-amber-800">
              <span>{stats.partialStudents} अंशतः जमा</span>
              <span>{stats.pendingStudents} पूर्ण थकीत</span>
            </div>
          </Card>

          {/* Collection Percentage & Rate */}
          <Card className="p-4 bg-card shadow-xs border-blue-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-800">
                वसूली प्रमाण (Collection Rate)
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Percent className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-900">
              {stats.collectionPercentage}%
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(stats.collectionPercentage, 100)}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Quick Status Pill Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-semibold">त्वरित दृश्य:</span>
          <button
            onClick={() => {
              setPaymentStatusFilter("ALL");
              setOnlyPendingFilter(false);
              setStatusFilter("ALL");
            }}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              paymentStatusFilter === "ALL" && !onlyPendingFilter && statusFilter === "ALL"
                ? "bg-maroon text-white"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            सर्व विद्यार्थी ({stats.total})
          </button>
          <button
            onClick={() => {
              setPaymentStatusFilter("Paid");
              setOnlyPendingFilter(false);
            }}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              paymentStatusFilter === "Paid"
                ? "bg-emerald-700 text-white"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            पूर्ण फी जमा ({stats.paidStudents})
          </button>
          <button
            onClick={() => {
              setPaymentStatusFilter("Partially Paid");
              setOnlyPendingFilter(false);
            }}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              paymentStatusFilter === "Partially Paid"
                ? "bg-amber-700 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            अंशतः जमा ({stats.partialStudents})
          </button>
          <button
            onClick={() => {
              setPaymentStatusFilter("Pending");
              setOnlyPendingFilter(false);
            }}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              paymentStatusFilter === "Pending"
                ? "bg-red-700 text-white"
                : "bg-red-50 text-red-800 hover:bg-red-100 border border-red-200"
            }`}
          >
            थकीत फी ({stats.pendingStudents})
          </button>
          <button
            onClick={() => {
              setStatusFilter("Pending Verification");
            }}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              statusFilter === "Pending Verification"
                ? "bg-orange-700 text-white"
                : "bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200"
            }`}
          >
            प्रवेश प्रलंबित ({stats.pending})
          </button>
        </div>

        {/* =========================================================
            SECTION 2: SEARCH & ADVANCED FILTER TOOLBAR
        ========================================================= */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between rounded-xl border border-border bg-card p-3 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="नाव, ID किंवा मोबाईल..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-1.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/40"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/30"
              title="अभ्यासक्रम फिल्टर करा"
            >
              <option value="ALL">सर्व अभ्यासक्रम (All Courses)</option>
              {coursesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/30"
              title="फी स्थिती फिल्टर करा"
            >
              <option value="ALL">सर्व फी स्थिती (All Fee Status)</option>
              <option value="Paid">पूर्ण जमा (Paid)</option>
              <option value="Partially Paid">अंशतः जमा (Partially Paid)</option>
              <option value="Pending">थकीत (Pending)</option>
              <option value="Unassigned">फी निश्चित नाही (Unassigned)</option>
            </select>

            {/* Admission Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary/30"
              title="प्रवेश स्थिती फिल्टर करा"
            >
              <option value="ALL">सर्व प्रवेश स्थिती</option>
              <option value="Pending Verification">पडताळणी प्रलंबित</option>
              <option value="Verified">अधिकृत (Verified)</option>
              <option value="Incomplete">अपूर्ण प्रोफाइल</option>
            </select>

            {/* Only Pending Balance Toggle */}
            <label className="flex items-center gap-1.5 text-xs font-medium text-foreground cursor-pointer rounded-lg border border-border bg-sand/30 px-2.5 py-1.5 hover:bg-sand/60">
              <input
                type="checkbox"
                checked={onlyPendingFilter}
                onChange={(e) => setOnlyPendingFilter(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-maroon"
              />
              <span>केवळ थकीत फी</span>
            </label>

            {/* Refresh */}
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

        {/* =========================================================
            SECTION 3: STUDENTS & FEE RECORDS TABLE
        ========================================================= */}
        <Card className="overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              विद्यार्थी व फी यादी लोड होत आहे...
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              कोणताही विद्यार्थी सापडला नाही. कृपया फिल्टर बदला किंवा सर्च साफ करा.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-sand/40 font-semibold text-maroon">
                    <th className="py-3 px-4">विद्यार्थी (Student)</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">अभ्यासक्रम / वर्ग</th>
                    <th className="py-3 px-4">प्रवेश स्थिती</th>
                    <th className="py-3 px-4">फी प्रगती व स्थिती</th>
                    <th className="py-3 px-4">शुल्क तपशील (Fees ₹)</th>
                    <th className="py-3 px-4 text-right">कृती (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {students.map((s) => {
                    const feeStat = s.fees?.status || (s.fees?.remainingFees === 0 && s.fees?.totalFees > 0 ? "Paid" : s.fees?.paidFees > 0 ? "Partially Paid" : s.fees?.totalFees > 0 ? "Pending" : "Unassigned");
                    const feePct = s.fees?.paymentPercentage ?? (s.fees?.totalFees > 0 ? Math.round((s.fees.paidFees / s.fees.totalFees) * 100) : 0);

                    return (
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

                        {/* Admission Status */}
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
                          {s.status === "Rejected" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 font-semibold text-red-700">
                              <X className="h-3 w-3" />
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Fee Status & Progress */}
                        <td className="py-3 px-4 min-w-[130px]">
                          <div className="flex items-center gap-1.5 mb-1">
                            {feeStat === "Paid" && (
                              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold text-[10px]">
                                Paid (पूर्ण)
                              </span>
                            )}
                            {feeStat === "Partially Paid" && (
                              <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 font-bold text-[10px]">
                                Partially Paid
                              </span>
                            )}
                            {feeStat === "Pending" && (
                              <span className="rounded-full bg-red-100 text-red-800 px-2 py-0.5 font-bold text-[10px]">
                                Pending (थकीत)
                              </span>
                            )}
                            {feeStat === "Unassigned" && (
                              <span className="rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px]">
                                फी निश्चित नाही
                              </span>
                            )}
                            <span className="text-[11px] font-semibold text-muted-foreground ml-auto">
                              {feePct}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                feeStat === "Paid"
                                  ? "bg-emerald-600"
                                  : feeStat === "Partially Paid"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(feePct, 100)}%` }}
                            />
                          </div>
                        </td>

                        {/* Fee Amounts */}
                        <td className="py-3 px-4">
                          <p className="font-semibold text-foreground">
                            ₹{Number(s.fees?.paidFees || 0).toLocaleString("en-IN")}{" "}
                            <span className="text-muted-foreground font-normal">
                              / ₹{Number(s.fees?.totalFees || 0).toLocaleString("en-IN")}
                            </span>
                          </p>
                          <p className="text-[11px] text-amber-800 font-medium">
                            बाकी: ₹{Number(s.fees?.remainingFees || 0).toLocaleString("en-IN")}
                          </p>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openStudentModal(s)}
                              className="rounded-lg bg-primary/10 hover:bg-primary/20 text-maroon px-3 py-1.5 text-xs font-semibold transition-colors"
                            >
                              व्यवस्थापन करा
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteStudent(
                                  s._id,
                                  s.personal?.fullName || s.user?.name || "विद्यार्थी"
                                )
                              }
                              title="विद्यार्थी डिलीट करा (Delete Student)"
                              className="inline-flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 p-1.5 text-xs font-semibold transition-colors border border-red-200"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* =========================================================
          SECTION 4: COMPREHENSIVE STUDENT MANAGEMENT MODAL
      ========================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-card p-5 sm:p-6 shadow-2xl border border-border my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Close */}
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-border/70 pb-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon/10 text-maroon font-bold text-lg">
                {(selectedStudent.personal?.fullName || "S")[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-maroon">
                    {selectedStudent.personal?.fullName || selectedStudent.user?.name}
                  </h2>
                  {selectedStudent.studentId && (
                    <span className="font-mono text-xs px-2 py-0.5 bg-maroon/10 text-maroon font-bold rounded border border-maroon/20">
                      ID: {selectedStudent.studentId}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  मोबाईल: {selectedStudent.personal?.mobile || selectedStudent.user?.mobile || "-"} •
                  ई-मेल: {selectedStudent.personal?.email || selectedStudent.user?.email || "-"} •
                  वर्ग: {selectedStudent.academic?.currentClass || "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDeleteStudent(
                    selectedStudent._id,
                    selectedStudent.personal?.fullName || selectedStudent.user?.name || "विद्यार्थी"
                  )
                }
                title="विद्यार्थी खाते डिलीट करा"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>विद्यार्थी डिलीट</span>
              </button>
            </div>

            {/* Modal Tabs: 4 tabs */}
            <div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-sand/60 p-1 border border-border/60">
              <button
                type="button"
                onClick={() => setModalTab("verify")}
                className={`flex-1 min-w-[120px] rounded-md py-2 text-xs font-semibold transition-all ${
                  modalTab === "verify"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🔍 माहिती व पडताळणी
              </button>

              <button
                type="button"
                onClick={() => setModalTab("fees")}
                className={`flex-1 min-w-[120px] rounded-md py-2 text-xs font-semibold transition-all ${
                  modalTab === "fees"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ⚙️ फी रचना व ऑडिट लॉग
              </button>

              <button
                type="button"
                onClick={() => setModalTab("payment")}
                className={`flex-1 min-w-[120px] rounded-md py-2 text-xs font-semibold transition-all ${
                  modalTab === "payment"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                💵 हप्ता / पेमेंट नोंदणी
              </button>

              <button
                type="button"
                onClick={() => setModalTab("receipts")}
                className={`flex-1 min-w-[120px] rounded-md py-2 text-xs font-semibold transition-all ${
                  modalTab === "receipts"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🧾 सर्व पावत्या व लेजर ({studentFees?.payments?.length || 0})
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

            {/* ---------------- TAB 1: VERIFICATION & PROFILE ---------------- */}
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
                    <span>विद्यार्थ्याने अपलोड केलेली सर्व ८ कागदपत्रे</span>
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
                                <Eye className="h-3 w-3" /> पहा
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

                {/* Details Breakdown across all sections */}
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

            {/* ---------------- TAB 2: FEE STRUCTURE & AUDIT LOG ---------------- */}
            {modalTab === "fees" && (
              <div className="grid gap-4 text-xs">
                {/* Financial Summary Cards */}
                {studentFees && (
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-sand/30 border border-primary/20 text-center">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">एकूण कोर्स फी</span>
                      <span className="font-bold text-base text-foreground">
                        ₹{Number(studentFees.totalFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">एकूण जमा रक्कम</span>
                      <span className="font-bold text-base text-emerald-700">
                        ₹{Number(studentFees.paidFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">शिल्लक बाकी (Pending)</span>
                      <span className="font-bold text-base text-amber-800">
                        ₹{Number(studentFees.remainingFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                <div className="rounded-xl border border-border p-4 bg-background grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      एकूण अभ्यासक्रम व निवास शुल्क (Total Course Fees ₹) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={feeTotal}
                      onChange={(e) => setFeeTotal(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/40"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      या रकमेत बदल केल्यास त्याचा ऑडिट लॉग सुरक्षित ठेवला जातो.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">शैक्षणिक वर्ष</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      पुढील हप्ता देय तारीख (Next Due Date)
                    </label>
                    <input
                      type="date"
                      value={feeDueDate}
                      onChange={(e) => setFeeDueDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      हप्ते / फी शेड्युल शेरा / बदल करण्याचे कारण
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. सवलत दिली किंवा २ समान हप्त्यांमध्ये भरणे"
                      value={feeNotes}
                      onChange={(e) => setFeeNotes(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Confirmation Box for Deleting Fee Structure */}
                {showDeleteFeeConfirm && (
                  <div className="rounded-xl border border-red-300 bg-red-50/80 p-4 animate-in fade-in">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-red-100 p-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-900 text-sm">
                          विद्यार्थ्याची शुल्क रचना डिलीट / रीसेट करायची आहे का?
                        </h4>
                        <p className="mt-1 text-xs text-red-700">
                          यामुळे या विद्यार्थ्याची एकूण देय फी ₹० होईल आणि पुढील देय तारीख काढून टाकली जाईल. हा बदल ऑडिट लॉगमध्ये नोंदवला जाईल.
                        </p>

                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-red-900 mb-1">
                            डिलीट करण्याचे कारण / शेरा (Reason):
                          </label>
                          <input
                            type="text"
                            placeholder="उदा. चुकीची रक्कम नोंदवली होती / शिष्यवृत्ती / प्रवेश रद्द"
                            value={deleteFeeReason}
                            onChange={(e) => setDeleteFeeReason(e.target.value)}
                            className="w-full rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs text-black focus:outline-hidden focus:ring-2 focus:ring-red-400"
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowDeleteFeeConfirm(false);
                              setDeleteFeeReason("");
                            }}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                          >
                            रद्द करा (Cancel)
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteFees}
                            disabled={modalLoading}
                            className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{modalLoading ? "डिलीट होत आहे..." : "होय, फी रचना डिलीट करा (Confirm Delete)"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
                  <div>
                    {Number(studentFees?.totalFees || 0) > 0 && !showDeleteFeeConfirm && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteFeeConfirm(true)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50/60 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        <span>शुल्क रचना डिलीट करा (Delete Fee Structure)</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
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

                {/* Audit Trail Log */}
                <div className="mt-2 rounded-xl border border-border bg-sand/20 p-4">
                  <h4 className="font-bold text-maroon mb-2 flex items-center gap-1.5">
                    <History className="h-4 w-4" />
                    <span>शुल्क बदल ऑडिट इतिहास (Audit Trail)</span>
                  </h4>
                  {(!studentFees?.feeHistory || studentFees.feeHistory.length === 0) ? (
                    <p className="text-muted-foreground text-xs italic">
                      अद्याप कोणताही शुल्क बदल झालेला नाही. (No past modifications)
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-border bg-background">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-sand/40 border-b font-semibold text-maroon">
                          <tr>
                            <th className="p-2">तारीख व वेळ</th>
                            <th className="p-2">बदलकर्ता (By)</th>
                            <th className="p-2">मागील शुल्क</th>
                            <th className="p-2">नवीन शुल्क</th>
                            <th className="p-2">कारण / शेरा</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {studentFees.feeHistory.map((h: any, idx: number) => (
                            <tr key={idx} className="hover:bg-accent/40">
                              <td className="p-2 font-mono text-[11px]">
                                {new Date(h.changedAt).toLocaleString("en-IN")}
                              </td>
                              <td className="p-2 font-medium">{h.changedBy}</td>
                              <td className="p-2 text-muted-foreground">
                                ₹{Number(h.oldTotal).toLocaleString("en-IN")}
                              </td>
                              <td className="p-2 font-bold text-emerald-700">
                                ₹{Number(h.newTotal).toLocaleString("en-IN")}
                              </td>
                              <td className="p-2 text-muted-foreground italic">
                                {h.reason || "-"}
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

            {/* ---------------- TAB 3: RECORD PAYMENT ---------------- */}
            {modalTab === "payment" && (
              <div className="grid gap-5 text-xs">
                {/* Summary Banner */}
                {studentFees && (
                  <div className="rounded-xl bg-sand/30 border border-primary/20 p-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">एकूण कोर्स फी</span>
                      <span className="font-bold text-sm">
                        ₹{Number(studentFees.totalFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">आतापर्यंत जमा</span>
                      <span className="font-bold text-sm text-emerald-700">
                        ₹{Number(studentFees.paidFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">सध्याची शिल्लक बाकी</span>
                      <span className="font-bold text-sm text-amber-800">
                        ₹{Number(studentFees.remainingFees || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">हप्ता संख्या</span>
                      <span className="font-bold text-sm text-blue-700">
                        {(studentFees.payments?.length || 0)} भरलेले
                      </span>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleRecordPayment}
                  className="rounded-xl border border-primary/30 bg-background p-4 grid gap-3 sm:grid-cols-2"
                >
                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      हप्ता तपशील (Installment Details) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. हप्ता १, हप्ता २, अंतिम हप्ता, पूर्ण फी"
                      value={installmentName}
                      onChange={(e) => setInstallmentName(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

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
                      पेमेंट माध्यम (Payment Method) *
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="Cash">रोख (Cash)</option>
                      <option value="UPI">UPI / GPay / PhonePe</option>
                      <option value="Bank Transfer">बँक ट्रान्सफर (NEFT/RTGS/IMPS)</option>
                      <option value="Cheque">धनादेश (Cheque)</option>
                      <option value="Online">ऑनलाईन पेमेंट (Razorpay / Gateway)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      पेमेंट दिनांक (Payment Date) *
                    </label>
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
                      व्यवहार आयडी / संदर्भ क्रमांक (Transaction ID / Ref)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. UPI-2026-987654 / CHQ-10482"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-foreground">
                      स्वीकारकर्ता अधिकारी (Received By)
                    </label>
                    <input
                      type="text"
                      value={receivedBy}
                      onChange={(e) => setReceivedBy(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-foreground">पावती शेरा / टीप</label>
                    <input
                      type="text"
                      placeholder="उदा. प्रथम हप्ता यशस्वीरित्या जमा झाला"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Receipt className="h-4 w-4" />
                      <span>{modalLoading ? "नोंदणी होत आहे..." : "पेमेंट जमा करा व अधिकृत पावती बनवा"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ---------------- TAB 4: RECEIPTS & PAYMENT HISTORY ---------------- */}
            {modalTab === "receipts" && (
              <div className="grid gap-4 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-maroon flex items-center gap-1.5">
                    <Receipt className="h-4 w-4" />
                    <span>विद्यार्थी पेमेंट लेजर व अधिकृत पावत्या</span>
                  </h4>
                  <span className="text-muted-foreground text-[11px]">
                    एकूण {studentFees?.payments?.length || 0} हप्ते नोंदवले
                  </span>
                </div>

                {(!studentFees?.payments || studentFees.payments.length === 0) ? (
                  <div className="py-8 text-center text-muted-foreground italic">
                    अद्याप एकही पेमेंट नोंद झालेले नाही. 'पेमेंट नोंदणी' टॅबमधून पेमेंट जमा करा.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left">
                      <thead className="bg-sand/40 border-b font-semibold text-maroon">
                        <tr>
                          <th className="p-2.5">पावती क्र.</th>
                          <th className="p-2.5">हप्ता</th>
                          <th className="p-2.5">तारीख</th>
                          <th className="p-2.5">रक्कम (₹)</th>
                          <th className="p-2.5">माध्यम / Ref</th>
                          <th className="p-2.5">स्वीकारकर्ता</th>
                          <th className="p-2.5 text-right">कृती</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {studentFees.payments.map((p: any, idx: number) => (
                          <tr key={idx} className="hover:bg-accent/40">
                            <td className="p-2.5 font-mono font-bold text-maroon">
                              {p.receiptNo}
                            </td>
                            <td className="p-2.5 font-medium">
                              {p.installmentName || `हप्ता ${idx + 1}`}
                            </td>
                            <td className="p-2.5">
                              {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-IN") : "-"}
                            </td>
                            <td className="p-2.5 font-bold text-emerald-700">
                              ₹{Number(p.amount).toLocaleString("en-IN")}
                            </td>
                            <td className="p-2.5">
                              <span className="rounded bg-sand px-1.5 py-0.5 text-[10px]">
                                {p.paymentMode}
                              </span>
                              {p.transactionRef && (
                                <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                                  {p.transactionRef}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-muted-foreground">
                              {p.receivedBy || "Admin"}
                            </td>
                            <td className="p-2.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPrintableReceipt(p)}
                                  className="inline-flex items-center gap-1 rounded bg-maroon/10 hover:bg-maroon hover:text-white text-maroon px-2.5 py-1 text-[11px] font-semibold transition-colors"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                  <span>पावती प्रिंट</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePayment(p._id || p.receiptNo)}
                                  title="पेमेंट नोंद डिलीट करा"
                                  className="inline-flex items-center justify-center rounded bg-red-50 hover:bg-red-600 hover:text-white text-red-600 p-1.5 transition-colors border border-red-200"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 5: OFFICIAL PRINTABLE RECEIPT MODAL
      ========================================================= */}
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
              {/* Trust & Header */}
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
                <p className="text-[11px] text-gray-500 font-medium">
                  संस्था नोंदणी क्र: १५ ९८४ बुलढाणा • अधिकृत फी पावती (Official Fee Receipt)
                </p>
              </div>

              {/* Receipt Details Header */}
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

              {/* Student Info Box */}
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
                  <span className="text-gray-500 block">अभ्यासक्रम / वर्ग:</span>
                  <span className="font-medium text-gray-800">
                    {selectedStudent.academic?.currentClass || selectedStudent.academic?.course || "गुरुकुल शिक्षण"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">हप्ता तपशील:</span>
                  <span className="font-semibold text-amber-900">
                    {printableReceipt.installmentName || "फी हप्ता"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">पेमेंट माध्यम:</span>
                  <span className="font-medium text-gray-800">
                    {printableReceipt.paymentMode}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Transaction / Ref ID:</span>
                  <span className="font-mono text-gray-800">
                    {printableReceipt.transactionRef || "N/A"}
                  </span>
                </div>
              </div>

              {/* Particulars Table */}
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
                        गुरुकुल शैक्षणिक व निवास शुल्क
                        {printableReceipt.installmentName && (
                          <span className="block font-medium text-amber-900">
                            [{printableReceipt.installmentName}]
                          </span>
                        )}
                        {printableReceipt.notes && (
                          <span className="block text-[11px] text-gray-500">
                            शेरा: {printableReceipt.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-sm">
                        ₹{Number(printableReceipt.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr className="bg-amber-50/70 border-t border-gray-300 font-bold">
                      <td className="p-2.5">एकूण जमा रक्कम (Total Received)</td>
                      <td className="p-2.5 text-right text-base text-amber-950">
                        ₹{Number(printableReceipt.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="mt-8 flex justify-between items-end text-xs pt-4 border-t border-dashed border-gray-300">
                <div className="text-center">
                  <div className="h-10 w-24 border-b border-gray-400 mb-1" />
                  <span className="text-gray-500">विद्यार्थी / पालक स्वाक्षरी</span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 mb-1">
                    {printableReceipt.receivedBy || "अधीक्षक / प्रशासक"}
                  </p>
                  <span className="text-gray-500">मा नर्मदा संस्था अधिकृत स्वाक्षरी व शिक्का</span>
                </div>
              </div>
            </div>

            {/* Actions */}
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
