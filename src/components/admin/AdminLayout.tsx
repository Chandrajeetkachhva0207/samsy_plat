import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Container } from "../ui";
import { 
  LayoutDashboard, 
  Calendar, 
  Image as ImageIcon, 
  Mail, 
  FileText, 
  LogOut, 
  Home, 
  ShieldCheck,
  Video
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !admin) {
      navigate({ to: "/admin/login" });
    }
  }, [admin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const navItems = [
    { to: "/admin", label: "डॅशबोर्ड (Dashboard)", icon: LayoutDashboard },
    { to: "/admin/events", label: "कार्यक्रम (Events)", icon: Calendar },
    { to: "/admin/gallery", label: "फोटो गॅलरी (Gallery)", icon: ImageIcon },
    { to: "/admin/messages", label: "संदेश (Messages)", icon: Mail },
    { to: "/admin/reports", label: "कार्य अहवाल (Reports)", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-sand/30">
      {/* Top Banner */}
      <div className="bg-maroon text-primary-foreground py-2.5 px-4 shadow-sm">
        <Container className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            <span>मा नर्मदा Admin Panel — {admin.name} ({admin.email})</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1 hover:underline text-amber-200">
              <Home className="h-3.5 w-3.5" />
              <span>मुख्य संकेतस्थळ (Website)</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/admin/login" });
              }}
              className="flex items-center gap-1 rounded bg-amber-400/20 px-2.5 py-1 hover:bg-amber-400/30 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>बाहेर पडा (Logout)</span>
            </button>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 pb-3 border-b border-border">
              <h2 className="text-base font-bold text-maroon">प्रशासन (Admin)</h2>
              <p className="text-xs text-muted-foreground">कंटेंट व्यवस्थापन प्रणाली</p>
            </div>
            <nav className="grid gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/admin" }}
                    activeProps={{ className: "bg-primary text-primary-foreground font-semibold shadow-xs" }}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-accent transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main>
            <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-4">
              <h1 className="text-2xl font-bold text-maroon">{title}</h1>
            </div>
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
