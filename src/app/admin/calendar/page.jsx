import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import { getCalendarSettings, SLOT_LENGTHS } from "@/lib/booking/settings";
import { googleCalendarLink } from "@/lib/booking/server";
import { isGoogleCalendarConfigured } from "@/lib/booking/google";
import { formatRange } from "@/lib/booking/time";
import Booking from "@/models/BookingModel";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminBookings from "@/components/admin/AdminBookings";
import CalendarSettingsForm from "@/components/admin/CalendarSettingsForm";

export const metadata = { title: "Calendar" };

const DAY_MS = 24 * 60 * 60 * 1000;

// The company's consultation calendar: bookings, working hours and blocked days.
export default async function AdminCalendarPage() {
  // getAdmin() also connects to the database
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const settings = await getCalendarSettings();
  const now = new Date();
  const [upcoming, recent] = await Promise.all([
    Booking.find({ status: "confirmed", endsAt: { $gt: now } }).sort({ startsAt: 1 }).lean(),
    Booking.find({ $or: [{ status: "cancelled" }, { endsAt: { $lte: now } }], startsAt: { $gte: new Date(now.getTime() - 30 * DAY_MS) } })
      .sort({ startsAt: -1 }).limit(50).lean(),
  ]);
  const view = (b) => ({
    _id: b._id.toString(),
    reference: b.reference,
    name: b.name,
    email: b.email,
    company: b.company ?? "",
    topic: b.topic,
    status: b.status,
    cancelledBy: b.cancelledBy ?? null,
    when: formatRange(b.startsAt, b.endsAt, settings.timezone),
    visitorWhen: b.timezone !== settings.timezone ? `${formatRange(b.startsAt, b.endsAt, b.timezone)} (${b.timezone})` : null,
    calendarLink: googleCalendarLink(b),
    meetLink: b.meetLink ?? null,
    eventLink: b.googleEventLink ?? null,
    meetError: b.meetError ?? null,
  });
  const googleConnected = isGoogleCalendarConfigured();

  return (
    <div>
      <AdminHeader title="Consultation calendar" email={admin.email} current="/admin/calendar" />
      <p className="mt-4 text-sm text-muted-foreground">
        Visitors book free consultations at <a href="/book" className="underline">/book</a>. All times here are {settings.timezone}.{" "}
        {googleConnected
          ? "Google Calendar is connected: each booking gets a Google Meet link and an event on your calendar, and the client is invited automatically."
          : "Google Calendar isn't connected yet (see docs/SEO-PROGRESS.md), so each booking emails you a link that opens Google Calendar pre-filled: add Google Meet and save."}
      </p>
      <AdminBookings upcoming={upcoming.map(view)} recent={recent.map(view)} />
      <CalendarSettingsForm initial={settings} slotLengths={SLOT_LENGTHS} />
    </div>
  );
}
