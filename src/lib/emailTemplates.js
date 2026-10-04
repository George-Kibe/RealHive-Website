/**
 * Every email the site sends, built on one layout so they all share the brand
 * look: RealHive wordmark in the brand blue, a white card on a light grey page,
 * the same buttons, code boxes and detail tables, and a footer with the real
 * contact details.
 *
 * Email clients ignore <style> blocks and most CSS, so everything is inline
 * styles on simple elements. Every value that comes from a visitor (names,
 * messages, topics…) MUST go through escapeHtml before it is placed here.
 */
import { CONTACT } from "@/lib/schema";
import { SITE } from "@/lib/seo";

export const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const BRAND = "#0077A3";
const INK = "#0f172a";
const MUTED = "#64748b";
const RULE = "#e2e8f0";
const PANEL = "#f1f5f9";

const siteHost = () => SITE.url.replace(/^https?:\/\//, "");
const link = (path) => `${SITE.url}${path}`;

// --- building blocks (arguments are trusted HTML unless noted) ---

export const heading = (text) =>
  `<h1 style="margin: 0 0 16px; font-size: 22px; line-height: 1.3; color: ${BRAND};">${escapeHtml(text)}</h1>`;

export const paragraph = (html) => `<p style="margin: 0 0 14px;">${html}</p>`;

export const muted = (html) => `<p style="margin: 0 0 14px; font-size: 13px; color: ${MUTED};">${html}</p>`;

export const button = (href, label) =>
  `<p style="margin: 22px 0;"><a href="${escapeHtml(href)}" style="background-color: ${BRAND}; color: #ffffff; padding: 11px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">${escapeHtml(label)}</a></p>`;

// a one-time code, big and easy to copy
export const codeBox = (code) =>
  `<p style="margin: 22px 0; text-align: center;"><span style="display: inline-block; background-color: ${PANEL}; border: 1px solid ${RULE}; border-radius: 8px; padding: 12px 22px; font-size: 30px; font-weight: bold; letter-spacing: 6px; color: ${INK}; font-family: 'Courier New', monospace;">${escapeHtml(code)}</span></p>`;

// a highlighted box, e.g. the booked time
export const callout = (html) =>
  `<p style="margin: 0 0 16px; background-color: ${PANEL}; padding: 12px 16px; border-radius: 6px;">${html}</p>`;

// rows of [label, value]; values are escaped here, line breaks kept
export const detailsTable = (rows) =>
  `<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 4px 0 18px;">${rows
    .map(([label, value]) =>
      `<tr><td style="padding: 6px 12px 6px 0; color: ${MUTED}; vertical-align: top; white-space: nowrap; font-size: 14px;">${escapeHtml(label)}</td>` +
      `<td style="padding: 6px 0; font-size: 14px; white-space: pre-line;">${escapeHtml(value)}</td></tr>`)
    .join("")}</table>`;

// rows of [label, value] with the value right-aligned and bold (prices, totals); escaped here
export const amountsTable = (rows) =>
  `<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 4px 0 18px;">${rows
    .map(([label, value]) =>
      `<tr><td style="padding: 8px 0; border-bottom: 1px solid ${RULE};">${escapeHtml(label)}</td>` +
      `<td style="padding: 8px 0; border-bottom: 1px solid ${RULE}; text-align: right; font-weight: bold;">${escapeHtml(value)}</td></tr>`)
    .join("")}</table>`;

export const signOff = () => paragraph(`Best regards,<br>RealHive Consultants`);

/**
 * The shared layout. `preheader` = the preview line inbox lists show next to
 * the subject. `internal` = a notification for the team (shorter footer).
 */
export const emailLayout = ({ title, preheader = "", body, internal = false }) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(title)}</title></head>
<body style="margin: 0; padding: 0; background-color: ${PANEL};">
<span style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${escapeHtml(preheader)}</span>
<div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.6; color: ${INK}; max-width: 600px; margin: 0 auto; padding: 24px 16px;">
  <p style="margin: 0 0 16px; font-size: 18px; font-weight: bold; color: ${BRAND};">RealHive Consultants</p>
  <div style="background-color: #ffffff; padding: 28px; border-radius: 8px; border: 1px solid ${RULE};">
${body}
  </div>
  <p style="margin: 18px 0 0; text-align: center; color: ${MUTED}; font-size: 12px; line-height: 1.7;">
    ${internal ? `Sent by the ${escapeHtml(siteHost())} website.` : `RealHive Consultants · Nairobi, Kenya<br>
    <a href="${SITE.url}" style="color: ${BRAND};">${escapeHtml(siteHost())}</a> · <a href="mailto:${CONTACT.email}" style="color: ${BRAND};">${CONTACT.email}</a> · ${CONTACT.telephone}<br>
    <a href="https://www.instagram.com/realhiveconsultants/" style="color: ${BRAND};">Instagram</a> · <a href="https://x.com/kibegeorge_" style="color: ${BRAND};">X</a>`}
  </p>
</div>
</body></html>`;

// --- accounts ---

export const verificationEmail = ({ code }) => emailLayout({
  title: "Confirm your email",
  preheader: `Your verification code is ${code}`,
  body: [
    heading("Confirm your email"),
    paragraph("Thanks for creating an account with RealHive Consultants. Your verification code is:"),
    codeBox(code),
    paragraph("Enter it on the sign-up page to finish creating your account. The code expires in 24 hours."),
    muted("Didn't sign up? You can ignore this email; no account is created without the code."),
    signOff(),
  ].join("\n"),
});

export const welcomeEmail = ({ name }) => emailLayout({
  title: "Welcome to RealHive Consultants",
  preheader: "Your account is ready.",
  body: [
    heading("Welcome to RealHive Consultants"),
    paragraph(`Hi ${escapeHtml(name)},`),
    paragraph("Your account is ready. You can now join the conversation on our blog, where we write about AI, data and software engineering."),
    button(link("/blog"), "Read the blog"),
    paragraph("We're a software development company building web and mobile apps, data pipelines and AI solutions for startups and growing businesses. If you have a project in mind, you can get an instant estimate or book a free consultation:"),
    paragraph(`<a href="${link("/quote")}" style="color: ${BRAND};">Get a quote</a> &nbsp;·&nbsp; <a href="${link("/book")}" style="color: ${BRAND};">Book a free consultation</a>`),
    signOff(),
  ].join("\n"),
});

export const resetCodeEmail = ({ code }) => emailLayout({
  title: "Reset your password",
  preheader: `Your password reset code is ${code}`,
  body: [
    heading("Reset your password"),
    paragraph("We received a request to reset your password. Your reset code is:"),
    codeBox(code),
    paragraph("Enter it on the password reset page together with your new password. The code expires in 10 minutes."),
    muted("Didn't ask to reset your password? Ignore this email: your password stays the same."),
    signOff(),
  ].join("\n"),
});

export const passwordChangedEmail = ({ name }) => emailLayout({
  title: "Your password was changed",
  preheader: "Your RealHive Consultants password was just changed.",
  body: [
    heading("Your password was changed"),
    paragraph(`Hi ${escapeHtml(name)},`),
    paragraph("This is a confirmation that the password for your RealHive Consultants account was just changed."),
    paragraph(`<strong>Wasn't you?</strong> Reply to this email or contact us at ${CONTACT.email} straight away, and reset your password again from the sign-in page.`),
    muted("For your security: use a password you don't use on any other site."),
    signOff(),
  ].join("\n"),
});

// --- contact form (to the team) ---

export const enquiryAlertEmail = ({ name, email, phone, message }) => emailLayout({
  title: "New enquiry",
  preheader: `${name}: ${message}`.slice(0, 120),
  internal: true,
  body: [
    heading("New enquiry from the website"),
    detailsTable([["Name", name], ["Email", email], ["Phone", phone || "-"]]),
    paragraph("<strong>Message</strong>"),
    callout(escapeHtml(message).replace(/\n/g, "<br>")),
    button(`mailto:${email}?subject=${encodeURIComponent("Re: your enquiry to RealHive Consultants")}`, `Reply to ${name}`),
    muted("Replying to this email also goes straight to them."),
  ].join("\n"),
});

// --- quotes ---

// rows: [label, value] already formatted by the caller
export const quoteEmail = ({ name, reference, rows, currency }) => emailLayout({
  title: "Your project estimate",
  preheader: `Your estimate ${reference} is attached.`,
  body: [
    heading("Your project estimate"),
    muted(`Reference ${escapeHtml(reference)}`),
    paragraph(`Hi ${escapeHtml(name)},`),
    paragraph("Thanks for using our quotation tool. Your estimate is attached as a PDF. In short:"),
    amountsTable(rows),
    muted(`These are indicative "starting from" prices in ${escapeHtml(currency)}, not a fixed quote. The final price depends on your detailed requirements and is agreed after a free discovery call.`),
    paragraph(`Reply to this email or <a href="${link("/book")}" style="color: ${BRAND};">book a free consultation</a> to talk it through.`),
    signOff(),
  ].join("\n"),
});

// rows: [label, value] already formatted by the caller (internal: may include country/tier)
export const quoteNotificationEmail = ({ reference, rows }) => emailLayout({
  title: "New quote request",
  preheader: `Quote ${reference}`,
  internal: true,
  body: [heading(`New quote request ${reference}`), detailsTable(rows), muted("The PDF they received is attached.")].join("\n"),
});

// --- consultation bookings ---

export const bookingConfirmationEmail = ({ name, reference, when, timezone, topic, cancelUrl, meetLink }) => emailLayout({
  title: "Your consultation is booked",
  preheader: `Booked: ${when}`,
  body: [
    heading("Your consultation is booked"),
    muted(`Reference ${escapeHtml(reference)}`),
    paragraph(`Hi ${escapeHtml(name)},`),
    paragraph("Thanks for booking a consultation with RealHive Consultants. Here are the details:"),
    callout(`<strong>${escapeHtml(when)}</strong><br><span style="color: ${MUTED}; font-size: 13px;">Times in ${escapeHtml(timezone)} · Video call (Google Meet)</span>`),
    ...(meetLink
      ? [
          button(meetLink, "Join with Google Meet"),
          muted(`Meeting link: <a href="${escapeHtml(meetLink)}" style="color: ${BRAND};">${escapeHtml(meetLink)}</a><br>You'll also receive a Google Calendar invitation for the call.`),
        ]
      : [paragraph("We'll email you the Google Meet link before the call. The attached calendar file adds it to your calendar.")]),
    muted(`You told us you'd like to discuss:<br>${escapeHtml(topic).replace(/\n/g, "<br>")}`),
    paragraph(`Can't make it? <a href="${escapeHtml(cancelUrl)}" style="color: ${BRAND};">Cancel this booking</a> and book another time, or call us on ${CONTACT.telephone}.`),
    paragraph("Talk soon,<br>RealHive Consultants"),
  ].join("\n"),
});

// With meetLink: the event and Meet link were created automatically. Without: the
// team creates it from the pre-filled link (meetError says why, when Google failed).
export const bookingNotificationEmail = ({ rows, email, calendarLink, adminUrl, meetLink, eventLink, meetError }) => emailLayout({
  title: "New consultation booking",
  preheader: rows[0]?.[1] ?? "",
  internal: true,
  body: [
    heading("New consultation booking"),
    detailsTable(rows),
    ...(meetLink
      ? [
          callout(`<strong>Google Meet:</strong> <a href="${escapeHtml(meetLink)}" style="color: ${BRAND};">${escapeHtml(meetLink)}</a>`),
          button(meetLink, "Join the call"),
          muted(`The event is on your Google Calendar and ${escapeHtml(email)} has been sent the invitation.${eventLink ? ` <a href="${escapeHtml(eventLink)}" style="color: ${BRAND};">Open the event</a>` : ""}`),
        ]
      : [
          ...(meetError ? [callout(`<strong>The Google Meet link couldn't be created automatically:</strong><br>${escapeHtml(meetError)}`)] : []),
          button(calendarLink, "Create in Google Calendar"),
          muted(`The event opens pre-filled with the time, details and ${escapeHtml(email)} as a guest. Click <em>Add Google Meet video conferencing</em>, then <em>Save</em> and send the invitation.`),
        ]),
    paragraph(`<a href="${escapeHtml(adminUrl)}" style="color: ${BRAND}; font-size: 13px;">Manage bookings</a>`),
  ].join("\n"),
});

export const bookingCancelledByVisitorEmail = ({ name, email, when, reference }) => emailLayout({
  title: "Consultation cancelled",
  preheader: `${name} cancelled their consultation`,
  internal: true,
  body: [
    heading("Consultation cancelled by the visitor"),
    paragraph(`<strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) cancelled their consultation on <strong>${escapeHtml(when)}</strong> (${escapeHtml(reference)}).`),
    muted("Remove the Google Calendar event if you created one."),
  ].join("\n"),
});

export const bookingCancelledByTeamEmail = ({ name, when, reference, rebookUrl }) => emailLayout({
  title: "Your consultation has been cancelled",
  preheader: `Your consultation on ${when} has been cancelled`,
  body: [
    heading("Your consultation has been cancelled"),
    paragraph(`Hi ${escapeHtml(name)},`),
    paragraph(`Unfortunately we've had to cancel your consultation on <strong>${escapeHtml(when)}</strong> (${escapeHtml(reference)}). Sorry for the inconvenience. Please pick another time that suits you:`),
    button(rebookUrl, "Book another time"),
    signOff(),
  ].join("\n"),
});
