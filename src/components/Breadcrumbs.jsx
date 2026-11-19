import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

/**
 * Visible breadcrumbs plus the matching BreadcrumbList JSON-LD, from one list
 * so the two never disagree. `items` is [{ name, path }], home first; the last
 * item is the current page.
 */
export default function Breadcrumbs({ items, className = "" }) {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-x-2">
                {last ? (
                  <span aria-current="page" className="text-foreground">{item.name}</span>
                ) : (
                  <>
                    <Link href={item.path} className="hover:text-brand hover:underline">{item.name}</Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
