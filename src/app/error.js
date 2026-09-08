"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-segment error boundary. Must be a Client Component — React needs an
 * interactive boundary to re-render the segment via reset().
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // TODO(george): forward to real error tracking (Sentry et al.) once chosen.
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <h1 className="text-4xl font-bold lg:text-5xl">Something went wrong</h1>
      <p className="max-w-prose text-base opacity-80">
        This page failed to load. Trying again usually resolves it.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border px-5 py-2 font-medium"
        >
          Try again
        </button>
        <Link href="/" className="underline underline-offset-4">
          Return to the homepage
        </Link>
      </div>
    </section>
  );
}
