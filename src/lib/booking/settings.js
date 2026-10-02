import "server-only";
import { connectDB } from "@/db/connectDB";
import CalendarSettings from "@/models/CalendarSettingsModel";
import { isValidTimeZone } from "@/lib/booking/time";

/**
 * The company calendar's settings (one document). Defaults: Monday–Friday
 * 09:00–17:00 Nairobi time, 30-minute calls, at least 12 hours' notice, up to
 * 30 days ahead.
 */

export const SLOT_LENGTHS = [15, 20, 30, 45, 60, 90];
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const YMD = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const DEFAULT_WEEKLY = [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, enabled: day >= 1 && day <= 5, start: "09:00", end: "17:00" }));

const plain = (doc) => ({
  timezone: doc.timezone,
  slotMinutes: doc.slotMinutes,
  minNoticeHours: doc.minNoticeHours,
  horizonDays: doc.horizonDays,
  weekly: [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const w = doc.weekly?.find((x) => x.day === day) ?? DEFAULT_WEEKLY[day];
    return { day, enabled: Boolean(w.enabled), start: w.start, end: w.end };
  }),
  blockedDates: (doc.blockedDates ?? []).map((b) => ({ date: b.date, reason: b.reason ?? "" })).sort((a, b) => a.date.localeCompare(b.date)),
});

export async function getCalendarSettings() {
  await connectDB();
  const doc = await CalendarSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default", weekly: DEFAULT_WEEKLY } },
    { upsert: true, returnDocument: "after", lean: true }
  );
  return plain(doc);
}

export class SettingsError extends Error {}

// Validate admin input; throws SettingsError with a readable message.
export function validateSettings(body = {}) {
  const timezone = body.timezone ?? "Africa/Nairobi";
  if (!isValidTimeZone(timezone)) throw new SettingsError("Unknown time zone");
  const slotMinutes = Number(body.slotMinutes);
  if (!SLOT_LENGTHS.includes(slotMinutes)) throw new SettingsError(`Call length must be one of ${SLOT_LENGTHS.join(", ")} minutes`);
  const minNoticeHours = Number(body.minNoticeHours);
  if (!Number.isInteger(minNoticeHours) || minNoticeHours < 0 || minNoticeHours > 168) throw new SettingsError("Minimum notice must be 0–168 hours");
  const horizonDays = Number(body.horizonDays);
  if (!Number.isInteger(horizonDays) || horizonDays < 1 || horizonDays > 90) throw new SettingsError("Booking window must be 1–90 days");

  const weekly = [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const w = (body.weekly ?? []).find((x) => Number(x?.day) === day) ?? DEFAULT_WEEKLY[day];
    const entry = { day, enabled: Boolean(w.enabled), start: String(w.start ?? "09:00"), end: String(w.end ?? "17:00") };
    if (!TIME.test(entry.start) || !TIME.test(entry.end)) throw new SettingsError("Times must be HH:MM");
    if (entry.enabled && entry.start >= entry.end) throw new SettingsError("Each day's end time must be after its start time");
    return entry;
  });

  const seen = new Set();
  const blockedDates = [];
  for (const b of body.blockedDates ?? []) {
    const date = String(b?.date ?? "");
    if (!YMD.test(date)) throw new SettingsError("Blocked dates must be YYYY-MM-DD");
    if (seen.has(date)) continue;
    seen.add(date);
    blockedDates.push({ date, reason: String(b?.reason ?? "").trim().slice(0, 100) });
  }
  if (blockedDates.length > 366) throw new SettingsError("Too many blocked dates");

  return { timezone, slotMinutes, minNoticeHours, horizonDays, weekly, blockedDates };
}

export async function saveCalendarSettings(values) {
  await connectDB();
  const doc = await CalendarSettings.findOneAndUpdate(
    { key: "default" },
    { $set: values },
    { upsert: true, returnDocument: "after", lean: true, runValidators: true }
  );
  return plain(doc);
}
