import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";
import {
  Mail,
  Calendar,
  Image as ImageIcon,
  FileText,
  ArrowRight,
  Video,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "डॅशबोर्ड — प्रशासकीय पॅनेल" }],
  }),
  component: AdminDashboard,
});

interface Stats {
  messages: {
    total: number;
    unread: number;
  };
  events: number;
  gallery: number;
  videos: number;
  annualReports: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [feeStats, setFeeStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [res, studentsRes] = await Promise.all([
          api.getAdminStats(),
          api.adminGetStudents({}).catch(() => null),
        ]);

        if (res.success) {
          const statsData = res.stats || {
            messages: {
              total: res.data?.contactMessages?.total || 0,
              unread: res.data?.contactMessages?.new || 0,
            },
            events: res.data?.content?.events || 0,
            gallery: res.data?.content?.gallery || 0,
            videos: res.data?.content?.videos || 0,
            annualReports: res.data?.content?.annualReports || 0,
          };

          setStats(statsData);
        }

        if (studentsRes?.success && studentsRes.stats) {
          setFeeStats(studentsRes.stats);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <AdminLayout title="डॅशबोर्ड (Overview Dashboard)">
      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          आकडेवारी लोड होत आहे...
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Executive Fee Collection & Revenue Banner */}
          {feeStats && (
            <div className="rounded-2xl border border-primary/20 bg-linear-to-r from-sand/50 via-background to-card p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div>
                  <h3 className="font-bold text-base text-maroon flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-maroon" />
                    <span>संस्था शुल्क संकलन व महसूल विहंगावलोकन (Institute Fee Collection Overview)</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    एकूण {feeStats.total} विद्यार्थ्यांची नोंदणी • {feeStats.totalReceipts} अधिकृत पावत्या जारी
                  </p>
                </div>
                <Link
                  to="/admin/students"
                  className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-4 py-1.5 text-xs font-semibold text-white hover:bg-maroon/90 shadow-xs"
                >
                  <span>संपूर्ण फी व्यवस्थापन</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-4 grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-3">
                  <span className="text-[11px] font-semibold text-muted-foreground block">
                    एकूण कोर्स फी
                  </span>
                  <p className="text-xl font-bold text-foreground mt-0.5">
                    ₹{Number(feeStats.totalFees || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 p-3">
                  <span className="text-[11px] font-semibold text-emerald-800 block">
                    जमा झालेला महसूल
                  </span>
                  <p className="text-xl font-bold text-emerald-700 mt-0.5">
                    ₹{Number(feeStats.totalPaid || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-50/30 p-3">
                  <span className="text-[11px] font-semibold text-amber-800 block">
                    थकीत / प्रलंबित फी
                  </span>
                  <p className="text-xl font-bold text-amber-700 mt-0.5">
                    ₹{Number(feeStats.totalRemaining || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-50/30 p-3">
                  <span className="text-[11px] font-semibold text-blue-800 block">
                    संकलन दर (Rate)
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xl font-bold text-blue-900">
                      {feeStats.collectionPercentage || 0}%
                    </p>
                    <span className="text-[10px] text-blue-800 font-medium">
                      {feeStats.paidStudents} पूर्ण फी
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full bg-blue-200/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(feeStats.collectionPercentage || 0, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* =====================================================
                STUDENTS & FEES
            ===================================================== */}
            <Card className="flex flex-col justify-between p-5 transition-colors hover:border-primary/50">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    विद्यार्थी व फी (Students & Fees)
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-sm font-semibold text-foreground">
                    नोंदणी, पडताळणी व फी व्यवस्थापन
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    कागदपत्रे तपासा, आयडी द्या, फी हप्ते नोंदवा व पावत्या जारी करा
                  </p>
                </div>
              </div>

              <Link
                to="/admin/students"
                className="mt-4 flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
              >
                <span>विद्यार्थी पोर्टल उघडा</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Card>

          {/* =====================================================
              CONTACT MESSAGES
          ===================================================== */}
          <Card className="flex flex-col justify-between p-5 transition-colors hover:border-primary/50">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  संपर्क संदेश (Messages)
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {stats?.messages.total ?? 0}
                </span>

                {stats?.messages.unread ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                    {stats.messages.unread} नवीन
                  </span>
                ) : null}
              </div>
            </div>

            <Link
              to="/admin/messages"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
            >
              <span>संदेश पहा</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>

          {/* =====================================================
              EVENTS
          ===================================================== */}
          <Card className="flex flex-col justify-between p-5 transition-colors hover:border-primary/50">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  कार्यक्रम (Events)
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-3xl font-bold text-foreground">
                  {stats?.events ?? 0}
                </span>
              </div>
            </div>

            <Link
              to="/admin/events"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
            >
              <span>कार्यक्रम व्यवस्थापन</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>

          {/* =====================================================
              GALLERY
          ===================================================== */}
          <Card className="flex flex-col justify-between p-5 transition-colors hover:border-primary/50">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  फोटो गॅलरी (Gallery)
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ImageIcon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-3xl font-bold text-foreground">
                  {stats?.gallery ?? 0}
                </span>
              </div>
            </div>

            <Link
              to="/admin/gallery"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
            >
              <span>फोटो व्यवस्थापन</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>

          {/* =====================================================
              VIDEOS
          ===================================================== */}
          <Card className="flex flex-col justify-between p-5 transition-colors hover:border-primary/50">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  व्हिडिओ (Videos)
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Video className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-3xl font-bold text-foreground">
                  {stats?.videos ?? 0}
                </span>
              </div>
            </div>

            <Link
              to="/admin/videos"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
            >
              <span>व्हिडिओ व्यवस्थापन</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>

          {/* =====================================================
              ANNUAL REPORTS
          ===================================================== */}
          <Card className="flex flex-col justify-between p-5 transition-colors hover:border-primary/50">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  कार्य अहवाल (Reports)
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-3xl font-bold text-foreground">
                  {stats?.annualReports ?? 0}
                </span>
              </div>
            </div>

            <Link
              to="/admin/reports"
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
            >
              <span>अहवाल अपलोड करा</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>
        </div>
      </div>
      )}
    </AdminLayout>
  );
}