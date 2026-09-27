import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";
import { HeartHandshake, Phone, Mail, FileText, CheckCircle2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/donations")({
  head: () => ({
    meta: [{ title: "देणगी यादी (Donations) — प्रशासकीय पॅनेल" }],
  }),
  component: AdminDonations,
});

interface DonationItem {
  _id: string;
  donorName: string;
  email: string;
  phone: string;
  panNumber?: string;
  profession?: string;
  amount: number;
  currency: string;
  donationType?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: "created" | "captured" | "failed";
  receiptNumber?: string;
  notes?: string;
  createdAt: string;
}

function AdminDonations() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const res = await api.getDonationsList();
      if (res.success && Array.isArray(res.data)) {
        setDonations(res.data);
      }
    } catch (err) {
      console.error("Failed to load donations list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const totalCaptured = donations
    .filter((d) => d.status === "captured")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <AdminLayout title="देणगी व्यवस्थापन (Donations Management)">
      <div className="space-y-6">
        {/* Summary Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-l-4 border-l-primary bg-card p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              एकूण गोळा झालेली देणगी (Total Captured)
            </span>
            <div className="mt-2 font-display text-2xl font-bold text-primary">
              ₹{totalCaptured.toLocaleString("en-IN")}
            </div>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-card p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              यशस्वी देणग्या (Successful Count)
            </span>
            <div className="mt-2 font-display text-2xl font-bold text-green-600">
              {donations.filter((d) => d.status === "captured").length}
            </div>
          </Card>

          <Card className="border-l-4 border-l-amber-500 bg-card p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              सर्व व्यवहार नोंदी (Total Records)
            </span>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-display text-2xl font-bold text-foreground">
                {donations.length}
              </span>
              <button
                type="button"
                onClick={loadDonations}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-sand"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                <span>रिफ्रेश</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Donations List / Table */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-maroon">
                प्राप्त देणगी नोंदी (Online Donations)
              </h2>
            </div>
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-maroon">
              {donations.length} व्यवहार
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : donations.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              अद्याप कोणतीही ऑनलाइन देणगी नोंद उपलब्ध नाही.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-sand/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">पावती क्र. / तारीख</th>
                    <th className="px-4 py-3">देणगीदार</th>
                    <th className="px-4 py-3">उद्देश</th>
                    <th className="px-4 py-3">रक्कम</th>
                    <th className="px-4 py-3">स्टेटस</th>
                    <th className="px-4 py-3">पेमेंट आयडी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {donations.map((d) => (
                    <tr key={d._id} className="hover:bg-sand/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono font-semibold text-maroon">
                          {d.receiptNumber || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(d.createdAt).toLocaleString("mr-IN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{d.donorName}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Phone className="h-3 w-3" />
                            {d.phone}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Mail className="h-3 w-3" />
                            {d.email}
                          </span>
                        </div>
                        {d.panNumber && (
                          <div className="mt-0.5 text-xs font-mono text-primary">
                            PAN: {d.panNumber}
                          </div>
                        )}
                        {d.profession && (
                          <div className="mt-0.5 inline-block rounded-xs bg-sand px-1.5 py-0.5 text-[11px] font-medium text-maroon">
                            व्यवसाय: {d.profession}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-foreground">
                          {d.donationType || "General"}
                        </span>
                        {d.notes && (
                          <div className="mt-0.5 text-xs italic text-muted-foreground">
                            "{d.notes}"
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        ₹{d.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        {d.status === "captured" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            <CheckCircle2 className="h-3 w-3" />
                            यशस्वी
                          </span>
                        ) : d.status === "failed" ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            अयशस्वी
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            प्रलंबित
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {d.razorpayPaymentId || d.razorpayOrderId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
