/**
 * A minimal iCalendar (RFC 5545) event, attached to the visitor's confirmation
 * email so they can add the call to their own calendar. METHOD:PUBLISH (not
 * REQUEST): it's an "add to calendar" file, not a meeting invitation.
 */

const stamp = (date) => new Date(date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

// Escape TEXT values: backslash, semicolon, comma and newlines.
const escapeText = (value = "") =>
  String(value).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Lines longer than 75 octets are folded with CRLF + space.
const fold = (line) => {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const parts = [];
  let start = 0;
  while (start < bytes.length) {
    let end = Math.min(start + (parts.length ? 74 : 75), bytes.length);
    // don't split a multi-byte UTF-8 character
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
  }
  return parts.join("\r\n ");
};

export function buildIcs({ uid, startsAt, endsAt, summary, description, organizerEmail, url, status = "CONFIRMED" }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RealHive Consultants//Bookings//EN",
    "CALSCALE:GREGORIAN",
    status === "CANCELLED" ? "METHOD:CANCEL" : "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(startsAt)}`,
    `DTEND:${stamp(endsAt)}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    ...(url ? [`URL:${url}`] : []),
    ...(organizerEmail ? [`ORGANIZER;CN=RealHive Consultants:mailto:${organizerEmail}`] : []),
    `STATUS:${status}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
