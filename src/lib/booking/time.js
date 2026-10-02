/**
 * Time-zone helpers for the booking calendar. Availability is defined as wall
 * clock times in the company's time zone (e.g. "09:00" in Africa/Nairobi) and
 * stored/compared as UTC instants. Pure functions on top of Intl, so they work
 * for any IANA zone, including ones with daylight saving.
 */

export const isValidTimeZone = (tz) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return typeof tz === "string" && tz.length > 0;
  } catch {
    return false;
  }
};

// Offset of `timeZone` from UTC at `date`, in ms (positive east of UTC).
export function tzOffsetMs(date, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(date).map((p) => [p.type, p.value])
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

// The UTC instant of wall-clock time `hm` ("HH:MM") on `ymd` ("YYYY-MM-DD") in `timeZone`.
export function zonedTimeToUtc(ymd, hm, timeZone) {
  const [y, m, d] = ymd.split("-").map(Number);
  const [H, M] = hm.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, H, M);
  const offset = tzOffsetMs(new Date(guess), timeZone);
  let utc = guess - offset;
  // around a DST change the offset at the result can differ from the guess's; settle on it
  const offset2 = tzOffsetMs(new Date(utc), timeZone);
  if (offset2 !== offset) utc = guess - offset2;
  return new Date(utc);
}

// "YYYY-MM-DD" of `date` as seen in `timeZone`.
export const ymdInZone = (date, timeZone) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

// Calendar arithmetic on "YYYY-MM-DD" strings (no time zone involved).
export const addDays = (ymd, days) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};
export const weekdayOf = (ymd) => new Date(`${ymd}T12:00:00Z`).getUTCDay(); // 0 = Sunday

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const formatInZone = (date, timeZone, options) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, ...options }).format(date);

// "Monday, 5 October 2026, 09:00–09:30"
export const formatRange = (start, end, timeZone) =>
  `${formatInZone(start, timeZone, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}, ` +
  `${formatInZone(start, timeZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}–` +
  `${formatInZone(end, timeZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}`;
