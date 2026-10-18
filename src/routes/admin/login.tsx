import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Container, Card } from "@/components/ui";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "प्रशासकीय लॉगिन — मा नर्मदा आध्यात्मिक शिक्षण संस्था" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("maanarmadasansthan@gmail.com");
  const [password, setPassword] = useState("MaaNarmada@2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (admin) {
      navigate({ to: "/admin" });
    }
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      if (res.success && res.token && res.admin) {
        login(res.token, res.admin);
        navigate({ to: "/admin" });
      } else {
        setError(res.message || "लॉगिन अयशस्वी. कृपया पुन्हा प्रयत्न करा.");
      }
    } catch (err: any) {
      setError(err.message || "लॉगिन करता आला नाही. ईमेल किंवा संकेतशब्द तपासा.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 bg-sand/20">
      <Container className="max-w-md">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-maroon">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>मुख्यपृष्ठावर परत जा</span>
          </Link>
        </div>

        <Card className="p-6 sm:p-8 shadow-md">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-maroon/10 text-maroon">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-maroon">प्रशासकीय लॉगिन (Admin Login)</h1>
            <p className="mt-1 text-xs text-muted-foreground">मा नर्मदा आध्यात्मिक शिक्षण संस्था</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                ईमेल (Email Address)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maanarmadasansthan@gmail.com"
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                संकेतशब्द (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "प्रक्रिया सुरू आहे..." : "लॉगिन करा (Sign In)"}
            </button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground space-y-1">
            <p>
              डिफॉल्ट लॉगिन: <code className="bg-sand px-1.5 py-0.5 rounded text-maroon font-semibold">maanarmadasansthan@gmail.com</code>
            </p>
            <p>
              पासवर्ड: <code className="bg-sand px-1.5 py-0.5 rounded text-maroon font-semibold">MaaNarmada@2026</code>
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}
