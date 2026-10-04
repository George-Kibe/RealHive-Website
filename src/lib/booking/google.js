import "server-only";

/**
 * Google Calendar + Meet for consultation bookings, via the Calendar REST API.
 *
 * Each booking becomes an event on the company calendar (GOOGLE_CALENDAR_ID,
 * default the account's "primary") with a Google Meet link and the client as
 * a guest; Google emails the client the invitation. Cancelling deletes it.
 *
 * Auth is OAuth 2.0 as the calendar's owner (a personal Gmail account can't
 * use a service account for this): GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET
 * from a Google Cloud OAuth client, and a long-lived GOOGLE_REFRESH_TOKEN made
 * once with `npm run google-auth`. Without them, bookings still work: the team
 * gets the pre-filled "Create in Google Calendar" link instead.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/calendar/v3";
const TIMEOUT_MS = 8000;

export const isGoogleCalendarConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);

const calendarId = () => encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || "primary");

let cached = { token: null, expiresAt: 0 };

async function accessToken() {
  if (cached.token && Date.now() < cached.expiresAt - 60_000) return cached.token;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    // invalid_grant = the refresh token was revoked or expired: run `npm run google-auth` again
    throw new Error(`Google sign-in failed (${data.error ?? res.status}): ${data.error_description ?? "no access token"}`);
  }
  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cached.token;
}

async function calendarFetch(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { authorization: `Bearer ${await accessToken()}`, ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (method === "DELETE" && (res.status === 204 || res.status === 404 || res.status === 410)) return null; // gone either way
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Google Calendar ${method} failed (${res.status}): ${data.error?.message ?? "unknown error"}`);
  return data;
}

const meetLinkOf = (event) =>
  event.hangoutLink ?? event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ?? null;

/**
 * Create the calendar event with a Google Meet link and invite the client.
 * Returns { eventId, eventLink, meetLink } (meetLink may be null if Google is
 * still generating it after a short wait).
 */
export async function createMeetEvent({ reference, name, email, company, topic, startsAt, endsAt }) {
  const event = await calendarFetch(`/calendars/${calendarId()}/events?conferenceDataVersion=1&sendUpdates=all`, {
    method: "POST",
    body: {
      summary: `RealHive consultation: ${name}${company ? ` (${company})` : ""}`,
      description: [
        `Free consultation with RealHive Consultants.`,
        ``,
        `What ${name} would like to discuss:`,
        topic,
        ``,
        `Reference: ${reference}`,
      ].join("\n"),
      start: { dateTime: new Date(startsAt).toISOString() },
      end: { dateTime: new Date(endsAt).toISOString() },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: { requestId: reference, conferenceSolutionKey: { type: "hangoutsMeet" } },
      },
      guestsCanModify: false,
      reminders: { useDefault: true },
    },
  });

  let meetLink = meetLinkOf(event);
  // Meet links are usually ready at once; if Google reports "pending", look again briefly.
  for (let i = 0; !meetLink && i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    meetLink = meetLinkOf(await calendarFetch(`/calendars/${calendarId()}/events/${encodeURIComponent(event.id)}`));
  }
  return { eventId: event.id, eventLink: event.htmlLink ?? null, meetLink };
}

// Delete the event (Google tells the client it's cancelled). Already gone = fine.
export async function deleteMeetEvent(eventId) {
  if (!eventId) return;
  await calendarFetch(`/calendars/${calendarId()}/events/${encodeURIComponent(eventId)}?sendUpdates=all`, { method: "DELETE" });
}
