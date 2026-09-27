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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getAdminStats();

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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {/* Messages */}
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

          {/* Events */}
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

          {/* Gallery */}
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

          {/* Videos */}
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

          {/* Reports */}
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
      )}
    </AdminLayout>
  );
}