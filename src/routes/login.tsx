import React, { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import { Container, Card } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/lang";

type LoginSearch = {
  mode?: "register" | "login" | "forgot";
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const mode = search["mode"] as string;
    if (mode === "login" || mode === "register" || mode === "forgot") {
      return { mode };
    }
    return { mode: "register" };
  },
  head: () => ({
    meta: [
      {
        title: "विद्यार्थी नोंदणी व लॉगिन — मा नर्मदा आध्यात्मिक शिक्षण संस्था",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { lang, t } = useLang();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  // Every panel: FIRST REGISTRATION, then Sign In
  const [mode, setMode] = useState<"login" | "register" | "forgot">(
    search.mode || "register"
  );

  useEffect(() => {
    if (search.mode && (search.mode === "login" || search.mode === "register" || search.mode === "forgot")) {
      setMode(search.mode);
    }
  }, [search.mode]);

  // Registration fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login identifier (Email or Mobile)
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Forgot password fields
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [emailDelivered, setEmailDelivered] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/student/dashboard" });
      }
    }
  }, [user, navigate]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // 1. Handle Login (Email or Mobile)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const res = await api.login({
        identifier: loginIdentifier,
        password: loginPassword,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        setSuccess(
          lang === "mr" ? "लॉगिन यशस्वी झाले!" : "Login successful!"
        );

        if (res.user.role === "admin") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/student/dashboard" });
        }
      } else {
        setError(
          res.message ||
            (lang === "mr"
              ? "ई-मेल/मोबाईल किंवा संकेतशब्द चुकीचा आहे."
              : "Invalid email/mobile or password.")
        );
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (lang === "mr"
            ? "लॉगिन करता आले नाही. कृपया पुन्हा प्रयत्न करा."
            : "Unable to login. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Register (Name, Mobile, Email, Password)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (password.length < 6) {
      setError(
        lang === "mr"
          ? "संकेतशब्द किमान ६ अक्षरांचा असावा."
          : "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await api.register({
        name,
        email,
        mobile,
        password,
        role: "student",
      });

      if (res.success) {
        setSuccess(
          lang === "mr"
            ? "✅ विद्यार्थी नोंदणी यशस्वी झाली! आता खालील फॉर्ममध्ये आपला Email किंवा Mobile आणि Password टाकून Student Panel मध्ये लॉगिन (Sign In) करा."
            : "✅ Registration successful! Please Sign In below with your credentials to access the Student Panel."
        );
        // Pre-fill login identifier for easy Sign In
        setLoginIdentifier(email || mobile);
        setLoginPassword("");
        // Switch to Step 2: Sign In
        setMode("login");
      } else {
        setError(
          res.message ||
            (lang === "mr"
              ? "नोंदणी करता आली नाही."
              : "Registration failed.")
        );
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (lang === "mr"
            ? "नोंदणी करता आली नाही. कृपया पुन्हा प्रयत्न करा."
            : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Forgot Password - Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const res = await api.forgotPassword(forgotIdentifier);
      if (res.success) {
        setOtpSent(true);
        if (res.emailSent === false && res.otp) {
          setEmailDelivered(false);
          setDevOtpCode(res.otp);
          setOtp(res.otp);
          setSuccess(
            lang === "mr"
              ? `⚠️ Gmail SMTP अद्याप backend/.env मध्ये सेट केलेले नाही. चाचणीसाठी आपला OTP खाली दिला आहे: ${res.otp}`
              : `⚠️ Gmail SMTP not configured in backend/.env. Test OTP: ${res.otp}`
          );
        } else {
          setEmailDelivered(true);
          setDevOtpCode(null);
          setSuccess(
            res.message ||
              (lang === "mr"
                ? "✅ पासवर्ड रीसेट OTP आपल्या नोंदणीकृत ई-मेलवर (Gmail) पाठवला आहे. कृपया आपला ईमेल इनबॉक्स व स्पॅम फोल्डर तपासा."
                : "✅ Password reset OTP has been sent to your registered Gmail address. Please check your inbox.")
          );
        }
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (lang === "mr"
            ? "OTP पाठवता आला नाही. ई-मेल किंवा मोबाईल तपासा."
            : "Failed to send OTP. Please check email/mobile.")
      );
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Forgot Password - Submit New Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (newPassword.length < 6) {
      setError(
        lang === "mr"
          ? "नवीन पासवर्ड किमान ६ अक्षरांचा असावा."
          : "New password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await api.resetPasswordWithOtp({
        identifier: forgotIdentifier,
        otp,
        newPassword,
      });

      if (res.success) {
        setSuccess(
          lang === "mr"
            ? "पासवर्ड यशस्वीरीत्या बदलला आहे! आता नवीन पासवर्डने लॉगिन करा."
            : "Password reset successful! Please login with your new password."
        );
        setMode("login");
        setOtpSent(false);
        setLoginIdentifier(forgotIdentifier);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (lang === "mr"
            ? "पासवर्ड बदलता आला नाही. OTP तपासून पुन्हा प्रयत्न करा."
            : "Password reset failed. Please check OTP.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 bg-sand/20">
      <Container className="max-w-md">
        {/* Back to Home */}
        <div className="mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-maroon transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>
              {lang === "mr" ? "मुख्यपृष्ठावर परत जा" : "Back to Home"}
            </span>
          </Link>
        </div>

        <Card className="p-6 sm:p-8 shadow-md border-border/80">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-maroon/10 text-maroon shadow-inner">
              {mode === "forgot" ? (
                <KeyRound className="h-7 w-7 text-maroon" />
              ) : (
                <ShieldCheck className="h-7 w-7 text-maroon" />
              )}
            </div>

            {/* 2-Step Flow Indicator */}
            {mode !== "forgot" && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sand/80 px-3.5 py-1 text-[11px] font-semibold border border-primary/20">
                <span
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors ${
                    mode === "register"
                      ? "bg-maroon text-white shadow-xs"
                      : "text-muted-foreground"
                  }`}
                >
                  <span>Step 1:</span> {lang === "mr" ? "प्रथम नोंदणी (Register)" : "Register"}
                </span>
                <span className="text-muted-foreground font-bold">➔</span>
                <span
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors ${
                    mode === "login"
                      ? "bg-maroon text-white shadow-xs"
                      : "text-muted-foreground"
                  }`}
                >
                  <span>Step 2:</span> {lang === "mr" ? "लॉगिन करा (Sign In)" : "Sign In"}
                </span>
              </div>
            )}

            <h1 className="text-xl font-bold text-maroon">
              {mode === "register"
                ? lang === "mr"
                  ? "१. नवीन विद्यार्थी नोंदणी (Step 1: Register)"
                  : "Step 1: Student Registration"
                : mode === "login"
                  ? lang === "mr"
                    ? "२. विद्यार्थी पॅनेल लॉगिन (Step 2: Sign In)"
                    : "Step 2: Sign In to Student Panel"
                  : lang === "mr"
                    ? "संकेतशब्द विसरलात? (Forgot Password)"
                    : "Forgot Password"}
            </h1>

            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "register"
                ? lang === "mr"
                  ? "नोंदणीसाठी आपले नाव, मोबाईल, ईमेल व पासवर्ड भरा"
                  : "Fill in your details to create a student account"
                : mode === "login"
                  ? lang === "mr"
                    ? "नोंदणीकृत ई-मेल किंवा मोबाईल नंबर आणि पासवर्ड टाकून डॅशबोर्ड उघडा"
                    : "Enter your registered Email/Mobile and Password to open dashboard"
                  : lang === "mr"
                    ? "सुरक्षित OTP द्वारे नवीन संकेतशब्द सेट करा"
                    : "Reset your password securely via OTP"}
            </p>
          </div>

          {/* Mode Switcher Tabs: 1. Registration First, 2. Sign In, 3. Forgot Password */}
          <div className="mb-6 grid grid-cols-3 rounded-full bg-sand/70 p-1 border border-border/50 text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={() => {
                setMode("register");
                clearMessages();
              }}
              className={`rounded-full py-2 px-1 text-center font-semibold transition-all ${
                mode === "register"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang === "mr" ? "१. नोंदणी" : "1. Register"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                clearMessages();
              }}
              className={`rounded-full py-2 px-1 text-center font-semibold transition-all ${
                mode === "login"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang === "mr" ? "२. लॉगिन" : "2. Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                clearMessages();
              }}
              className={`rounded-full py-2 px-1 text-center font-semibold transition-all flex items-center justify-center gap-1 ${
                mode === "forgot"
                  ? "bg-maroon text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>{lang === "mr" ? "३. पासवर्ड विसरलात?" : "3. Forgot Pass?"}</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}


          {/* ----------------- 1. LOGIN FORM ----------------- */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="grid gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  {lang === "mr"
                    ? "ई-मेल किंवा मोबाईल क्रमांक"
                    : "Email or Mobile Number"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={
                      lang === "mr"
                        ? "उदा. student@gmail.com किंवा 9876543210"
                        : "e.g. student@gmail.com or 9876543210"
                    }
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-foreground">
                    {lang === "mr" ? "संकेतशब्द (Password)" : "Password"} *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      clearMessages();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-maroon hover:underline bg-maroon/10 hover:bg-maroon/20 px-2 py-0.5 rounded border border-maroon/30 transition-colors"
                  >
                    <KeyRound className="h-3 w-3" />
                    <span>{lang === "mr" ? "🔑 संकेतशब्द विसरलात? (Forgot Password?)" : "🔑 Forgot Password?"}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={
                      lang === "mr"
                        ? "संकेतशब्द प्रविष्ट करा"
                        : "Enter password"
                    }
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-10 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-maroon"
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading
                  ? lang === "mr"
                    ? "प्रक्रिया सुरू आहे..."
                    : "Signing in..."
                  : lang === "mr"
                    ? "Step 2: लॉगिन करा (Sign In)"
                    : "Step 2: Sign In"}
              </button>

              <div className="mt-3 text-center text-xs text-muted-foreground border-t border-border/50 pt-3">
                {lang === "mr" ? "अजून नोंदणी केली नाही का?" : "Not registered yet?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode("register");
                  }}
                  className="font-semibold text-maroon hover:underline ml-1"
                >
                  {lang === "mr"
                    ? "➔ Step 1: प्रथम येथे नोंदणी करा (Register First)"
                    : "➔ Step 1: Register First"}
                </button>
              </div>
            </form>
          )}

          {/* ----------------- 2. REGISTRATION FORM ----------------- */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="grid gap-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  {lang === "mr" ? "विद्यार्थ्याचे पूर्ण नाव" : "Student Full Name"} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      lang === "mr"
                        ? "आपले पूर्ण नाव प्रविष्ट करा"
                        : "Enter full name"
                    }
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  {lang === "mr" ? "मोबाईल क्रमांक" : "Mobile Number"} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder={
                      lang === "mr" ? "१० अंकी मोबाईल नंबर" : "10-digit mobile"
                    }
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  {lang === "mr" ? "ई-मेल पत्ता" : "Email Address"} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      lang === "mr" ? "ई-मेल प्रविष्ट करा" : "Enter email"
                    }
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  {lang === "mr"
                    ? "संकेतशब्द तयार करा (Password)"
                    : "Create Password"}{" "}
                  *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      lang === "mr"
                        ? "किमान ६ अक्षरांचा पासवर्ड"
                        : "At least 6 characters"
                    }
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-10 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-maroon"
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50/70 p-2.5 text-[11px] text-amber-900 border border-amber-200">
                ℹ️{" "}
                {lang === "mr"
                  ? "नोंदणीनंतर प्रोफाइलमध्ये शैक्षणिक माहिती व कागदपत्रे अपलोड करावी लागतील. पडताळणीनंतर अधिकृत Student ID मिळेल."
                  : "After registration, upload educational details & documents in your dashboard for verification."}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading
                  ? lang === "mr"
                    ? "नोंदणी होत आहे..."
                    : "Registering..."
                  : lang === "mr"
                    ? "Step 1: विद्यार्थी नोंदणी पूर्ण करा (Register)"
                    : "Step 1: Complete Registration"}
              </button>

              <div className="mt-3 text-center text-xs text-muted-foreground border-t border-border/50 pt-3">
                {lang === "mr" ? "आधीच नोंदणी केली आहे का?" : "Already registered?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode("login");
                  }}
                  className="font-semibold text-maroon hover:underline ml-1"
                >
                  {lang === "mr"
                    ? "➔ Step 2: येथे लॉगिन करा (Sign In to Student Panel)"
                    : "➔ Step 2: Sign In to Student Panel"}
                </button>
              </div>
            </form>
          )}

          {/* ----------------- 3. FORGOT PASSWORD FLOW ----------------- */}
          {mode === "forgot" && (
            <div className="grid gap-4 text-sm">
              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="grid gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      {lang === "mr"
                        ? "नोंदणीकृत ई-मेल किंवा मोबाईल नंबर"
                        : "Registered Email or Mobile"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder={
                          lang === "mr"
                            ? "ई-मेल किंवा मोबाईल नंबर टाका"
                            : "Enter email or mobile"
                        }
                        className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? lang === "mr"
                        ? "OTP पाठवला जात आहे..."
                        : "Sending OTP..."
                      : lang === "mr"
                        ? "OTP मिळवा (Send OTP)"
                        : "Send Reset OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="grid gap-4">
                  {!emailDelivered && devOtpCode ? (
                    <div className="rounded-xl bg-amber-50 p-3.5 text-xs text-amber-900 border border-amber-300 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950">🔑 चाचणी पडताळणी OTP (Test OTP):</span>
                        <span className="font-mono text-lg font-bold bg-amber-200/80 text-amber-950 px-3 py-0.5 rounded-lg border border-amber-400 tracking-widest">
                          {devOtpCode}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] text-amber-800 leading-relaxed">
                        <strong>टीप:</strong> थेट Gmail इनबॉक्समध्ये ईमेल येण्यासाठी <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">backend/.env</code> मध्ये <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">GMAIL_USER</code> आणि <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">GMAIL_APP_PASSWORD</code> कॉन्फिगर करणे आवश्यक आहे. सध्या हा चाचणी OTP वापरून आपण पासवर्ड बदलू शकता.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-blue-50/80 p-3 text-xs text-blue-900 border border-blue-200 flex items-start gap-2">
                      <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {lang === "mr" ? "आपला Gmail इनबॉक्स तपासा (Check Gmail)" : "Check Your Gmail Inbox"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-blue-800">
                          {lang === "mr"
                            ? `आम्ही ${forgotIdentifier} या ईमेलवर ६-अंकी सुरक्षित OTP पाठवला आहे. कृपया Gmail तपासून खाली OTP टाका.`
                            : `A 6-digit OTP has been sent to ${forgotIdentifier}. Please check Gmail and enter it below.`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      {lang === "mr" ? "Gmail वर आलेला ६-अंकी OTP टाका" : "Enter 6-Digit OTP from Gmail"} *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-center text-lg font-mono tracking-widest focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      {lang === "mr" ? "नवीन पासवर्ड (New Password)" : "New Password"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={
                          lang === "mr"
                            ? "नवीन संकेतशब्द टाका"
                            : "Enter new password"
                        }
                        className="w-full rounded-lg border border-border bg-background pl-9 pr-10 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-maroon"
                        aria-label="Toggle password"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? lang === "mr"
                        ? "बदलत आहे..."
                        : "Resetting..."
                      : lang === "mr"
                        ? "पासवर्ड बदला (Reset Password)"
                        : "Reset Password"}
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    clearMessages();
                  }}
                  className="text-xs font-semibold text-maroon hover:underline"
                >
                  ← {lang === "mr" ? "लॉगिन स्क्रीनवर परत जा" : "Back to Sign In"}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Switch between Login / Register */}
          {mode !== "forgot" && (
            <div className="mt-6 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
              {mode === "login" ? (
                <p>
                  {lang === "mr"
                    ? "अजून खाते नाही?"
                    : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      clearMessages();
                    }}
                    className="font-semibold text-maroon hover:underline"
                  >
                    {lang === "mr" ? "नवीन नोंदणी करा" : "Register here"}
                  </button>
                </p>
              ) : (
                <p>
                  {lang === "mr"
                    ? "आधीपासून खाते आहे?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      clearMessages();
                    }}
                    className="font-semibold text-maroon hover:underline"
                  >
                    {lang === "mr" ? "येथे लॉगिन करा" : "Sign in here"}
                  </button>
                </p>
              )}
            </div>
          )}

        </Card>
      </Container>
    </div>
  );
}