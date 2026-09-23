import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";
import { Mail, Phone, Calendar, Trash2, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [{ title: "संपर्क संदेश — प्रशासकीय पॅनेल" }],
  }),
  component: AdminMessages,
});

interface ContactMsg {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}

function AdminMessages() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.getContactMessages();
      if (res.success && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Failed to load contact messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    try {
      await api.markMessageAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: !currentReadStatus } : m))
      );
    } catch (err: any) {
      alert(err.message || "स्टेटस बदलताना त्रुटी आली.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("हा संदेश हटवायचा आहे का?")) return;
    try {
      await api.deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      alert(err.message || "संदेश हटवताना त्रुटी आली.");
    }
  };

  return (
    <AdminLayout title="संपर्क संदेश इनबॉक्स (Contact Messages)">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          संकेतस्थळावरून नागरिकांनी पाठवलेले संपर्क संदेश व चौकशी.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">संदेश लोड होत आहेत...</div>
      ) : messages.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          सध्या कोणताही नवीन संदेश आला नाही.
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <Card
              key={m._id}
              className={`p-5 transition-colors ${
                !m.isRead ? "border-l-4 border-l-primary bg-amber-50/30" : "bg-card"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-maroon text-base">{m.name}</span>
                  {!m.isRead ? (
                    <span className="rounded-full bg-primary/20 text-primary text-[10px] font-semibold px-2 py-0.5">
                      नवीन (Unread)
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleString("mr-IN")
                        : "अलीकडेच"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {m.message}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1 text-foreground font-medium">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <a href={`tel:${m.phone}`} className="hover:underline">
                      {m.phone}
                    </a>
                  </div>
                  {m.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <a href={`mailto:${m.email}`} className="hover:underline">
                        {m.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(m._id, !!m.isRead)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    {m.isRead ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>वाचलेले (Mark Unread)</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-amber-600" />
                        <span>वाचले म्हणून चिन्हांकित करा</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="flex items-center gap-1 text-red-600 hover:underline ml-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>हटवा</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
