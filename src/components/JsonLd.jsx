/**
 * Renders a JSON-LD block server-side.
 *
 * Deliberately a Server Component with no "use client": structured data must be
 * present in the initial HTML. Injecting it after hydration means it may be
 * missed entirely by crawlers that do not execute JavaScript, and by Google's
 * own rich-result validators.
 *
 * Every "<" in the serialized JSON is escaped to its \u003c form, so a string
 * in the data can never terminate the script element early.
 */
export default function JsonLd({ schema }) {
  if (!schema) return null;
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
