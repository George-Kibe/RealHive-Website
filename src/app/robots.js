import { SITE, absoluteUrl } from "@/lib/seo";

/**
 * Served at /robots.txt via the Next.js MetadataRoute.Robots API.
 *
 * `/api/` is disallowed: those routes are JSON handlers (auth, mpesa, mail)
 * with no crawlable content, and several accept POST-only. Nothing else is
 * blocked — every public page should be crawlable.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
