import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";
import {
  Mail,
  Phone,
  Calendar,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [{ title: "संपर्क संदेश — प्रशासकीय पॅनेल" }],
  }),
  component: AdminMessages,
});

interface ContactMsg {
  _id: string;
  name: string;
  phone?: string;
  mobile?: string;
  email?: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}

function AdminMessages() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAndMarkMessages() {
      setLoading(true);

      try {
        const res = await api.getContactMessages();

        if (res.success && Array.isArray(res.data)) {
          const loadedMessages = res.data as ContactMsg[];

          setMessages(loadedMessages);

          // Automatically mark unread messages as read
          const unreadMessages = loadedMessages.filter(
            (message) => !message.isRead
          );

          if (unreadMessages.length > 0) {
            await Promise.all(
              unreadMessages.map((message) =>
                api.markMessageAsRead(message._id)
              )
            );

            // Update local state
            setMessages((prev) =>
              prev.map((message) => ({
                ...message,
                isRead: true,
              }))
            );
          }
        }
      } catch (err) {
        console.error(
          "Failed to load contact messages",
          err
        );
      } finally {
        setLoading(false);
      }
    }

    loadAndMarkMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("हा संदेश हटवायचा आहे का?")) return;

    try {
      await api.deleteContactMessage(id);

      setMessages((prev) =>
        prev.filter((m) => m._id !== id)
      );
    } catch (err: any) {
      alert(
        err.message ||
          "संदेश हटवताना त्रुटी आली."
      );
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
        <div className="py-12 text-center text-sm text-muted-foreground">
          संदेश लोड होत आहेत...
        </div>
      ) : messages.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          सध्या कोणताही नवीन संदेश आला नाही.
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <Card
              key={m._id}
              className="p-5 transition-colors bg-card"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <span className="font-bold text-maroon text-base">
                    {m.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />

                    <span>
                      {m.createdAt
                        ? new Date(
                            m.createdAt
                          ).toLocaleString("mr-IN")
                        : "अलीकडेच"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="py-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {m.message}
              </div>

              {/* Contact Details + Delete */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-4">

                  {/* Mobile Number */}
                  {(m.phone || m.mobile) && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-primary" />

                      <a
                        href={`tel:${m.phone || m.mobile}`}
                        className="hover:underline"
                      >
                        {m.phone || m.mobile}
                      </a>
                    </div>
                  )}

                  {/* Email */}
                  {m.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-primary" />

                      <a
                        href={`mailto:${m.email}`}
                        className="hover:underline"
                      >
                        {m.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Delete */}
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleDelete(m._id)
                    }
                    className="flex items-center gap-1 text-red-600 hover:underline"
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