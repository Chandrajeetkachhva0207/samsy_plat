import { createFileRoute } from "@tanstack/react-router";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://www.maanarmadasanstha.org/</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/about</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/founder</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/gurukul</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/activities</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/students</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/events</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/gallery</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/videos</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/reports</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/support</loc>
  </url>

  <url>
    <loc>https://www.maanarmadasanstha.org/contact</loc>
  </url>

</urlset>`;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
