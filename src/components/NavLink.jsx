"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Navigation link with brand-blue hover and an active state.
 *
 * A small Client Component on purpose: `usePathname` needs the client, but the
 * pages and the Footer stay Server Components — only this leaf hydrates.
 *
 * Active styling is brand blue plus a short rule beneath, drawn with an
 * `after:` pseudo-element so it never affects layout (a real border would shift
 * the text by a pixel when it appears).
 *
 * @param {boolean} [showActive=true]  Set false for links that are not
 *   navigation (the footer's contact block points every entry at "/", so
 *   without this every one of them would light up as active on the homepage).
 */
export default function NavLink({
  href,
  children,
  className,
  showActive = true,
  ...props
}) {
  const pathname = usePathname();

  // "/" must match exactly, or it would be active on every page. Deeper routes
  // also match their children, so /services/web keeps /services highlighted.
  const isActive =
    showActive &&
    (href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-block transition-colors duration-200",
        "hover:text-brand focus-visible:text-brand focus-visible:outline-hidden",
        // the underline: centred, grows in on hover, pinned on when active
        "after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-0",
        "after:-translate-x-1/2 after:rounded-full after:bg-brand",
        "after:transition-all after:duration-200 after:content-['']",
        "hover:after:w-full focus-visible:after:w-full",
        isActive && "text-brand after:w-full",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
