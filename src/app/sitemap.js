import fs from "node:fs";
import path from "node:path";
import { absoluteUrl } from "@/lib/seo";

/**
 * Served at /sitemap.xml.
 *
 * Routes are discovered by walking the app directory rather than hardcoding a
 * list, so a new page appears in the sitemap the moment it is created and the
 * sitemap can never silently drift out of sync with the router.
 *
 * `lastModified` comes from the page file's mtime. On Vercel that reflects the
 * checkout, so it approximates "last deployed" rather than "last meaningfully
 * edited" — see SEO.md. Google treats lastmod as a weak hint, so an
 * approximation is safe; a wrong-but-confident date would not be.
 */

const APP_DIR = path.join(process.cwd(), "src", "app");
const PAGE_FILE = /^page\.(js|jsx|ts|tsx)$/;

/** Directories that never produce indexable public routes. */
const EXCLUDED_SEGMENTS = new Set(["api"]);

/**
 * Per-route crawl hints. Anything not listed falls back to DEFAULT_HINT, so
 * forgetting to add an entry degrades gracefully instead of dropping the URL.
 */
const HINTS = {
  "/": { changeFrequency: "weekly", priority: 1.0 },
  "/services": { changeFrequency: "weekly", priority: 0.9 },
  "/portfolio": { changeFrequency: "monthly", priority: 0.8 },
  "/aboutus": { changeFrequency: "monthly", priority: 0.7 },
  "/contacts": { changeFrequency: "yearly", priority: 0.6 },
  "/careers": { changeFrequency: "weekly", priority: 0.5 },
  "/privacy-policy": { changeFrequency: "yearly", priority: 0.2 },
};
const DEFAULT_HINT = { changeFrequency: "monthly", priority: 0.5 };

/** Recursively collect { route, lastModified } for every page file. */
function collectRoutes(dir = APP_DIR, segments = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const routes = [];

  for (const entry of entries) {
    const name = entry.name;

    if (entry.isFile() && PAGE_FILE.test(name)) {
      routes.push({
        route: segments.length ? `/${segments.join("/")}` : "/",
        lastModified: fs.statSync(path.join(dir, name)).mtime,
      });
      continue;
    }

    if (!entry.isDirectory()) continue;
    // Private folders (_foo), parallel routes (@foo) and api never route.
    if (name.startsWith("_") || name.startsWith("@")) continue;
    if (EXCLUDED_SEGMENTS.has(name)) continue;
    // Dynamic segments can't be enumerated without a data source; when this
    // site gains a blog, generate those URLs from the CMS and concat them here.
    if (name.startsWith("[")) continue;

    // Route groups (foo) organise files without adding a URL segment.
    const isRouteGroup = name.startsWith("(") && name.endsWith(")");
    routes.push(
      ...collectRoutes(
        path.join(dir, name),
        isRouteGroup ? segments : [...segments, name]
      )
    );
  }

  return routes;
}

export default function sitemap() {
  return collectRoutes()
    .sort((a, b) => a.route.localeCompare(b.route))
    .map(({ route, lastModified }) => ({
      url: absoluteUrl(route),
      lastModified,
      ...(HINTS[route] ?? DEFAULT_HINT),
    }));
}
