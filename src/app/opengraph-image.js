import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

/**
 * Default social card, served at /opengraph-image.
 *
 * Next applies this file-convention image to every route that does not define
 * its own, and reuses it for Twitter when no twitter-image.js exists — so one
 * file gives the whole site a real branded card instead of a bare link.
 *
 * Rendered with next/og (built into Next; no new dependency). Uses the default
 * font rather than fetching Poppins at build time, so image generation cannot
 * fail on a network hiccup during deploy.
 */

export const alt =
  "RealHive Consultants — custom software, mobile and data engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#021639",
          padding: "72px",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "9999px",
              background: "#30AF5B",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: "0.14em", display: "flex" }}>
            {SITE.name.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: 68, lineHeight: 1.1, display: "flex" }}>
            Custom software, built by
          </div>
          <div style={{ fontSize: 68, lineHeight: 1.1, display: "flex", color: "#30AF5B" }}>
            engineers who ship.
          </div>
        </div>

        <div style={{ fontSize: 28, opacity: 0.85, display: "flex" }}>
          Web &nbsp;·&nbsp; Mobile &nbsp;·&nbsp; Data Engineering &nbsp;·&nbsp; Cloud
        </div>
      </div>
    ),
    { ...size }
  );
}
