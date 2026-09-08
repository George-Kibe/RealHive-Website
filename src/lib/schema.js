/**
 * schema.org JSON-LD builders.
 *
 * Rules this file follows, deliberately:
 *  - Nothing is invented. Every literal here traces to something real in the
 *    repo (constants/index.ts, the contacts page) or is a TODO(george).
 *  - No Review / AggregateRating anywhere. The testimonials currently on
 *    /services are Tailwind UI placeholder text attributed to a fictional
 *    person; marking that up would be fabricated review data and a Google
 *    spam-policy violation.
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

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/**
 * Verified contact details, from FOOTER_CONTACT_INFO and the contacts page.
 *
 * TODO(george): the footer spells the address "realHivecosultants@gmail.com"
 * while the contacts page uses "realhiveconsultants@gmail.com". The second
 * looks correct and is used here — confirm and fix the footer typo.
 */
const CONTACT = {
  telephone: "+254795288155",
  email: "realhiveconsultants@gmail.com",
};

/**
 * TODO(george): official company profile URLs for `sameAs` — LinkedIn company
 * page, X/Twitter, Facebook, Instagram, GitHub org. The repo only contains a
 * personal GitHub and the CEO's personal Twitter; a personal profile is not the
 * organisation's identity, so nothing is emitted until you supply real ones.
 * `sameAs` is the primary signal Google uses to reconcile your brand entity, so
 * this is the single highest-value item on the TODO list.
 */
const SAME_AS = [];

/**
 * TODO(george): `areaServed` is set to Kenya because that is what the repo
 * evidences (a +254 phone number and a physical office). Widen this if you sell
 * internationally — it should reflect where you actually deliver work.
 */
const AREA_SERVED = { "@type": "Country", name: "Kenya" };

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

/**
 * One Service node per offering actually listed on /services, generated from
 * the same SERVICES constant that renders the page so the two cannot diverge.
 */
export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": SERVICES.map((service) => ({
      "@type": "Service",
      "@id": `${absoluteUrl("/services")}#${service.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`,
      name: service.title,
      serviceType: service.title,
      description: service.description,
      provider: { "@id": ORG_ID },
      areaServed: AREA_SERVED,
      url: absoluteUrl("/services"),
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
