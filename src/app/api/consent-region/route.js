import { CONSENT_REQUIRED_COUNTRIES } from "@/lib/analytics";
import { NextResponse } from "next/server";

// Whether this visitor must be asked before analytics cookies (EEA, UK, Switzerland).
// Unknown location (local dev, rare in production) -> ask, to be safe.
export const GET = async (request) => {
    const country = (request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "").toUpperCase();
    const required = !country || country === "XX" || CONSENT_REQUIRED_COUNTRIES.includes(country);
    return NextResponse.json({ required }, { status: 200, headers: { "Cache-Control": "private, no-store" } });
}
