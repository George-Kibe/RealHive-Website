/** @type {import('next').NextConfig} */

/**
 * Security headers applied to every route. Deliberately excludes a
 * Content-Security-Policy: this site loads Google Fonts CSS, S3 images and
 * (soon) analytics, so a CSP written without testing each of those would break
 * the site silently. See SEO.md for the follow-up.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * Legacy and commonly-mistyped paths, each resolving in ONE hop to its live
 * URL. Never point a redirect at another redirect source.
 *
 * `/loading` existed as a real (orphaned, spinner-only) route; it 301s to the
 * homepage rather than 404ing, in case it was ever indexed or linked.
 */
const redirects = [
  ["/loading", "/"],
  ["/about", "/aboutus"],
  ["/about-us", "/aboutus"],
  ["/contact", "/contacts"],
  ["/contact-us", "/contacts"],
  ["/service", "/services"],
  ["/career", "/careers"],
  ["/jobs", "/careers"],
  ["/privacy", "/privacy-policy"],
  ["/projects", "/portfolio"],
  ["/work", "/portfolio"],
];

const nextConfig = {
  // One URL shape, declared rather than inherited. `/services/` 301s to
  // `/services`, matching the canonical tags emitted by lib/seo.js.
  trailingSlash: false,

  // Strip the framework fingerprint.
  poweredByHeader: false,

  images: {
    // Serve modern formats; AVIF first, WebP fallback.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "buenare-images-bucket.s3.eu-west-1.amazonaws.com",
      },
    ],
  },

  async redirects() {
    return redirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true, // 308 (permanent, method-preserving); Google treats as 301
    }));
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
