import { addDays, weekdayOf, ymdInZone, zonedTimeToUtc } from "@/lib/booking/time";

/**
 * The bookable consultation slots. Pure (no I/O) so it's easy to test.
 *
 * For each day from today to today + horizonDays (in the company's time zone):
 * skip disabled weekdays and blocked dates, cut that day's hours into
 * slotMinutes-long slots, then drop slots that start within the minimum notice
 * period or overlap a confirmed booking (overlap rather than equal start, so
 * existing bookings stay respected if the call length is changed later).
 *
 * @param settings  getCalendarSettings() output
 * @param bookings  [{ startsAt: Date, endsAt: Date }] confirmed bookings
 * @returns Date[] slot start instants (UTC), ascending
 */
export function computeSlots(settings, bookings = [], now = new Date()) {
  const { timezone, slotMinutes, minNoticeHours, horizonDays, weekly, blockedDates } = settings;
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
      if (busy.some(([s, e]) => t < e && t + slotMs > s)) continue;
      slots.push(new Date(t));
    }
  }
  return slots;
}
