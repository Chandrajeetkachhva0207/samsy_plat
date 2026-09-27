import React, { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { Container, Card } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      {
        title: "लॉगिन — मा नर्मदा आध्यात्मिक शिक्षण संस्था",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { lang, t } = useLang();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    }
  }, [user, navigate]);

  const text = {
    loginTitle: {
      mr: "लॉगिन",
      en: "Login",
    },
    registerTitle: {
      mr: "नोंदणी करा",
      en: "Create Account",
    },
    loginSubtitle: {
      mr: "आपल्या खात्यात प्रवेश करण्यासाठी लॉगिन करा",
      en: "Sign in to access your account",
    },
    registerSubtitle: {
      mr: "नवीन खाते तयार करण्यासाठी खालील माहिती भरा",
      en: "Fill in the details below to create a new account",
    },
    name: {
      mr: "नाव",
      en: "Full Name",
    },
    email: {
      mr: "ई-मेल",
      en: "Email Address",
    },
    password: {
      mr: "संकेतशब्द",
      en: "Password",
    },
    namePlaceholder: {
      mr: "आपले पूर्ण नाव",
      en: "Enter your full name",
    },
    emailPlaceholder: {
      mr: "आपला ई-मेल",
      en: "Enter your email",
    },
    passwordPlaceholder: {
      mr: "संकेतशब्द प्रविष्ट करा",
      en: "Enter your password",
    },
    loginButton: {
      mr: "लॉगिन करा",
      en: "Sign In",
    },
    registerButton: {
      mr: "नोंदणी करा",
      en: "Create Account",
    },
    noAccount: {
      mr: "खाते नाही?",
      en: "Don't have an account?",
    },
    haveAccount: {
      mr: "आधीपासून खाते आहे?",
      en: "Already have an account?",
    },
    registerLink: {
      mr: "नोंदणी करा",
      en: "Register",
    },
    loginLink: {
      mr: "लॉगिन करा",
      en: "Login",
    },
    backHome: {
      mr: "मुख्यपृष्ठावर परत जा",
      en: "Back to Home",
    },
    loginSuccess: {
      mr: "लॉगिन यशस्वी.",
      en: "Login successful.",
    },
    registerSuccess: {
      mr: "नोंदणी यशस्वी.",
      en: "Registration successful.",
    },
    invalidLogin: {
      mr: "ई-मेल किंवा संकेतशब्द चुकीचा आहे.",
      en: "Invalid email or password.",
    },
    registerError: {
      mr: "नोंदणी करता आली नाही. कृपया पुन्हा प्रयत्न करा.",
      en: "Registration failed. Please try again.",
    },
    loginError: {
      mr: "लॉगिन करता आले नाही. कृपया पुन्हा प्रयत्न करा.",
      en: "Unable to login. Please try again.",
    },
    processing: {
      mr: "प्रक्रिया सुरू आहे...",
      en: "Processing...",
    },
    passwordMin: {
      mr: "संकेतशब्द किमान ६ अक्षरांचा असावा.",
      en: "Password must be at least 6 characters.",
    },
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    clearMessages();
    setLoading(true);

    try {
      const res = await api.login({
        email,
        password,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);

        setSuccess(t(text.loginSuccess));

        if (res.user.role === "admin") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/" });
        }
      } else {
        setError(res.message || t(text.invalidLogin));
      }
    } catch (err: any) {
      setError(err?.message || t(text.loginError));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    clearMessages();

    if (password.length < 6) {
      setError(t(text.passwordMin));
      return;
    }

    setLoading(true);

    try {
      const res = await api.register({
        name,
        email,
        password,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);

        setSuccess(t(text.registerSuccess));

        navigate({ to: "/" });
      } else {
        setError(res.message || t(text.registerError));
      }
    } catch (err: any) {
      setError(err?.message || t(text.registerError));
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 bg-sand/20">
      <Container className="max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-maroon"
          >
            <ArrowLeft className="h-3.5 w-3.5" />

            <span>{t(text.backHome)}</span>
          </Link>
        </div>

        <Card className="p-6 sm:p-8 shadow-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-maroon/10 text-maroon">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <h1 className="text-xl font-bold text-maroon">
              {isLogin ? t(text.loginTitle) : t(text.registerTitle)}
            </h1>

            <p className="mt-1 text-xs text-muted-foreground">
              {isLogin
                ? t(text.loginSubtitle)
                : t(text.registerSubtitle)}
            </p>
          </div>

          {/* Login / Register Switch */}
          <div className="mb-6 grid grid-cols-2 rounded-full bg-sand/70 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                clearMessages();
              }}
              className={`rounded-full py-2 text-sm font-semibold transition-colors ${
                isLogin
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(text.loginLink)}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                clearMessages();
              }}
              className={`rounded-full py-2 text-sm font-semibold transition-colors ${
                !isLogin
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(text.registerLink)}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />

              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-xs text-green-700 border border-green-200">
              {success}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="grid gap-4 text-sm"
          >
            {/* Name - Register only */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  {t(text.name)}
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t(text.namePlaceholder)}
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {t(text.email)}
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(text.emailPlaceholder)}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                {t(text.password)}
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t(text.passwordPlaceholder)}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-10 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-maroon"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading
                ? t(text.processing)
                : isLogin
                  ? t(text.loginButton)
                  : t(text.registerButton)}
            </button>
          </form>

          {/* Bottom switch */}
          <div className="mt-6 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
            {isLogin ? (
              <p>
                {t(text.noAccount)}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    clearMessages();
                  }}
                  className="font-semibold text-maroon hover:underline"
                >
                  {t(text.registerLink)}
                </button>
              </p>
            ) : (
              <p>
                {t(text.haveAccount)}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    clearMessages();
                  }}
                  className="font-semibold text-maroon hover:underline"
                >
                  {t(text.loginLink)}
                </button>
              </p>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}