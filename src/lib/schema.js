/**
 * schema.org JSON-LD builders.
 *
 * Rules this file follows, deliberately:
 *  - Nothing is invented. Every literal here traces to something real in the
 *    repo (constants/index.ts, the contacts page).
 *  - No Review / AggregateRating anywhere. The testimonials on /services are
 *    entered by the business itself through the admin dashboard; Google
 *    treats self-published reviews about your own organisation as ineligible
 *    for review rich results, so marking them up is a spam-policy risk.
 *  - No LocalBusiness. That type requires a complete, verifiable address and
 *    the repo only has a partial street line (no city, region or postcode).
 *  - No WebSite SearchAction. There is no on-site search to point it at.
 *  - No FAQPage. See the note further down for why.
 *
 * Stable @id values let the separate blocks reference one another as a single
 * connected graph rather than repeating the organisation on every page.
 */

import { SITE, absoluteUrl } from "@/lib/seo";
import { SERVICES } from "@/constants";
import { SERVICE_PAGES, servicePath } from "@/constants/servicePages";
import { memberPath } from "@/constants/team";

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/** Verified contact details (used by the footer, the contacts page, emails and PDFs). */
export const CONTACT = {
  telephone: "+254795288155",
  // the company inbox; mail is sent from no-reply@realhiveconsultants.com (no mailbox on the domain yet)
  email: "realhiveconsultants@gmail.com",
};

/**
 * Official company profiles for `sameAs`, the main signal Google uses to tie
 * the brand's accounts to this site. Personal profiles (e.g. the CEO's X) don't
 * belong here. TODO(george): add the company LinkedIn, Facebook, YouTube and
 * GitHub pages once they exist.
 */
const SAME_AS = ["https://www.instagram.com/realhiveconsultants/"];

/**
 * Where the company delivers work: based in Kenya, serving the target markets
 * in the growth strategy (US, Canada, Europe, East Africa, the UAE, Australia).
 */
const AREA_SERVED = [
  { "@type": "Country", name: "Kenya" },
  { "@type": "Place", name: "East Africa" },
  { "@type": "Country", name: "United States" },
  { "@type": "Country", name: "Canada" },
  { "@type": "Place", name: "Europe" },
  { "@type": "Country", name: "United Kingdom" },
  { "@type": "Country", name: "United Arab Emirates" },
  { "@type": "Country", name: "Australia" },
];

/** Organization — the root entity everything else hangs off. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.defaultDescription,
    logo: {
      "@type": "ImageObject",
      // Square mark. Google prefers a logo it can render in a square/rounded
      // container, and requires the stated dimensions to match the real file.
      url: absoluteUrl("/icon.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/opengraph-image"),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: CONTACT.telephone,
        email: CONTACT.email,
        areaServed: "KE",
        availableLanguage: ["en"],
      },
    ],
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

/** WebSite — no SearchAction; the site has no search feature to describe. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.defaultDescription,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** The Service node for one dedicated service page (same @id wherever it appears). */
function serviceNode(page) {
  const url = absoluteUrl(servicePath(page.slug));
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: page.name,
    serviceType: page.serviceType,
    description: page.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: AREA_SERVED,
    url,
  };
}

/**
 * /services: an ItemList of the dedicated service pages (the overview links to
 * each), plus a Service node for each offering on the overview that has no page
 * of its own yet. Built from the same constants that render the page.
 */
export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${absoluteUrl("/services")}#services`,
        name: "Software development services",
        itemListElement: SERVICE_PAGES.map((page, i) => ({ "@type": "ListItem", position: i + 1, item: serviceNode(page) })),
      },
      ...SERVICES.filter((s) => !s.slug).map((service) => ({
        "@type": "Service",
        "@id": `${absoluteUrl("/services")}#${service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
        name: service.title,
        serviceType: service.title,
        description: service.description,
        provider: { "@id": ORG_ID },
        areaServed: AREA_SERVED,
        url: absoluteUrl("/services"),
      })),
    ],
  };
}

/** One dedicated service page: its Service node. */
export function servicePageSchema(page) {
  return { "@context": "https://schema.org", ...serviceNode(page) };
}

/** BreadcrumbList from [{ name, path }], home first. Matches the visible breadcrumbs. */
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/*
 * FAQPage: deliberately NOT implemented.
 *
 * Two independent reasons, either sufficient on its own:
 *
 *  1. Google removed the FAQ rich result feature from Search in May 2026
 *     (it had already been restricted to authoritative government and health
 *     sites in September 2023). The markup can therefore produce no rich
 *     result and no SERP change whatsoever.
 *
 *  2. The answers are not in the rendered DOM. The Radix accordion on
 *     /services unmounts collapsed content, so answer text exists only in the
 *     React payload until a user clicks. Marking up text a crawler never sees
 *     contradicts Google's "mark up only visible content" guideline.
 *
 * If Radix is ever switched to forceMount so answers are always in the DOM,
 * reason 2 goes away — but reason 1 still makes this worthless. Do not re-add
 * it without a concrete reason.
 */

/**
 * BlogPosting for one published post. Every field comes from the post record
 * itself; the publisher is the organisation node above. The author is the named
 * team member (a Person who works for the organisation, with the same @id as
 * their card on /aboutus) or, for posts without one, the organisation.
 */
function personNode(member) {
  const sameAs = member.links.map((l) => l.href);
  return {
    "@type": "Person",
    "@id": absoluteUrl(memberPath(member.slug)),
    name: member.name,
    jobTitle: member.role,
    url: absoluteUrl(memberPath(member.slug)),
    image: absoluteUrl(member.image.src),
    worksFor: { "@id": ORG_ID },
    ...(member.bio ? { description: member.bio } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function blogPostingSchema(post, { imageUrl, author } = {}) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    author: author ? personNode(author) : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
  };
}
