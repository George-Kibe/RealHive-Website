// URL slug from a title, e.g. "React Server Components: A Guide" -> "react-server-components-a-guide".
// Shared by the API and the admin editor (client-safe: no server imports).
export const slugify = (text = "") =>
    text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "") // strip accents left over by NFKD (é -> e)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)
        .replace(/-+$/g, "");
