import Link from "next/link";

/**
 * Rendered for unmatched routes. Next returns a real HTTP 404 with this, so
 * crawlers drop the URL instead of indexing a soft-404.
 *
 * The links out are deliberate: a 404 that offers routes back into the site
 * recovers crawl paths and users who followed a stale link.
 */
export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const SUGGESTED = [
  { href: "/services", label: "Our software development services" },
  { href: "/portfolio", label: "Projects we have delivered" },
  { href: "/aboutus", label: "About RealHive Consultants" },
  { href: "/contacts", label: "Contact the team" },
];

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest uppercase">404</p>
      <h1 className="text-4xl font-bold lg:text-5xl">This page does not exist</h1>
      <p className="max-w-prose text-base opacity-80">
        The page you asked for may have been moved or removed. These are the
        most useful places to pick up from:
      </p>
      <ul className="flex flex-col items-center gap-2">
        {SUGGESTED.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="underline underline-offset-4">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
