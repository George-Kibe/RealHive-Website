/**
 * Centralized SEO metadata for the whole site.
 *
 * Every indexable route builds its metadata through `buildMetadata()` so that
 * canonical, Open Graph and Twitter fields can never drift apart or be
 * copy-pasted inconsistently. Add a route -> call buildMetadata. That's it.
 *
 * The canonical origin is realhiveconsultants.com. The Vercel deployment
 * origin (realhive-consultants.vercel.app) serves byte-identical content, so
 * every page emits an absolute self-referencing canonical pointing at the
 * canonical origin. That is what tells Google which host to index and keeps
 * the two origins from competing as duplicates.
 *
 * Override per-environment with NEXT_PUBLIC_SITE_URL (see .env.example).
 */

const DEFAULT_SITE_URL = "https://realhiveconsultants.com";

/** Strip trailing slashes so joins never produce `//`. */
function normalizeOrigin(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

export const SITE = {
  url: normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) || DEFAULT_SITE_URL,
  /** Display/brand name used in title templates and og:site_name. */
  name: "RealHive Consultants",
  /** Legal entity name, as stated on the About page. Used by Phase 3 JSON-LD. */
  legalName: "RealHive Consultants Limited",
  /**
   * Homepage title. Lives here rather than being written twice, because the
   * root layout needs it as `title.default` and the homepage needs the same
   * string for its Open Graph title.
   */
  defaultTitle: "Custom Software Development Company | RealHive Consultants",
  defaultDescription:
    "RealHive Consultants builds custom web and mobile applications, data pipelines and cloud platforms for founders and product teams. Talk to our engineers.",
  locale: "en_US",
};

/**
 * Turn an app-relative path into an absolute URL on the canonical origin.
 * Enforces the site's no-trailing-slash URL shape (see `trailingSlash` in
 * next.config.js) so canonicals never disagree with what the server serves.
 */
export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  // Always drop the trailing slash, root included. Next.js normalizes the root
  // canonical to a bare origin (`https://site.com`), so emitting `https://site.com/`
  // in the sitemap would describe the same page two ways. Same URL per RFC 3986,
  // but an auditor should never see the two disagree.
  const trimmed = withLeadingSlash.replace(/\/+$/, "");
  return `${SITE.url}${trimmed}`;
}

/**
 * Metadata fragment adding a self-referencing canonical for `path`.
 * Kept exported because robots.js/sitemap.js and tests use it directly.
 */
export function canonical(path) {
  return { alternates: { canonical: absoluteUrl(path) } };
}

/**
 * Build a complete Next.js Metadata object for one route.
 *
 * @param {object}  opts
 * @param {string}  opts.title         Page title WITHOUT the brand suffix — the
 *                                     root layout's `title.template` appends it.
 * @param {string}  opts.description   140-160 chars, written for click-through.
 * @param {string}  opts.path          App-relative path, e.g. "/services".
 * @param {boolean} [opts.absoluteTitle=false]  Skip the brand template (homepage).
 * @param {string}  [opts.image]       Override the default OG image. Omit to let
 *                                     the opengraph-image.js file convention supply it.
 * @param {string}  [opts.type="website"]  Open Graph type ("article" for posts).
 * @param {boolean} [opts.noindex=false]    Utility/thank-you pages.
 * @returns {import('next').Metadata}
 */
export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image,
  type = "website",
  noindex = false,
}) {
  const url = absoluteUrl(path);
  // Point at the next/og route rendered by app/opengraph-image.js. Set
  // explicitly rather than relying on the file convention to auto-inject:
  // because buildMetadata() declares its own `openGraph` object, the
  // convention's image is not merged in, and og:image would silently go missing.
  const ogImage = image ?? absoluteUrl("/opengraph-image");
  // og:title has no template applied to it, so it must carry the brand itself.
  const socialTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
