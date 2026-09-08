"use client";

/**
 * Catches errors thrown by the root layout itself. Because it replaces the
 * layout, it must render its own <html>/<body>.
 */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            minHeight: "100vh",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1>Something went wrong</h1>
          <p>{error?.digest ? `Reference: ${error.digest}` : null}</p>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </section>
      </body>
    </html>
  );
}
