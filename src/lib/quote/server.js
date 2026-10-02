import "server-only";
import { randomBytes } from "node:crypto";
import { detectCountry } from "@/lib/quote/location";
import { priceQuote } from "@/lib/quote/pricing";
import { normalizeSelection } from "@/lib/quote/selection";

export class QuoteInputError extends Error {}

// e.g. RH-261003-K7Q2, dated in Nairobi time to match the date printed on the PDF
const newReference = (date) => {
    const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi", year: "2-digit", month: "2-digit", day: "2-digit" })
        .format(date).replace(/-/g, "");
    const suffix = randomBytes(3).toString("base64url").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4).padEnd(4, "X");
    return `RH-${ymd}-${suffix}`;
};

const clean = (value, max) => (typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");

/**
 * Validate a quote request body and price it on the server.
 * body: { selection, contact?: { name, email, company, notes } }
 * The country comes only from the request's IP geolocation (never the body).
 * Throws QuoteInputError with a user-facing message on bad input.
 */
export async function prepareQuote(body = {}, { requireContact = false } = {}) {
    const { selection, errors } = normalizeSelection(body.selection);
    if (errors.length) throw new QuoteInputError(errors[0]);

    const raw = body.contact ?? {};
    const contact = {
        name: clean(raw.name, 100),
        email: clean(raw.email, 200).toLowerCase(),
        company: clean(raw.company, 100),
        notes: typeof raw.notes === "string" ? raw.notes.trim().slice(0, 1000) : "",
    };
    if (requireContact) {
        if (!contact.name) throw new QuoteInputError("Enter your name");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) throw new QuoteInputError("Enter a valid email address");
    }

    const country = await detectCountry();
    const createdAt = new Date();
    const quote = { ...(await priceQuote(selection, country)), countryDetected: Boolean(country), reference: newReference(createdAt), createdAt };
    return { quote, selection, contact };
}
