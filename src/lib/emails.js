import nodemailer from 'nodemailer';
import {
    bookingCancelledByTeamEmail,
    bookingCancelledByVisitorEmail,
    bookingConfirmationEmail,
    bookingNotificationEmail,
    enquiryAlertEmail,
    passwordChangedEmail,
    quoteEmail,
    quoteNotificationEmail,
    resetCodeEmail,
    verificationEmail,
    welcomeEmail,
} from "./emailTemplates";

/**
 * Sending every email the site sends. Templates (and their HTML escaping) live
 * in emailTemplates.js; this file decides who gets what, from whom, with which
 * subject and attachments. All mail goes through Gmail SMTP as SENDER_EMAIL.
 */

const transport = () => nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Visitor-facing mail comes from the company; team notifications from "the website".
const fromCompany = () => `"RealHive Consultants" <${process.env.SENDER_EMAIL}>`;
const fromWebsite = () => `"RealHive website" <${process.env.SENDER_EMAIL}>`;

// Where team notifications go. Each falls back to the next, then to SENDER_EMAIL.
// The contact form keeps going to the address it always used unless ENQUIRIES_NOTIFY_EMAIL is set.
const inbox = {
    enquiries: () => process.env.ENQUIRIES_NOTIFY_EMAIL || "georgekibew@gmail.com",
    quotes: () => process.env.QUOTES_NOTIFY_EMAIL || process.env.SENDER_EMAIL,
    bookings: () => process.env.BOOKINGS_NOTIFY_EMAIL || process.env.QUOTES_NOTIFY_EMAIL || process.env.SENDER_EMAIL,
};

// Header values can't contain line breaks (they would start a new header).
const oneLine = (value = "") => String(value).replace(/[\r\n]+/g, " ").trim();

const send = async (label, options) => {
    try {
        await transport().sendMail(options);
    } catch (error) {
        console.error(`Error sending ${label} email`, error);
        throw new Error(`Error sending ${label} email: ${error}`);
    }
};

// ---- accounts ----

export const sendVerificationEmail = (email, verificationToken) =>
    send("verification", {
        from: fromCompany(),
        to: email,
        subject: "Your RealHive Consultants verification code",
        html: verificationEmail({ code: verificationToken }),
    });

export const sendWelcomeEmail = (email, name) =>
    send("welcome", {
        from: fromCompany(),
        to: email,
        replyTo: process.env.SENDER_EMAIL,
        subject: "Welcome to RealHive Consultants",
        html: welcomeEmail({ name }),
    });

// the 6-digit code for resetting a password (website and mobile app)
export const sendResetPasswordMobileEmail = (email, otp) =>
    send("password reset", {
        from: fromCompany(),
        to: email,
        subject: "Your password reset code",
        html: resetCodeEmail({ code: otp }),
    });

export const sendPasswordResetSuccessEmail = (email, username) =>
    send("password changed", {
        from: fromCompany(),
        to: email,
        replyTo: process.env.SENDER_EMAIL,
        subject: "Your RealHive Consultants password was changed",
        html: passwordChangedEmail({ name: username }),
    });

// ---- contact form ----

// an enquiry from the contact form, to the team; replying goes to the visitor
export const sendEnquiryAlert = ({ name, email, phone, message }) =>
    send("enquiry", {
        from: fromWebsite(),
        to: inbox.enquiries(),
        replyTo: email,
        subject: `New enquiry from ${oneLine(name)}`,
        html: enquiryAlertEmail({ name, email, phone, message }),
    });

// ---- quotes ----

// email the visitor their quotation PDF
export const sendQuoteEmail = ({ to, name, quote, pdf, formatMoney }) => {
    const rows = [
        ...quote.items.map((i) => [i.name, `from ${formatMoney(i.from, quote.currency)}${i.monthly ? " / month" : ""}`]),
        ...(quote.projectFrom > 0 ? [["Estimated project investment", `from ${formatMoney(quote.projectFrom, quote.currency)}`]] : []),
        ...(quote.weeksFrom > 0 ? [["Typical timeline", `from ${quote.weeksFrom} weeks`]] : []),
    ];
    return send("quote", {
        from: fromCompany(),
        to,
        replyTo: process.env.SENDER_EMAIL,
        subject: `Your project estimate (${quote.reference})`,
        html: quoteEmail({ name, reference: quote.reference, rows, currency: quote.currency }),
        attachments: [{ filename: `RealHive-estimate-${quote.reference}.pdf`, content: Buffer.from(pdf), contentType: "application/pdf" }],
    });
};

// tell the team a quote was requested (a sales lead), with the same PDF.
// Internal only: unlike everything the visitor sees, it shows country, tier and USD.
export const sendQuoteNotification = ({ quote, contact, pdf, formatMoney }) => {
    const both = (local, usd) => quote.currency === "USD" ? formatMoney(usd, "USD") : `${formatMoney(local, quote.currency)} (≈ ${formatMoney(usd, "USD")})`;
    const rows = [
        ["Reference", quote.reference],
        ["Name", contact.name],
        ["Email", contact.email],
        ["Company", contact.company || "-"],
        ["Country", quote.countryDetected ? `${quote.countryName} (from IP)` : "Unknown (location not detected)"],
        ["Pricing tier", quote.tierLabel],
        ["Build level", quote.buildLevelLabel],
        ["Services", quote.items.map((i) => i.name).join(", ")],
        ["Project from", both(quote.projectFrom, quote.projectFromUsd)],
        ["Support from", quote.monthlyFrom ? `${both(quote.monthlyFrom, quote.monthlyFromUsd)} / month` : "-"],
        ["Notes", contact.notes || "-"],
    ];
    return send("quote notification", {
        from: fromWebsite(),
        to: inbox.quotes(),
        replyTo: contact.email,
        subject: `New quote request: ${oneLine(contact.name)} (${quote.countryName}, from ${formatMoney(quote.projectFromUsd, "USD")})`,
        html: quoteNotificationEmail({ reference: quote.reference, rows }),
        attachments: [{ filename: `RealHive-estimate-${quote.reference}.pdf`, content: Buffer.from(pdf), contentType: "application/pdf" }],
    });
};

// ---- consultation bookings ----

// confirmation to the visitor, with an .ics file and a cancel link
export const sendBookingConfirmation = ({ booking, when, ics, cancelUrl }) =>
    send("booking confirmation", {
        from: fromCompany(),
        to: booking.email,
        replyTo: process.env.SENDER_EMAIL,
        subject: `Consultation booked: ${when} (${booking.reference})`,
        html: bookingConfirmationEmail({ name: booking.name, reference: booking.reference, when, timezone: booking.timezone, topic: booking.topic, cancelUrl }),
        icalEvent: { method: "PUBLISH", filename: "consultation.ics", content: ics },
    });

// notification to the team, with a pre-filled Google Calendar link (add Meet, save)
export const sendBookingNotification = ({ booking, whenCompany, whenVisitor, companyTimezone, calendarLink, adminUrl }) =>
    send("booking notification", {
        from: fromWebsite(),
        to: inbox.bookings(),
        replyTo: booking.email,
        subject: `New consultation: ${oneLine(booking.name)}, ${whenCompany}`,
        html: bookingNotificationEmail({
            rows: [
                ["When (your time)", `${whenCompany} (${companyTimezone})`],
                ["Their time", `${whenVisitor} (${booking.timezone})`],
                ["Name", booking.name],
                ["Email", booking.email],
                ["Company", booking.company || "-"],
                ["Reference", booking.reference],
                ["Topic", booking.topic],
            ],
            email: booking.email,
            calendarLink,
            adminUrl,
        }),
    });

// cancellation: to the visitor when the team cancels, or to the team when the visitor does
export const sendBookingCancellation = ({ booking, when, to, byVisitor, rebookUrl, ics }) =>
    send("booking cancellation", byVisitor
        ? {
            from: fromWebsite(),
            to: to ?? inbox.bookings(),
            replyTo: booking.email,
            subject: `Cancelled: consultation with ${oneLine(booking.name)} (${when})`,
            html: bookingCancelledByVisitorEmail({ name: booking.name, email: booking.email, when, reference: booking.reference }),
        }
        : {
            from: fromCompany(),
            to: to ?? booking.email,
            replyTo: process.env.SENDER_EMAIL,
            subject: `Your consultation on ${when} has been cancelled`,
            html: bookingCancelledByTeamEmail({ name: booking.name, when, reference: booking.reference, rebookUrl }),
            ...(ics ? { icalEvent: { method: "CANCEL", filename: "consultation.ics", content: ics } } : {}),
        });
