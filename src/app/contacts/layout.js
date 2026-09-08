import { buildMetadata } from "@/lib/seo";

/**
 * `contacts/page.js` is a Client Component (it owns form state), and Client
 * Components cannot export `metadata`. This server layout carries the route's
 * metadata instead.
 *
 * Phase 4 moves the "use client" boundary down into the form component; once
 * page.js is a Server Component again, this metadata moves there and this file
 * can be deleted.
 */
export const metadata = buildMetadata({
  title: "Contact Our Development Team",
  description:
    "Tell us about your web, mobile or data project and get a considered reply from an engineer. Reach us by email, WhatsApp or the form on this page.",
  path: "/contacts",
});

export default function ContactsLayout({ children }) {
  return children;
}
