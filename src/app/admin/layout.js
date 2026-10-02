/**
 * Private admin area. Kept out of search results here and in robots.js, and
 * deliberately not built with buildMetadata() — it has no canonical or social
 * cards because it should never be shared or indexed.
 */
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">{children}</div>;
}
