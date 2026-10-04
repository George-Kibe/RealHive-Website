import { addDays, weekdayOf, ymdInZone, zonedTimeToUtc } from "@/lib/booking/time";

/**
 * Whether a free slot is shown as taken. A share of slots (hiddenSlotPercent)
 * is held back so the calendar never looks empty. The choice looks random but
 * is a hash of the slot's start time, so it is the same on every request: the
 * page and the server always agree, and a slot never flickers in and out.
 */
const fnv1a = (text) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
};
export const isHiddenSlot = (startMs, percent) =>
  percent > 0 && fnv1a(`realhive-slot:${startMs}`) % 1000 < percent * 10;

/**
 * The bookable consultation slots. Pure (no I/O) so it's easy to test.
 *
 * For each day from today to today + horizonDays (in the company's time zone):
 * skip disabled weekdays and blocked dates, cut that day's hours into
 * slotMinutes-long slots, then drop slots that start within the minimum notice
 * period, are held back by hiddenSlotPercent (see isHiddenSlot), or overlap a
 * confirmed booking (overlap rather than equal start, so existing bookings
 * stay respected if the call length is changed later).
 *
 * @param settings  getCalendarSettings() output
 * @param bookings  [{ startsAt: Date, endsAt: Date }] confirmed bookings
 * @returns Date[] slot start instants (UTC), ascending
 */
export function computeSlots(settings, bookings = [], now = new Date()) {
  const { timezone, slotMinutes, minNoticeHours, horizonDays, weekly, blockedDates, hiddenSlotPercent = 0 } = settings;
  const slotMs = slotMinutes * 60 * 1000;
  const earliest = now.getTime() + minNoticeHours * 60 * 60 * 1000;
  const blocked = new Set(blockedDates.map((b) => b.date));
  const busy = bookings.map((b) => [new Date(b.startsAt).getTime(), new Date(b.endsAt).getTime()]);
  const today = ymdInZone(now, timezone);

  const slots = [];
  for (let i = 0; i <= horizonDays; i++) {
    const ymd = addDays(today, i);
    if (blocked.has(ymd)) continue;
    const hours = weekly.find((w) => w.day === weekdayOf(ymd));
    if (!hours?.enabled) continue;
    const dayStart = zonedTimeToUtc(ymd, hours.start, timezone).getTime();
    const dayEnd = zonedTimeToUtc(ymd, hours.end, timezone).getTime();
    for (let t = dayStart; t + slotMs <= dayEnd; t += slotMs) {
      if (t < earliest) continue;
      if (isHiddenSlot(t, hiddenSlotPercent)) continue;
      if (busy.some(([s, e]) => t < e && t + slotMs > s)) continue;
      slots.push(new Date(t));
    }
  }
  return slots;
}
