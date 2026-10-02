export const inputClass =
  "mt-1 w-full rounded-md border-0 bg-muted text-foreground placeholder:text-muted-foreground px-3.5 py-2 shadow-xs ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6";

// only same-site paths, so ?next= can't be used to redirect people to another site
export const safeNext = (next) =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/blog";

export const apiError = (error, fallback = "Something went wrong. Please try again.") => {
  const data = error.response?.data;
  if (typeof data === "string" && data) return data;
  if (data?.message) return data.message;
  return fallback;
};
