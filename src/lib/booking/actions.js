import "server-only";
import { connectDB } from "@/db/connectDB";
import { sendBookingCancellation, sendBookingConfirmation, sendBookingNotification } from "@/lib/emails";
import { buildIcs } from "@/lib/booking/ics";
import { getCalendarSettings } from "@/lib/booking/settings";
import { BookingInputError, getAvailableSlots, googleCalendarLink, hashToken, newBookingReference, newCancelToken, validateBookingInput } from "@/lib/booking/server";
import { formatRange } from "@/lib/booking/time";
import { clientIpHash } from "@/lib/quote/location";
import { CONTACT } from "@/lib/schema";
import { SITE, absoluteUrl } from "@/lib/seo";
import Booking from "@/models/BookingModel";

// Rate limits so the booking form can't be used to fill the calendar or spam inboxes.
const MAX_UPCOMING_PER_EMAIL = 2;
const MAX_PER_IP_PER_DAY = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

const icsFor = (booking, status = "CONFIRMED") =>
  buildIcs({
    uid: `${booking.reference}@realhiveconsultants.com`,
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    summary: "Consultation with RealHive Consultants",
    description: `Video call (Google Meet). We'll email you the link before the call.\nReference: ${booking.reference}`,
    organizerEmail: process.env.SENDER_EMAIL,
    url: SITE.url,
    status,
  });

/**
 * Book a consultation. Only a currently available slot can be booked; the
 * database's unique index stops two people taking the same one.
 * Returns the saved booking. Throws BookingInputError (409/422/429 cases).
 */
export async function createBooking(body) {
  const input = validateBookingInput(body);
  const { settings, slots } = await getAvailableSlots();
  if (!slots.some((s) => s.getTime() === input.startsAt.getTime())) {
    throw Object.assign(new BookingInputError("That time is no longer available. Please choose another."), { status: 409 });
  }

  await connectDB();
  const ipHash = await clientIpHash();
  const [upcoming, recentFromIp] = await Promise.all([
    Booking.countDocuments({ email: input.email, status: "confirmed", startsAt: { $gt: new Date() } }),
    Booking.countDocuments({ ipHash, createdAt: { $gte: new Date(Date.now() - DAY_MS) } }),
  ]);
  if (upcoming >= MAX_UPCOMING_PER_EMAIL) {
    throw Object.assign(new BookingInputError("You already have upcoming consultations booked. Please cancel one first, or contact us."), { status: 429 });
  }
  if (recentFromIp >= MAX_PER_IP_PER_DAY) {
    throw Object.assign(new BookingInputError("Too many bookings. Please try again tomorrow, or contact us directly."), { status: 429 });
  }

  const { token, hash } = newCancelToken();
  await Booking.init(); // make sure the unique slot index exists before the first insert
  let booking;
  try {
    booking = await Booking.create({
      ...input,
      timezone: input.timezone ?? settings.timezone,
      endsAt: new Date(input.startsAt.getTime() + settings.slotMinutes * 60 * 1000),
      reference: newBookingReference(),
      cancelTokenHash: hash,
      ipHash,
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw Object.assign(new BookingInputError("Someone just booked that time. Please choose another."), { status: 409 });
    }
    throw error;
  }

  const whenVisitor = formatRange(booking.startsAt, booking.endsAt, booking.timezone);
  const whenCompany = formatRange(booking.startsAt, booking.endsAt, settings.timezone);
  const emails = await Promise.allSettled([
    sendBookingConfirmation({
      booking, when: whenVisitor, ics: icsFor(booking),
      cancelUrl: absoluteUrl(`/booking/cancel?token=${token}`), siteUrl: SITE.url, phone: CONTACT.telephone,
    }),
    sendBookingNotification({
      booking, whenCompany, whenVisitor, companyTimezone: settings.timezone,
      calendarLink: googleCalendarLink(booking), adminUrl: absoluteUrl("/admin/calendar"), siteUrl: SITE.url,
    }),
  ]);
  for (const result of emails) {
    if (result.status === "rejected") console.error("Booking email failed: ", result.reason?.message);
  }
  return { booking, emailed: emails[0].status === "fulfilled" };
}

// The booking a visitor's cancel-link token belongs to (or null).
export async function findBookingByToken(token) {
  if (typeof token !== "string" || token.length < 20) return null;
  await connectDB();
  return Booking.findOne({ cancelTokenHash: hashToken(token) });
}

/**
 * Cancel a booking and email the other side. `by` is "visitor" (from their
 * cancel link: the team is told) or "admin" (from /admin/calendar: the visitor
 * is told). Returns the booking, or null if it was already cancelled or over.
 */
export async function cancelBooking(booking, by) {
  if (!booking || booking.status !== "confirmed" || booking.endsAt <= new Date()) return null;
  booking.status = "cancelled";
  booking.cancelledAt = new Date();
  booking.cancelledBy = by;
  await booking.save();

  const settings = await getCalendarSettings();
  try {
    if (by === "visitor") {
      await sendBookingCancellation({ booking, when: formatRange(booking.startsAt, booking.endsAt, settings.timezone), byVisitor: true, siteUrl: SITE.url });
    } else {
      await sendBookingCancellation({
        booking, when: formatRange(booking.startsAt, booking.endsAt, booking.timezone), to: booking.email, byVisitor: false,
        rebookUrl: absoluteUrl("/book"), siteUrl: SITE.url, ics: icsFor(booking, "CANCELLED"),
      });
    }
  } catch (error) {
    console.error("Booking cancellation email failed: ", error.message);
  }
  return booking;
}
