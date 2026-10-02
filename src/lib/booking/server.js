import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { connectDB } from "@/db/connectDB";
import { getCalendarSettings } from "@/lib/booking/settings";
import { computeSlots } from "@/lib/booking/slots";
import { isValidTimeZone } from "@/lib/booking/time";
import Booking from "@/models/BookingModel";

export class BookingInputError extends Error {}

// Currently bookable slots, plus the settings they came from.
export async function getAvailableSlots(now = new Date()) {
  const settings = await getCalendarSettings();
  await connectDB();
  const bookings = await Booking.find({ status: "confirmed", endsAt: { $gt: now } }).select("startsAt endsAt").lean();
  return { settings, slots: computeSlots(settings, bookings, now) };
}

const clean = (value, max) => (typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");

// Validate a booking request body. Throws BookingInputError with a user-facing message.
export function validateBookingInput(body = {}) {
  const startsAt = new Date(body.startsAt);
  if (Number.isNaN(startsAt.getTime())) throw new BookingInputError("Choose a time");
  const input = {
    startsAt,
    name: clean(body.name, 100),
    email: clean(body.email, 200).toLowerCase(),
    company: clean(body.company, 100),
    topic: typeof body.topic === "string" ? body.topic.trim().slice(0, 1000) : "",
    timezone: isValidTimeZone(body.timezone) ? body.timezone : null,
  };
  if (!input.name) throw new BookingInputError("Enter your name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new BookingInputError("Enter a valid email address");
  if (!input.topic) throw new BookingInputError("Tell us briefly what you'd like to discuss");
  return input;
}

// e.g. BK-261005-K7Q2, dated (like the quotes) in Nairobi time
export const newBookingReference = (date = new Date()) => {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi", year: "2-digit", month: "2-digit", day: "2-digit" })
    .format(date).replace(/-/g, "");
  const suffix = randomBytes(3).toString("base64url").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4).padEnd(4, "X");
  return `BK-${ymd}-${suffix}`;
};

// The visitor's cancel link carries a random token; only its hash is stored.
export const newCancelToken = () => {
  const token = randomBytes(24).toString("base64url");
  return { token, hash: hashToken(token) };
};
export const hashToken = (token) => createHash("sha256").update(String(token)).digest("hex");

// Pre-filled "create event" link for the team: opens Google Calendar with the
// time, title, details and the visitor as a guest; then just add Google Meet and save.
export function googleCalendarLink(booking) {
  const stamp = (d) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const details = [
    `Consultation with ${booking.name}${booking.company ? ` (${booking.company})` : ""}`,
    `Email: ${booking.email}`,
    `Reference: ${booking.reference}`,
    "",
    "What they'd like to discuss:",
    booking.topic,
  ].join("\n");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `RealHive consultation: ${booking.name}`,
    dates: `${stamp(booking.startsAt)}/${stamp(booking.endsAt)}`,
    details,
    add: booking.email,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
