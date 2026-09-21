import { createFileRoute } from "@tanstack/react-router";
import { events } from "@/content/events";

const paths = [
  "/",
  "/about",
  "/founder",
  "/gurukul",
  "/activities",
  "/students",
  "/events",
  "/gallery",
  "/videos",
  "/reports",
  "/future-plans",
  "/support",
  "/contact",
  "/certificates",
  "/privacy",
];

export const Route = createFileRoute("/api/public/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const all = [...paths, ...events.map((e) => `/events/${e.slug}`)];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
