import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LangProvider } from "@/lib/lang";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl">४०४</h1>
        <h2 className="mt-4 text-xl">पृष्ठ सापडले नाही</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          आपण शोधत असलेले पृष्ठ उपलब्ध नाही. / The page you are looking for is not available.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            मुख्यपृष्ठ
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl">हे पृष्ठ उघडले नाही</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          कृपया पुन्हा प्रयत्न करा. / Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            पुन्हा प्रयत्न करा
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold"
          >
            मुख्यपृष्ठ
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "मा नर्मदा आध्यात्मिक शिक्षण संस्था, आळंदी देवाची" },
      {
        name: "description",
        content:
          "मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची — शिक्षण, संस्कार, अध्यात्म व वारकरी परंपरा.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "मा नर्मदा आध्यात्मिक शिक्षण संस्था" },
      { property: "og:locale", content: "mr_IN" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700&family=Tiro+Devanagari+Marathi&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "मा नर्मदा आध्यात्मिक शिक्षण संस्था",
          alternateName: "Maa Narmada Adhyatmik Shikshan Sanstha",
          address: {
            "@type": "PostalAddress",
            streetAddress: "मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची",
            addressLocality: "Alandi Devachi, Tal. Khed",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
          telephone: "[अधिकृत नंबर]",
          email: "[अधिकृत ई-मेल]",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="mr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          मुख्य मजकुराकडे जा
        </a>
        <Header />
        <main id="main">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <Footer />
        <FloatingContact />
      </LangProvider>
    </QueryClientProvider>
  );
}
