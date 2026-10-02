import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { isKnownCountry } from "@/lib/quote/regions";

/**
 * The visitor's country from the hosting platform's IP geolocation header:
 * Vercel sets x-vercel-ip-country, Cloudflare sets cf-ipcountry. Those are
 * added by the platform's edge, so a client can't spoof them in production.
 * Returns null when there's no usable header (local dev, unknown or Tor "T1"),
 * in which case regions.js prices at UNDETECTED_TIER. Visitors are never asked
 * for their country, and anything the browser sends about location is ignored.
 */
export const detectCountry = async () => {
    const h = await headers();
    const code = (h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || "").toUpperCase();
    return isKnownCountry(code) ? code : null;
};

// A salted hash of the client IP, for rate limiting without storing raw IPs.
export const clientIpHash = async () => {
    const h = await headers();
    const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
    return createHash("sha256").update(`${ip}:${process.env.ACCESS_TOKEN_SECRET}`).digest("hex").slice(0, 32);
};
